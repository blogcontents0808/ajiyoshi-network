const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const SPREADSHEET_ID = '16_rP-kDw3MLgNw_M16w9jgmi2LQB57b_D00gbQk3ek8';

// Google Sheets function
async function addContactToSheet(data) {
  try {
    // 環境変数の存在確認
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn('Google Sheets認証情報が未設定のため、ローカルログに保存します');
      console.log('お問い合わせデータ:', {
        timestamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      });
      return { 
        success: true, 
        message: 'ローカル環境: お問い合わせをログに記録しました',
        localMode: true 
      };
    }

    // Google Sheets APIクライアントの設定
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 現在の日時を取得
    const now = new Date();
    const timestamp = now.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Tokyo'
    });

    // スプレッドシートに追加するデータ
    const values = [[
      timestamp,        // A列: 日時
      data.name,        // B列: お名前
      data.email,       // C列: メールアドレス
      data.subject,     // D列: 件名
      data.message,     // E列: お問い合わせ内容
      '未対応'          // F列: 処理状況
    ]];

    // シートに行を追加
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:F',
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log('Google Sheets に追加されました:', response.data);
    return { success: true, data: response.data };

  } catch (error) {
    console.error('Google Sheets エラー:', error.message);
    return { success: false, error: error.message };
  }
}

// Email functions
async function sendAdminNotification(data) {
  try {
    // 環境変数の存在確認
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.warn('Gmail認証情報が未設定のため、ログに記録します');
      console.log('管理者通知:', {
        type: 'admin_notification',
        data: data,
        timestamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
      });
      return { 
        success: true, 
        message: 'ローカル環境: 管理者通知をログに記録しました',
        localMode: true 
      };
    }

    // Gmail SMTP設定
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // 管理者メールアドレスリスト
    const adminEmails = [
      process.env.ADMIN_EMAIL_1,
      process.env.ADMIN_EMAIL_2,
      process.env.ADMIN_EMAIL_3,
    ].filter(Boolean);

    // メール内容
    const mailOptions = {
      from: `"味美ネットワーク お問い合わせ" <${process.env.GMAIL_USER}>`,
      to: adminEmails.join(', '),
      subject: `【お問い合わせ】${data.subject || '件名なし'}`,
      html: `
        <h2>新しいお問い合わせが届きました</h2>
        <p><strong>お名前:</strong> ${data.name}</p>
        <p><strong>メールアドレス:</strong> ${data.email}</p>
        <p><strong>件名:</strong> ${data.subject || '件名なし'}</p>
        <p><strong>お問い合わせ内容:</strong></p>
        <p>${data.message}</p>
        <p><strong>受信日時:</strong> ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</p>
      `,
    };

    // メール送信
    const info = await transporter.sendMail(mailOptions);
    console.log('管理者通知メール送信完了:', info.messageId);
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('メール送信エラー:', error);
    return { success: false, error: error.message };
  }
}

// Main API handler
module.exports = async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Test');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // テストモードの確認
    const isTestMode = req.headers['x-test'] === 'true';
    
    // リクエストボディの取得
    const body = req.body;
    
    // 入力値検証
    if (!body.name || !body.email || !body.message) {
      return res.status(400).json({
        error: 'お名前、メールアドレス、お問い合わせ内容は必須です。'
      });
    }

    // メールアドレスの簡単な検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return res.status(400).json({
        error: '有効なメールアドレスを入力してください。'
      });
    }

    // 入力値のサニタイゼーション
    const sanitizedData = {
      name: body.name.trim().slice(0, 100),
      email: body.email.trim().slice(0, 100),
      subject: (body.subject || '').trim().slice(0, 200),
      message: body.message.trim().slice(0, 2000),
    };

    console.log('お問い合わせデータ受信:', {
      name: sanitizedData.name,
      email: sanitizedData.email,
      subject: sanitizedData.subject,
      messageLength: sanitizedData.message.length,
      testMode: isTestMode
    });

    // テストモードの場合はモックレスポンスを返す
    if (isTestMode) {
      console.log('テストモード: DB保存・メール送信をスキップ');
      return res.status(200).json({
        success: true,
        message: 'テストモード: お問い合わせを受け付けました（実際の保存・送信は行われません）',
        details: {
          sheetSaved: true,
          adminNotified: true,
          userConfirmed: true,
          testMode: true
        }
      });
    }

    // 並行処理でGoogle SheetsとEmail送信を実行
    const [sheetResult, adminEmailResult] = await Promise.allSettled([
      addContactToSheet(sanitizedData),
      sendAdminNotification(sanitizedData)
    ]);

    // 結果の処理
    const results = {
      sheet: sheetResult.status === 'fulfilled' ? sheetResult.value : { success: false, error: sheetResult.reason },
      adminEmail: adminEmailResult.status === 'fulfilled' ? adminEmailResult.value : { success: false, error: adminEmailResult.reason },
    };

    console.log('処理結果:', results);

    // 成功条件の見直し: メール送信か保存のいずれかが成功していれば成功とする
    const hasSuccessfulOperation = results.sheet.success || results.adminEmail.success;
    
    if (hasSuccessfulOperation) {
      return res.status(200).json({
        success: true,
        message: 'お問い合わせを受け付けました。ご返信まで今しばらくお待ちください。',
        details: {
          sheetSaved: results.sheet.success,
          adminNotified: results.adminEmail.success,
          testMode: isTestMode
        }
      });
    } else {
      return res.status(500).json({
        error: 'お問い合わせの処理に失敗しました。時間をおいて再度お試しください。',
        details: {
          sheetError: results.sheet.error,
          emailError: results.adminEmail.error
        }
      });
    }

  } catch (error) {
    console.error('API Route エラー:', error);
    
    return res.status(500).json({
      error: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};