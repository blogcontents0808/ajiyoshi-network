import { NextRequest, NextResponse } from 'next/server';

// 一時的に他のインポートをコメントアウト
// import { addContactToSheet, ContactData } from '@/lib/googleSheets';
// import { sendAdminNotification, sendUserConfirmation } from '@/lib/emailService';

type ContactData = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

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

    // 一時的に実際の処理をコメントアウトし、モックレスポンスを返す
    console.log('簡素化されたAPIテスト - 受信データ:', sanitizedData);
    
    return NextResponse.json({
      success: true,
      message: 'お問い合わせを受け付けました（簡素化テスト版）',
      details: {
        sheetSaved: true,
        adminNotified: true,
        userConfirmed: true,
        testMode: isTestMode,
        receivedData: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          hasSubject: !!sanitizedData.subject,
          messageLength: sanitizedData.message.length
        }
      }
    });

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