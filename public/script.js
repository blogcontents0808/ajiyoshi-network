// --- スクロールでふわっと表示させるコード ---
const targets = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
});
targets.forEach(target => {
    observer.observe(target);
});


// --- ハンバーガーメニュー用のコード ---
const hamburgerBtn = document.getElementById('hamburger-btn');
const headerNav = document.querySelector('.header-nav');
const body = document.body;

hamburgerBtn.addEventListener('click', () => {
    // is-active クラスを付け外し
    hamburgerBtn.classList.toggle('is-active');
    headerNav.classList.toggle('is-active');
    
    // 背景のスクロールを制御
    if (body.style.overflow === 'hidden') {
        body.style.overflow = '';
    } else {
        body.style.overflow = 'hidden';
    }
});

// === コンタクトフォーム処理 ===
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // フォームデータを取得
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject') || '',
                message: formData.get('message')
            };
            
            // プライバシーポリシーと利用規約の同意確認
            const privacyAgree = formData.get('privacy_agree');
            const termsAgree = formData.get('terms_agree');
            
            if (!privacyAgree || !termsAgree) {
                alert('プライバシーポリシーと利用規約への同意が必要です。');
                return;
            }
            
            // 送信ボタンを無効化
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
            
            try {
                console.log('フォーム送信開始:', data);
                
                // APIエンドポイントにPOST送信（テストモード）
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Test': 'true'  // テストモードで実行
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                console.log('API応答:', result);
                
                if (response.ok && result.success) {
                    alert('お問い合わせを受け付けました。ありがとうございます。');
                    window.location.href = 'thanks.html';
                } else {
                    throw new Error(result.error || 'APIエラーが発生しました');
                }
                
            } catch (error) {
                console.error('エラー:', error);
                alert('送信に失敗しました。再度お試しください。');
            } finally {
                // 送信ボタンを復元
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
});