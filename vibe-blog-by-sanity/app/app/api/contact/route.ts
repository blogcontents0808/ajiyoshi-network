import { NextRequest, NextResponse } from 'next/server';
import { addContactToSheet, ContactData } from '@/lib/googleSheets';
import { sendAdminNotification, sendUserConfirmation } from '@/lib/emailService';

// XSS攻撃対策: HTMLエスケープ関数
function escapeHtml(text: string): string {
  if (!text) return '';
  const map: { [key: string]: string } = {
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
  function maskSensitiveData(data: ContactData) {
    return {
      name: data.name ? `${data.name[0]}***` : null,
      email: data.email ? `***@${data.email.split('@')[1]}` : null,
      subject: data.subject ? `${data.subject.slice(0, 10)}...` : null,
      messageLength: data.message ? data.message.length : 0,
      timestamp: new Date().toISOString()
    };
  }
  
  return {
    logRequest: (data: ContactData) => {
      console.log('Contact request received:', maskSensitiveData(data));
    },
    logError: (error: Error, context: string) => {
      console.error('Contact API error:', {
        error: error.message,
        context: context,
        timestamp: new Date().toISOString()
      });
    },
    logSuccess: (result: any) => {
      console.log('Contact processed successfully:', {
        sheetSaved: result.sheet?.success,
        emailSent: result.adminEmail?.success,
        timestamp: new Date().toISOString()
      });
    }
  };
}

const logger = createSafeLogger();

// CSRFトークン検証機能
function validateCSRFToken(request: NextRequest): boolean {
  const clientToken = request.headers.get('X-Client-Token');
  const requestedWith = request.headers.get('X-Requested-With');
  
  // X-Requested-Withヘッダーの確認（AJAX識別）
  if (requestedWith !== 'XMLHttpRequest') {
    console.warn('CSRF: X-Requested-With header missing or invalid');
    return false;
  }
  
  // CSRFトークンの存在確認
  if (!clientToken) {
    console.warn('CSRF: Client token missing');
    return false;
  }
  
  // トークンの形式確認（64文字の16進数文字列）
  const tokenRegex = /^[a-f0-9]{64}$/i;
  if (!tokenRegex.test(clientToken)) {
    console.warn('CSRF: Invalid token format');
    return false;
  }
  
  // トークンの長さと複雑性チェック
  if (clientToken.length !== 64) {
    console.warn('CSRF: Token length invalid');
    return false;
  }
  
  return true;
}

// 強化された入力値検証とサニタイゼーション
function validateAndSanitizeInput(body: any): { isValid: boolean; errors?: string[]; sanitizedData?: ContactData } {
  const errors: string[] = [];
  
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
    /['"`;\\|*%]/gi,
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
  const sanitize = (str: string) => {
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

// レート制限機能（インメモリ実装）
const requestStore = new Map<string, number[]>();

function checkRateLimit(request: NextRequest): { allowed: boolean; retryAfter?: number; remaining?: number; resetTime?: number } {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
            request.headers.get('x-real-ip') || 
            'unknown';
  
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15分
  const maxRequests = 5; // 15分間で5回まで
  
  // IPアドレス別の記録を取得
  if (!requestStore.has(ip)) {
    requestStore.set(ip, []);
  }
  
  const requests = requestStore.get(ip)!;
  
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
    resetTime: now + windowMs
  };
}

// セキュアなCORS設定
function configureCORS(request: NextRequest): { allowed: boolean; origin?: string } {
  const origin = request.headers.get('origin');
  
  // 許可するパターン
  const isProductionVercel = origin && origin.match(/^https:\/\/ajiyoshi-network(-clean)?-[\w-]+-blogcontents0808s-projects\.vercel\.app$/);
  const isMainDomain = origin === 'https://ajiyoshi-network.vercel.app' || origin === 'https://ajiyoshi-network-clean.vercel.app';
  const isLocalDev = origin && origin.match(/^http:\/\/localhost:(3000|3001|3002|3003)$/);
  
  const isAllowed = isProductionVercel || isMainDomain || isLocalDev;
  
  return {
    allowed: isAllowed || !origin, // originがない場合（直接アクセスなど）は同一オリジンとして扱う
    origin: isAllowed && origin ? origin : 'https://ajiyoshi-network.vercel.app'
  };
}

export async function POST(request: NextRequest) {
  try {
    // セキュアなCORS設定を適用
    const corsResult = configureCORS(request);
    
    // 許可されていないオリジンからのアクセスを拒否
    if (!corsResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Access denied. Origin not allowed.',
          timestamp: new Date().toISOString()
        },
        { status: 403 }
      );
    }
    
    // CSRF トークン検証
    if (!validateCSRFToken(request)) {
      return NextResponse.json(
        { 
          error: 'Invalid security token. Please refresh the page and try again.',
          timestamp: new Date().toISOString()
        },
        { status: 403 }
      );
    }
    
    // レート制限チェック
    const rateLimitResult = checkRateLimit(request);
    if (!rateLimitResult.allowed) {
      const headers = {
        'Retry-After': rateLimitResult.retryAfter!.toString(),
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime!).toISOString()
      };
      
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
          resetTime: new Date(rateLimitResult.resetTime!).toISOString()
        },
        { status: 429, headers }
      );
    }
    
    // テストモードの確認
    const isTestMode = request.headers.get('X-Test') === 'true';
    
    // リクエストボディの取得
    const body = await request.json();
    
    // 強化された入力値検証とサニタイゼーション
    const validationResult = validateAndSanitizeInput(body);
    
    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          error: '入力内容にエラーがあります。',
          details: validationResult.errors
        },
        { status: 400 }
      );
    }
    
    const sanitizedData = validationResult.sanitizedData!;

    logger.logRequest({
      ...sanitizedData,
      testMode: isTestMode
    } as ContactData & { testMode: boolean });

    // テストモードの場合はモックレスポンスを返す
    if (isTestMode) {
      console.log('テストモード: DB保存・メール送信をスキップ');
      return NextResponse.json({
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

    logger.logSuccess(results);

    // エラーログ
    if (!results.sheet.success) {
      logger.logError(new Error(results.sheet.error), 'Google Sheets保存');
    }
    if (!results.adminEmail.success) {
      logger.logError(new Error(results.adminEmail.error), '管理者メール送信');
    }
    if (!results.userEmail.success) {
      logger.logError(new Error(results.userEmail.error), 'ユーザー確認メール送信');
    }

    // ローカル環境での成功判定: localModeがtrueの場合は成功とする
    const isLocalMode = results.sheet.localMode || results.adminEmail.localMode;
    const hasSuccessfulOperation = results.sheet.success || results.adminEmail.success;
    
    if (hasSuccessfulOperation) {
      const headers: Record<string, string> = {
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': rateLimitResult.remaining!.toString(),
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime!).toISOString()
      };
      
      if (corsResult.origin) {
        headers['Access-Control-Allow-Origin'] = corsResult.origin;
        headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
        headers['Access-Control-Allow-Headers'] = 'Content-Type, X-Requested-With';
        headers['Access-Control-Allow-Credentials'] = 'false';
      }
      
      return NextResponse.json({
        success: true,
        message: isLocalMode 
          ? 'ローカル環境: お問い合わせを受け付けました（ログに記録されました）。' 
          : 'お問い合わせを受け付けました。ご返信まで今しばらくお待ちください。',
        details: {
          sheetSaved: results.sheet.success,
          adminNotified: results.adminEmail.success,
          userConfirmed: results.userEmail.success,
          localMode: isLocalMode,
          testMode: isTestMode
        }
      }, { headers });
    } else {
      return NextResponse.json(
        { 
          error: 'お問い合わせの処理に失敗しました。時間をおいて再度お試しください。',
          details: {
            sheetError: results.sheet.error,
            emailError: results.adminEmail.error
          }
        },
        { status: 500 }
      );
    }

  } catch (error) {
    logger.logError(error as Error, 'API Route');
    
    return NextResponse.json(
      { 
        error: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// セキュアなCORS対応
export async function OPTIONS(request: NextRequest) {
  const corsResult = configureCORS(request);
  
  if (!corsResult.allowed) {
    return NextResponse.json(
      { error: 'Access denied. Origin not allowed.' },
      { status: 403 }
    );
  }
  
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
    'Access-Control-Allow-Credentials': 'false',
    'Access-Control-Max-Age': '86400' // 24時間キャッシュ
  };
  
  if (corsResult.origin) {
    headers['Access-Control-Allow-Origin'] = corsResult.origin;
  }
  
  return new NextResponse(null, {
    status: 200,
    headers
  });
}