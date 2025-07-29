import { google } from 'googleapis';

const SPREADSHEET_ID = '16_rP-kDw3MLgNw_M16w9jgmi2LQB57b_D00gbQk3ek8';

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function addContactToSheet(data: ContactData) {
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

    // シートの存在確認とヘッダー行の初期化
    try {
      const existingData = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A1:F1',
      });

      // ヘッダー行が存在しない場合は作成
      if (!existingData.data.values || existingData.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: 'Sheet1!A1:F1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [['日時', '名前', 'メールアドレス', '件名', 'メッセージ', '処理状況']],
          },
        });
        console.log('ヘッダー行を初期化しました');
      }
    } catch (headerError) {
      console.log('ヘッダー行チェックエラー:', headerError);
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
      range: 'Sheet1!A:F', // A列からF列まで
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log('Google Sheets に追加されました:', response.data);
    return { success: true, data: response.data };

  } catch (error) {
    console.error('Google Sheets エラー詳細:', {
      message: (error as Error).message,
      name: (error as Error).name,
      stack: (error as Error).stack,
      spreadsheetId: SPREADSHEET_ID,
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY
    });
    return { success: false, error: (error as Error).message };
  }
}

export async function getContactList() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:F',
    });

    return { success: true, data: response.data.values || [] };

  } catch (error) {
    console.error('Google Sheets 読み取りエラー:', error);
    return { success: false, error: (error as Error).message };
  }
}