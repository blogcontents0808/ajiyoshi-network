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

// === セキュアなコンタクトフォーム処理 ===
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // セッショントークン生成（CSRF対策）
        const sessionToken = generateSecureToken();
        
        // クライアントサイド入力値検証を強化
        function validateClientInput(data) {
            const errors = [];
            
            // 必須フィールドチェック
            if (!data.name || data.name.trim().length === 0) {
                errors.push('お名前を入力してください。');
            }
            if (!data.email || data.email.trim().length === 0) {
                errors.push('メールアドレスを入力してください。');
            }
            if (!data.message || data.message.trim().length === 0) {
                errors.push('お問い合わせ内容を入力してください。');
            }
            
            // 長さ制限チェック
            if (data.name && data.name.length > 100) {
                errors.push('お名前は100文字以内で入力してください。');
            }
            if (data.email && data.email.length > 100) {
                errors.push('メールアドレスは100文字以内で入力してください。');
            }
            if (data.subject && data.subject.length > 200) {
                errors.push('件名は200文字以内で入力してください。');
            }
            if (data.message && data.message.length > 2000) {
                errors.push('お問い合わせ内容は2000文字以内で入力してください。');
            }
            
            // 最小長チェック
            if (data.message && data.message.trim().length < 10) {
                errors.push('お問い合わせ内容は10文字以上で入力してください。');
            }
            
            // メールアドレス形式チェック
            if (data.email) {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(data.email.trim())) {
                    errors.push('有効なメールアドレスを入力してください。');
                }
            }
            
            // 危険な文字列の検出
            const dangerousPatterns = [
                /<script/i, /<\/script>/i,
                /javascript:/i,
                /on\w+\s*=/i,
                /<iframe/i, /<\/iframe>/i,
                /vbscript:/i,
                /<object/i, /<embed/i,
                /expression\s*\(/i
            ];
            
            const allText = `${data.name} ${data.email} ${data.subject} ${data.message}`;
            dangerousPatterns.forEach(pattern => {
                if (pattern.test(allText)) {
                    errors.push('不正な文字が含まれています。安全な内容で入力してください。');
                }
            });
            
            return errors;
        }
        
        // セキュアトークン生成
        function generateSecureToken() {
            const array = new Uint8Array(32);
            crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        }
        
        // 重複送信防止
        let isSubmitting = false;
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 重複送信防止
            if (isSubmitting) {
                return;
            }
            isSubmitting = true;
            
            try {
                // フォームデータを安全に取得
                const formData = new FormData(contactForm);
                const data = {
                    name: sanitizeInput(formData.get('name') || ''),
                    email: sanitizeInput(formData.get('email') || ''),
                    subject: sanitizeInput(formData.get('subject') || ''),
                    message: sanitizeInput(formData.get('message') || ''),
                    sessionToken: sessionToken
                };
                
                // クライアントサイド検証
                const validationErrors = validateClientInput(data);
                if (validationErrors.length > 0) {
                    showErrorMessage('入力エラー', validationErrors);
                    return;
                }
                
                // 同意確認
                const privacyAgree = formData.get('privacy_agree');
                const termsAgree = formData.get('terms_agree');
                
                if (!privacyAgree || !termsAgree) {
                    showErrorMessage('同意確認', ['プライバシーポリシーと利用規約への同意が必要です。']);
                    return;
                }
                
                // 送信ボタンの状態管理
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
                
                // セキュアなAPIリクエスト
                const response = await fetch('/api/contact/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-Client-Token': sessionToken
                    },
                    body: JSON.stringify(data),
                    credentials: 'same-origin'
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    showSuccessMessage();
                    setTimeout(() => {
                        window.location.href = 'thanks.html';
                    }, 1000);
                } else {
                    throw new Error(result.error || 'サーバーエラーが発生しました');
                }
                
            } catch (error) {
                console.error('送信エラー:', error.message);
                
                // レート制限エラーの特別処理
                if (error.message.includes('Too many requests')) {
                    showErrorMessage('送信制限', ['短時間に多数のリクエストが送信されました。しばらく時間をおいてから再度お試しください。']);
                } else {
                    showErrorMessage('送信エラー', ['送信に失敗しました。時間をおいて再度お試しください。']);
                }
            } finally {
                // 送信状態をリセット
                isSubmitting = false;
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.innerHTML.includes('spinner') ? 
                    '<i class="fas fa-paper-plane"></i> 送信する' : 
                    submitBtn.innerHTML;
            }
        });
        
        // 入力値サニタイズ関数
        function sanitizeInput(input) {
            return input ? input.toString().trim().slice(0, 2000) : '';
        }
        
        // エラーメッセージ表示
        function showErrorMessage(title, messages) {
            const errorText = messages.join('\n');
            alert(`${title}:\n${errorText}`);
        }
        
        // 成功メッセージ表示
        function showSuccessMessage() {
            alert('お問い合わせを受け付けました。ありがとうございます。');
        }
        
        // リアルタイム入力値検証
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                validateRealTime(this);
            });
        });
        
        function validateRealTime(input) {
            const value = input.value;
            let isValid = true;
            
            // 危険なパターンのリアルタイム検証
            const dangerousPatterns = [
                /<script/i, /javascript:/i, /on\w+\s*=/i
            ];
            
            dangerousPatterns.forEach(pattern => {
                if (pattern.test(value)) {
                    isValid = false;
                    input.setCustomValidity('不正な文字が含まれています');
                }
            });
            
            if (isValid) {
                input.setCustomValidity('');
            }
        }
    }
});