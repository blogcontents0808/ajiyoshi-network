import { google } from 'googleapis';
import nodemailer from 'nodemailer';

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

    // シート情報の取得とシート名の確認
    let sheetName = 'Sheet1'; // デフォルト
    try {
      const sheetInfo = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });
      
      const availableSheets = sheetInfo.data.sheets?.map(sheet => sheet.properties?.title) || [];
      console.log('利用可能なシート:', availableSheets);
      
      // 利用可能なシート名を確認
      if (availableSheets.includes('Sheet1')) {
        sheetName = 'Sheet1';
      } else if (availableSheets.includes('シート1')) {
        sheetName = 'シート1';
      } else if (availableSheets.length > 0) {
        sheetName = availableSheets[0] || 'Sheet1';
      }
      
      console.log('使用するシート名:', sheetName);
    } catch (sheetInfoError) {
      console.error('シート情報取得エラー:', sheetInfoError);
    }

    // シートの存在確認とヘッダー行の初期化
    try {
      const existingData = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:F1`,
      });

      // ヘッダー行が存在しない場合は作成
      if (!existingData.data.values || existingData.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1:F1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [['日時', '名前', 'メールアドレス', '件名', 'メッセージ', '処理状況']],
          },
        });
        console.log('ヘッダー行を初期化しました');
      }
    } catch (headerError) {
      console.error('ヘッダー行チェックエラー:', headerError);
    }

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
      range: `${sheetName}!A:F`, // A列からF列まで
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log('Google Sheets に追加されました:', response.data);
    return { success: true, data: response.data };

  } catch (error) {
    console.error('Google Sheets エラー詳細:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      spreadsheetId: SPREADSHEET_ID,
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY
    });
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
        pass: process.env.GMAIL_PASS, // Googleアプリパスワード
      },
    });

    // 管理者メールアドレスリスト
    const adminEmails = [
      process.env.ADMIN_EMAIL_1,
      process.env.ADMIN_EMAIL_2,
      process.env.ADMIN_EMAIL_3,
    ].filter(Boolean); // 空の値を除外

    // メール内容
    const mailOptions = {
      from: `"味美ネットワーク お問い合わせ" <${process.env.GMAIL_USER}>`,
      to: adminEmails.join(', '),
      subject: `【お問い合わせ】${data.subject || '件名なし'}`,
      html: `
        <div style="font-family: 'Noto Sans JP', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0; font-size: 20px;">
              <span style="margin-right: 10px;">📧</span>
              新しいお問い合わせが届きました
            </h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #dee2e6;">
            <div style="margin-bottom: 20px;">
              <strong style="color: #495057; display: block; margin-bottom: 5px;">📝 お名前</strong>
              <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                ${data.name}
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #495057; display: block; margin-bottom: 5px;">📧 メールアドレス</strong>
              <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                <a href="mailto:${data.email}" style="color: #007bff; text-decoration: none;">
                  ${data.email}
                </a>
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #495057; display: block; margin-bottom: 5px;">📋 件名</strong>
              <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">
                ${data.subject || '件名なし'}
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #495057; display: block; margin-bottom: 5px;">💬 お問い合わせ内容</strong>
              <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; white-space: pre-wrap;">
                ${data.message}
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                📊 <strong>管理:</strong> 
                <a href="https://docs.google.com/spreadsheets/d/16_rP-kDw3MLgNw_M16w9jgmi2LQB57b_D00gbQk3ek8" 
                   style="color: #007bff; text-decoration: none;">
                  お問い合わせ管理スプレッドシート
                </a>
              </p>
              <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 14px;">
                🕐 受信日時: ${new Date().toLocaleString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'Asia/Tokyo'
                })}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
            味美ネットワーク お問い合わせシステム
          </div>
        </div>
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

async function sendUserConfirmation(data) {
  try {
    // 環境変数の存在確認
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.warn('Gmail認証情報が未設定のため、ログに記録します');
      console.log('ユーザー確認通知:', {
        type: 'user_confirmation',
        email: data.email,
        name: data.name,
        timestamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
      });
      return { 
        success: true, 
        message: 'ローカル環境: ユーザー確認通知をログに記録しました',
        localMode: true 
      };
    }

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"味美ネットワーク" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: 'お問い合わせありがとうございます - 味美ネットワーク',
      html: `
        <div style="font-family: 'Noto Sans JP', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0; font-size: 20px;">
              <span style="margin-right: 10px;">🌸</span>
              お問い合わせありがとうございます
            </h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #dee2e6;">
            <p style="color: #495057; line-height: 1.6; margin-bottom: 20px;">
              ${data.name} 様
            </p>
            
            <p style="color: #495057; line-height: 1.6; margin-bottom: 20px;">
              この度は、味美ネットワークにお問い合わせいただき、誠にありがとうございます。<br>
              以下の内容でお問い合わせを承りました。
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 10px 0; color: #495057;"><strong>件名:</strong> ${data.subject || '件名なし'}</p>
              <p style="margin: 0; color: #495057;"><strong>お問い合わせ内容:</strong></p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap;">
                ${data.message}
              </div>
            </div>
            
            <p style="color: #495057; line-height: 1.6; margin-bottom: 20px;">
              お問い合わせの内容を確認させていただき、<strong>3営業日以内</strong>にご返信させていただきます。<br>
              万が一、返信がない場合は、メールアドレスの入力間違いの可能性がございますので、<br>
              お手数ですが再度お問い合わせください。
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                今後とも味美ネットワークをどうぞよろしくお願いいたします。
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
            味美ネットワーク<br>
            <a href="https://ajiyoshi-network.vercel.app" style="color: #667eea; text-decoration: none;">
              https://ajiyoshi-network.vercel.app
            </a>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('ユーザー確認メール送信完了:', info.messageId);
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('確認メール送信エラー:', error);
    return { success: false, error: error.message };
  }
}

// Main API handler
export default async function handler(req, res) {
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
    const [sheetResult, adminEmailResult, userEmailResult] = await Promise.allSettled([
      addContactToSheet(sanitizedData),
      sendAdminNotification(sanitizedData),
      sendUserConfirmation(sanitizedData)
    ]);

    // 結果の処理
    const results = {
      sheet: sheetResult.status === 'fulfilled' ? sheetResult.value : { success: false, error: sheetResult.reason },
      adminEmail: adminEmailResult.status === 'fulfilled' ? adminEmailResult.value : { success: false, error: adminEmailResult.reason },
      userEmail: userEmailResult.status === 'fulfilled' ? userEmailResult.value : { success: false, error: userEmailResult.reason },
    };

    console.log('処理結果:', results);

    // エラーログ
    if (!results.sheet.success) {
      console.error('Google Sheets 保存エラー:', results.sheet.error);
    }
    if (!results.adminEmail.success) {
      console.error('管理者メール送信エラー:', results.adminEmail.error);
    }
    if (!results.userEmail.success) {
      console.error('ユーザー確認メール送信エラー:', results.userEmail.error);
    }

    // 成功条件の見直し: メール送信か保存のいずれかが成功していれば成功とする
    const hasSuccessfulOperation = results.sheet.success || results.adminEmail.success;
    
    if (hasSuccessfulOperation) {
      return res.status(200).json({
        success: true,
        message: 'お問い合わせを受け付けました。ご返信まで今しばらくお待ちください。',
        details: {
          sheetSaved: results.sheet.success,
          adminNotified: results.adminEmail.success,
          userConfirmed: results.userEmail.success,
          testMode: isTestMode,
          note: !results.sheet.success ? 'スプレッドシート保存に問題がありましたが、メール通知は送信されました。' : undefined
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
}