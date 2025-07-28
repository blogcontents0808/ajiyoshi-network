import nodemailer from 'nodemailer';
import { ContactData } from './googleSheets';

export async function sendAdminNotification(data: ContactData) {
  try {
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

export async function sendUserConfirmation(data: ContactData) {
  try {
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