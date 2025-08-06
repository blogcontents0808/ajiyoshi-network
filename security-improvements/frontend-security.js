// フロントエンドセキュリティ強化
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    // CSRFトークン対策（簡易版）
    const sessionToken = Math.random().toString(36).substring(2);
    
    // クライアントサイド入力値検証を強化
    function validateInput(data) {
      const errors = [];
      
      // 長さ制限チェック
      if (data.name.length > 100) {
        errors.push('お名前は100文字以内で入力してください。');
      }
      if (data.email.length > 100) {
        errors.push('メールアドレスは100文字以内で入力してください。');
      }
      if (data.subject.length > 200) {
        errors.push('件名は200文字以内で入力してください。');
      }
      if (data.message.length > 2000) {
        errors.push('お問い合わせ内容は2000文字以内で入力してください。');
      }
      
      // 危険な文字列の検出
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i
      ];
      
      const allText = `${data.name} ${data.email} ${data.subject} ${data.message}`;
      dangerousPatterns.forEach(pattern => {
        if (pattern.test(allText)) {
          errors.push('不正な文字が含まれています。入力内容を確認してください。');
        }
      });
      
      return errors;
    }
    
    // セキュアなフォーム送信
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name')?.trim() || '',
        email: formData.get('email')?.trim() || '',
        subject: formData.get('subject')?.trim() || '',
        message: formData.get('message')?.trim() || '',
        sessionToken: sessionToken // CSRF対策
      };
      
      // クライアントサイド検証
      const validationErrors = validateInput(data);
      if (validationErrors.length > 0) {
        alert('入力エラー:\n' + validationErrors.join('\n'));
        return;
      }
      
      // 同意確認
      const privacyAgree = formData.get('privacy_agree');
      const termsAgree = formData.get('terms_agree');
      
      if (!privacyAgree || !termsAgree) {
        alert('プライバシーポリシーと利用規約への同意が必要です。');
        return;
      }
      
      // 送信ボタンの重複制御
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
      
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // AJAX識別用
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          alert('お問い合わせを受け付けました。ありがとうございます。');
          contactForm.reset();
          window.location.href = 'thanks.html';
        } else {
          throw new Error(result.error || 'APIエラーが発生しました');
        }
        
      } catch (error) {
        console.error('送信エラー:', error.message); // 詳細はコンソールのみ
        alert('送信に失敗しました。時間をおいて再度お試しください。');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
});