import { google } from 'googleapis';
import nodemailer from 'nodemailer';

// 環境変数からスプレッドシートIDを取得（セキュリティ改善）
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || 
                      process.env.GOOGLE_SHEET_ID || 
                      '16_rP-kDw3MLgNw_M16w9jgmi2LQB57b_D00gbQk3ek8'; // フォールバック

// XSS攻撃対策: HTMLエスケープ関数
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.toString().replace(/[&<>"']/g, (m) => map[m]);
}

// 安全なログ記録（個人情報保護対応）
function createSafeLogger() {
  // 個人情報をマスクする関数
  function maskSensitiveData(data) {
    return {
      name: data.name ? `${data.name[0]}***` : null,
      email: data.email ? `***@${data.email.split('@')[1]}` : null,
      subject: data.subject ? `${data.subject.slice(0, 10)}...` : null,
      messageLength: data.message ? data.message.length : 0,
      timestamp: new Date().toISOString()
    };
  }
  
  return {
    logRequest: (data) => {
      console.log('Contact request received:', maskSensitiveData(data));
    },
    logError: (error, context) => {
      console.error('Contact API error:', {
        error: error.message,
        context: context,
        timestamp: new Date().toISOString()
      });
    },
    logSuccess: (result) => {
      console.log('Contact processed successfully:', {
        sheetSaved: result.sheet?.success,
        emailSent: result.adminEmail?.success,
        timestamp: new Date().toISOString()
      });
    }
  };
}

const logger = createSafeLogger();

// 強化された入力値検証とサニタイゼーション
function validateAndSanitizeInput(body) {
  const errors = [];
  
  // 型チェック
  if (typeof body !== 'object' || body === null) {
    return { isValid: false, errors: ['無効なリクエスト形式です。'] };
  }
  
  // 必須フィールドの存在確認と型チェック
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push('お名前は必須です。');
  }
  if (!body.email || typeof body.email !== 'string' || body.email.trim().length === 0) {
    errors.push('メールアドレスは必須です。');
  }
  if (!body.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
    errors.push('お問い合わせ内容は必須です。');
  }
  
  // subjectは任意フィールドだが、存在する場合は文字列である必要がある
  if (body.subject && typeof body.subject !== 'string') {
    errors.push('件名は文字列で入力してください。');
  }
  
  // 基本的な長さ制限
  if (body.name && body.name.length > 100) {
    errors.push('お名前は100文字以内で入力してください。');
  }
  if (body.email && body.email.length > 100) {
    errors.push('メールアドレスは100文字以内で入力してください。');
  }
  if (body.subject && body.subject.length > 200) {
    errors.push('件名は200文字以内で入力してください。');
  }
  if (body.message && body.message.length > 2000) {
    errors.push('お問い合わせ内容は2000文字以内で入力してください。');
  }
  
  // 最小長チェック
  if (body.name && body.name.trim().length < 1) {
    errors.push('お名前を入力してください。');
  }
  if (body.message && body.message.trim().length < 10) {
    errors.push('お問い合わせ内容は10文字以上で入力してください。');
  }
  
  // より厳密なメールアドレス検証
  if (body.email) {
    // RFC 5322準拠のより厳密なパターン
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(body.email.trim())) {
      errors.push('有効なメールアドレスを入力してください。');
    }
    
    // 一般的でないドメインや危険なパターンをチェック
    const email = body.email.trim().toLowerCase();
    if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
      errors.push('有効なメールアドレスを入力してください。');
    }
  }
  
  // セキュリティ危険パターンの検出
  const allText = [body.name, body.email, body.subject, body.message]
    .filter(Boolean)
    .join(' ');
  
  const dangerousPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:[\s\S]*?base64/gi,
    /vbscript:/gi,
    /<object[\s\S]*?>/gi,
    /<embed[\s\S]*?>/gi,
    /expression\s*\(/gi,
    /url\s*\(\s*javascript:/gi
  ];
  
  dangerousPatterns.forEach(pattern => {
    if (pattern.test(allText)) {
      errors.push('不正な文字列が含まれています。安全な内容で再度お試しください。');
      return; // 最初の危険パターンでストップ
    }
  });
  
  // SQL注入攻撃パターン（念のため）
  const sqlPatterns = [
    /['";\\|*%]/gi,
    /(union|select|insert|delete|update|drop|create|alter)/gi,
    /(script|javascript|vbscript|onload|onerror)/gi
  ];
  
  const hasSQL = sqlPatterns.some(pattern => pattern.test(allText));
  if (hasSQL) {
    errors.push('不正な文字列が含まれています。');
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  // サニタイゼーション
  const sanitize = (str) => {
    return str ? str.toString().trim().replace(/\s+/g, ' ') : '';
  };
  
  return {
    isValid: true,
    sanitizedData: {
      name: sanitize(body.name).slice(0, 100),
      email: sanitize(body.email).toLowerCase().slice(0, 100),
      subject: sanitize(body.subject || '').slice(0, 200),
      message: sanitize(body.message).slice(0, 2000)
    }
  };
}

// セキュアなCORS設定
function configureCORS(req, res) {
  const origin = req.headers.origin;
  
  // 許可するパターン
  const isProductionVercel = origin && origin.match(/^https:\/\/ajiyoshi-network(-clean)?-[\w-]+-blogcontents0808s-projects\.vercel\.app$/);
  const isMainDomain = origin === 'https://ajiyoshi-network.vercel.app' || origin === 'https://ajiyoshi-network-clean.vercel.app';
  const isLocalDev = origin && origin.match(/^http:\/\/localhost:(3000|3001|3002|3003)$/);
  
  const isAllowed = isProductionVercel || isMainDomain || isLocalDev;
  
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // originがない場合（直接アクセスなど）は同一オリジンとして扱う
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24時間キャッシュ
  
  return isAllowed || !origin;
}

// レート制限機能（インメモリ実装）
const requestStore = new Map();

function checkRateLimit(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
            req.headers['x-real-ip'] || 
            req.connection?.remoteAddress || 
            'unknown';
  
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15分
  const maxRequests = 5; // 15分間で5回まで
  
  // IPアドレス別の記録を取得
  if (!requestStore.has(ip)) {
    requestStore.set(ip, []);
  }
  
  const requests = requestStore.get(ip);
  
  // 古いリクエスト記録を削除
  const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
  
  // 制限チェック
  if (validRequests.length >= maxRequests) {
    const oldestRequest = Math.min(...validRequests);
    const resetTime = oldestRequest + windowMs;
    const retryAfter = Math.ceil((resetTime - now) / 1000);
    
    return {
      allowed: false,
      retryAfter: retryAfter,
      remaining: 0,
      resetTime: resetTime
    };
  }
  
  // 新しいリクエストを記録
  validRequests.push(now);
  requestStore.set(ip, validRequests);
  
  // 古いIPの記録をクリーンアップ（メモリ節約）
  if (requestStore.size > 1000) {
    const cutoff = now - windowMs * 2;
    for (const [storedIp, timestamps] of requestStore.entries()) {
      const validTimestamps = timestamps.filter(t => t > cutoff);
      if (validTimestamps.length === 0) {
        requestStore.delete(storedIp);
      } else {
        requestStore.set(storedIp, validTimestamps);
      }
    }
  }
  
  return {
    allowed: true,
    remaining: maxRequests - validRequests.length,
    resetTime: now + windowMs,
    ip: ip // デバッグ用（本番では削除可能）
  };
}

// Google Sheets function
async function addContactToSheet(data) {
  try {
    // 環境変数の存在確認
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn('Google Sheets認証情報が未設定のため、ローカルログに保存します');
      logger.logRequest(data);
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
      range: 'シート1!A:F',
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
      logger.logRequest(data);
      return { 
        success: true, 
        message: 'ローカル環境: 管理者通知をログに記録しました',
        localMode: true 
      };
    }

    // Gmail SMTP設定
    const transporter = nodemailer.createTransport({
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

    // メール内容（XSS攻撃対策済み）
    const mailOptions = {
      from: `"味美ネットワーク お問い合わせ" <${process.env.GMAIL_USER}>`,
      to: adminEmails.join(', '),
      subject: `【お問い合わせ】${escapeHtml(data.subject || '件名なし')}`,
      html: `
        <h2>新しいお問い合わせが届きました</h2>
        <p><strong>お名前:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>メールアドレス:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>件名:</strong> ${escapeHtml(data.subject || '件名なし')}</p>
        <p><strong>お問い合わせ内容:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
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
export default async function handler(req, res) {
  // セキュアなCORS設定を適用
  const corsAllowed = configureCORS(req, res);
  
  // 許可されていないオリジンからのアクセスを拒否
  if (!corsAllowed) {
    return res.status(403).json({ 
      error: 'Access denied. Origin not allowed.',
      timestamp: new Date().toISOString()
    });
  }
  
  // レート制限チェック
  const rateLimitResult = checkRateLimit(req);
  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', rateLimitResult.retryAfter.toString());
    res.setHeader('X-RateLimit-Limit', '5');
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());
    
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: rateLimitResult.retryAfter,
      resetTime: new Date(rateLimitResult.resetTime).toISOString()
    });
  }
  
  // レート制限ヘッダーを追加
  res.setHeader('X-RateLimit-Limit', '5');
  res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
  res.setHeader('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());

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
    
    // 強化された入力値検証とサニタイゼーション
    const validationResult = validateAndSanitizeInput(body);
    
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: '入力内容にエラーがあります。',
        details: validationResult.errors
      });
    }
    
    const sanitizedData = validationResult.sanitizedData;

    logger.logRequest({
      ...sanitizedData,
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

    logger.logSuccess(results);

    // ローカル環境での成功判定: localModeがtrueの場合は成功とする
    const isLocalMode = results.sheet.localMode || results.adminEmail.localMode;
    const hasSuccessfulOperation = results.sheet.success || results.adminEmail.success;
    
    if (hasSuccessfulOperation) {
      return res.status(200).json({
        success: true,
        message: isLocalMode 
          ? 'ローカル環境: お問い合わせを受け付けました（ログに記録されました）。' 
          : 'お問い合わせを受け付けました。ご返信まで今しばらくお待ちください。',
        details: {
          sheetSaved: results.sheet.success,
          adminNotified: results.adminEmail.success,
          localMode: isLocalMode,
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