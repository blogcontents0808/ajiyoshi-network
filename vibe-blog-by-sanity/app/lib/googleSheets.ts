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
      range: 'Sheet1!A:F', // A列からF列まで
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log('Google Sheets に追加されました:', response.data);
    return { success: true, data: response.data };

  } catch (error) {
    console.error('Google Sheets エラー:', error);
    return { success: false, error: error.message };
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
    return { success: false, error: error.message };
  }
}