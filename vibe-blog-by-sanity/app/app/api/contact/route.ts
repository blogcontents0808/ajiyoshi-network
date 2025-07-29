import { NextRequest, NextResponse } from 'next/server';
import { addContactToSheet, ContactData } from '@/lib/googleSheets';
import { sendAdminNotification, sendUserConfirmation } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    // テストモードの確認
    const isTestMode = request.headers.get('X-Test') === 'true';
    
    // リクエストボディの取得
    const body: ContactData = await request.json();
    
    // 入力値検証
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'お名前、メールアドレス、お問い合わせ内容は必須です。' },
        { status: 400 }
      );
    }

    // メールアドレスの簡単な検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください。' },
        { status: 400 }
      );
    }

    // 入力値のサニタイゼーション
    const sanitizedData: ContactData = {
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

    // 最低限スプレッドシートへの保存が成功していれば成功とする
    if (results.sheet.success) {
      return NextResponse.json({
        success: true,
        message: 'お問い合わせを受け付けました。ご返信まで今しばらくお待ちください。',
        details: {
          sheetSaved: results.sheet.success,
          adminNotified: results.adminEmail.success,
          userConfirmed: results.userEmail.success,
          testMode: isTestMode
        }
      });
    } else {
      return NextResponse.json(
        { 
          error: 'お問い合わせの保存に失敗しました。時間をおいて再度お試しください。',
          details: results.sheet.error
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API Route エラー:', error);
    
    return NextResponse.json(
      { 
        error: '予期しないエラーが発生しました。時間をおいて再度お試しください。',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// CORS対応（必要に応じて）
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}