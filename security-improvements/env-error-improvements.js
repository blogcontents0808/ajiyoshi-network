// 環境変数の安全な管理
function getSecureConfig() {
  return {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID, // ハードコードを削除
    googleAuth: {
      clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    },
    gmail: {
      user: process.env.GMAIL_USER,
      password: process.env.GMAIL_PASS
    },
    adminEmails: [
      process.env.ADMIN_EMAIL_1,
      process.env.ADMIN_EMAIL_2,
      process.env.ADMIN_EMAIL_3
    ].filter(Boolean),
    isProduction: process.env.NODE_ENV === 'production'
  };
}

// 安全なエラーハンドリング
function createSafeErrorResponse(error, isProduction = true) {
  const baseError = {
    error: 'お問い合わせの処理に失敗しました。時間をおいて再度お試しください。',
    timestamp: new Date().toISOString()
  };
  
  if (!isProduction) {
    // 開発環境でのみ詳細情報を含める
    baseError.debug = {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3) // スタックトレースは最初の3行のみ
    };
  }
  
  return baseError;
}

// 強化された入力値検証
function validateAndSanitizeInput(body) {
  const errors = [];
  
  // 必須フィールド検証
  if (!body.name || typeof body.name !== 'string') {
    errors.push('お名前は必須です。');
  }
  if (!body.email || typeof body.email !== 'string') {
    errors.push('メールアドレスは必須です。');
  }
  if (!body.message || typeof body.message !== 'string') {
    errors.push('お問い合わせ内容は必須です。');
  }
  
  // 長さ制限
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
  
  // メールアドレス形式チェック（より厳密）
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (body.email && !emailRegex.test(body.email)) {
    errors.push('有効なメールアドレスを入力してください。');
  }
  
  // 危険な文字の検出
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi
  ];
  
  const allFields = [body.name, body.email, body.subject, body.message].join(' ');
  dangerousPatterns.forEach(pattern => {
    if (pattern.test(allFields)) {
      errors.push('不正な文字が含まれています。');
    }
  });
  
  if (errors.length > 0) {
    return { isValid: false, errors };
  }
  
  // サニタイズ
  return {
    isValid: true,
    sanitizedData: {
      name: body.name.trim().slice(0, 100),
      email: body.email.trim().toLowerCase().slice(0, 100),
      subject: (body.subject || '').trim().slice(0, 200),
      message: body.message.trim().slice(0, 2000)
    }
  };
}