// Cookie同意管理システム
class CookieConsent {
    constructor() {
        this.consentKey = 'ajiyoshi_cookie_consent';
        this.consentExpiry = 365; // 365日間有効
        this.init();
    }

    init() {
        // 既存の同意状況を確認
        if (!this.hasConsent()) {
            this.showConsentBanner();
        }
    }

    hasConsent() {
        const consent = localStorage.getItem(this.consentKey);
        if (!consent) return false;
        
        try {
            const consentData = JSON.parse(consent);
            const now = new Date().getTime();
            return consentData.timestamp && (now - consentData.timestamp < this.consentExpiry * 24 * 60 * 60 * 1000);
        } catch {
            return false;
        }
    }

    showConsentBanner() {
        // 既存のバナーがある場合は削除
        const existingBanner = document.getElementById('cookie-consent-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        // Cookie同意バナーのHTML作成
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <p><strong>Cookieの使用について</strong></p>
                    <p>当サイトでは、より良いサービス提供のためCookieを使用しています。詳細は<a href="/privacy.html" target="_blank">プライバシーポリシー</a>をご確認ください。</p>
                </div>
                <div class="cookie-consent-buttons">
                    <button id="cookie-accept-all" class="cookie-btn cookie-btn-accept">すべて同意</button>
                    <button id="cookie-accept-essential" class="cookie-btn cookie-btn-essential">必要なもののみ</button>
                    <button id="cookie-settings" class="cookie-btn cookie-btn-settings">設定</button>
                </div>
            </div>
        `;

        // スタイル設定
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #2c3e50;
            color: white;
            padding: 20px;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            border-top: 3px solid #e74c3c;
        `;

        document.body.appendChild(banner);
        this.addConsentStyles();
        this.bindEvents();
    }

    addConsentStyles() {
        if (document.getElementById('cookie-consent-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'cookie-consent-styles';
        styles.textContent = `
            .cookie-consent-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
            }
            
            .cookie-consent-text p {
                margin: 0 0 5px 0;
                font-size: 14px;
                line-height: 1.4;
            }
            
            .cookie-consent-text a {
                color: #e74c3c;
                text-decoration: underline;
            }
            
            .cookie-consent-text a:hover {
                color: #fff;
            }
            
            .cookie-consent-buttons {
                display: flex;
                gap: 10px;
                flex-shrink: 0;
            }
            
            .cookie-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.3s ease;
                white-space: nowrap;
            }
            
            .cookie-btn-accept {
                background: #e74c3c;
                color: white;
            }
            
            .cookie-btn-accept:hover {
                background: #c0392b;
            }
            
            .cookie-btn-essential {
                background: #95a5a6;
                color: white;
            }
            
            .cookie-btn-essential:hover {
                background: #7f8c8d;
            }
            
            .cookie-btn-settings {
                background: transparent;
                color: white;
                border: 1px solid #bdc3c7;
            }
            
            .cookie-btn-settings:hover {
                background: #bdc3c7;
                color: #2c3e50;
            }
            
            @media (max-width: 768px) {
                .cookie-consent-content {
                    flex-direction: column;
                    text-align: center;
                }
                
                .cookie-consent-buttons {
                    flex-wrap: wrap;
                    justify-content: center;
                }
                
                .cookie-btn {
                    padding: 8px 16px;
                    font-size: 13px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    bindEvents() {
        document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
            this.setConsent({
                essential: true,
                analytics: true,
                marketing: false,
                preferences: true
            });
        });

        document.getElementById('cookie-accept-essential')?.addEventListener('click', () => {
            this.setConsent({
                essential: true,
                analytics: false,
                marketing: false,
                preferences: false
            });
        });

        document.getElementById('cookie-settings')?.addEventListener('click', () => {
            this.showSettings();
        });
    }

    setConsent(preferences) {
        const consentData = {
            timestamp: new Date().getTime(),
            preferences: preferences
        };
        
        localStorage.setItem(this.consentKey, JSON.stringify(consentData));
        this.hideConsentBanner();
        
        // Cookieの設定を適用
        this.applyCookieSettings(preferences);
        
        console.log('Cookie設定が保存されました:', preferences);
    }

    applyCookieSettings(preferences) {
        // 必要最小限のCookie以外を削除（必要に応じて）
        if (!preferences.analytics) {
            // Google Analytics等のCookieを削除
            this.deleteCookiesByPattern(/^_ga/);
            this.deleteCookiesByPattern(/^_gid/);
        }
        
        if (!preferences.marketing) {
            // マーケティング関連のCookieを削除
            this.deleteCookiesByPattern(/^_fbp/);
            this.deleteCookiesByPattern(/^_fbc/);
        }
    }

    deleteCookiesByPattern(pattern) {
        document.cookie.split(';').forEach(cookie => {
            const name = cookie.split('=')[0].trim();
            if (pattern.test(name)) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            }
        });
    }

    showSettings() {
        // 詳細設定モーダルの表示
        const modal = document.createElement('div');
        modal.id = 'cookie-settings-modal';
        modal.innerHTML = `
            <div class="cookie-modal-overlay">
                <div class="cookie-modal-content">
                    <div class="cookie-modal-header">
                        <h3>Cookie設定</h3>
                        <button id="cookie-modal-close" class="cookie-modal-close">&times;</button>
                    </div>
                    <div class="cookie-modal-body">
                        <div class="cookie-category">
                            <h4>必須Cookie</h4>
                            <p>サイトの基本機能に必要なCookieです。無効にできません。</p>
                            <label class="cookie-toggle">
                                <input type="checkbox" checked disabled> 有効
                            </label>
                        </div>
                        <div class="cookie-category">
                            <h4>分析Cookie</h4>
                            <p>サイトの利用状況を分析し、改善に役立てるためのCookieです。</p>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="analytics-toggle"> 有効
                            </label>
                        </div>
                        <div class="cookie-category">
                            <h4>設定Cookie</h4>
                            <p>ユーザーの設定や選択を記憶するためのCookieです。</p>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="preferences-toggle"> 有効
                            </label>
                        </div>
                    </div>
                    <div class="cookie-modal-footer">
                        <button id="cookie-save-settings" class="cookie-btn cookie-btn-accept">設定を保存</button>
                        <button id="cookie-cancel-settings" class="cookie-btn cookie-btn-essential">キャンセル</button>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10001;
        `;

        document.body.appendChild(modal);
        this.addModalStyles();
        this.bindModalEvents();
    }

    addModalStyles() {
        if (document.getElementById('cookie-modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'cookie-modal-styles';
        styles.textContent = `
            .cookie-modal-overlay {
                background: rgba(0,0,0,0.7);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .cookie-modal-content {
                background: white;
                border-radius: 10px;
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .cookie-modal-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .cookie-modal-header h3 {
                margin: 0;
                color: #2c3e50;
            }
            
            .cookie-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #bdc3c7;
            }
            
            .cookie-modal-close:hover {
                color: #e74c3c;
            }
            
            .cookie-modal-body {
                padding: 20px;
            }
            
            .cookie-category {
                margin-bottom: 20px;
                padding: 15px;
                border: 1px solid #eee;
                border-radius: 5px;
            }
            
            .cookie-category h4 {
                margin: 0 0 10px 0;
                color: #2c3e50;
            }
            
            .cookie-category p {
                margin: 0 0 10px 0;
                font-size: 14px;
                color: #7f8c8d;
            }
            
            .cookie-toggle {
                display: flex;
                align-items: center;
                font-weight: 600;
                color: #2c3e50;
            }
            
            .cookie-toggle input {
                margin-right: 8px;
            }
            
            .cookie-modal-footer {
                padding: 20px;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
        `;
        
        document.head.appendChild(styles);
    }

    bindModalEvents() {
        document.getElementById('cookie-modal-close')?.addEventListener('click', () => {
            this.hideSettingsModal();
        });

        document.getElementById('cookie-cancel-settings')?.addEventListener('click', () => {
            this.hideSettingsModal();
        });

        document.getElementById('cookie-save-settings')?.addEventListener('click', () => {
            const preferences = {
                essential: true,
                analytics: document.getElementById('analytics-toggle')?.checked || false,
                marketing: false,
                preferences: document.getElementById('preferences-toggle')?.checked || false
            };
            
            this.setConsent(preferences);
            this.hideSettingsModal();
        });

        // オーバーレイクリックで閉じる
        document.querySelector('.cookie-modal-overlay')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideSettingsModal();
            }
        });
    }

    hideConsentBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(100%)';
            setTimeout(() => banner.remove(), 300);
        }
    }

    hideSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.remove();
        }
    }

    // 外部からConsent状況を確認できるAPI
    getConsentStatus() {
        const consent = localStorage.getItem(this.consentKey);
        if (!consent) return null;
        
        try {
            return JSON.parse(consent);
        } catch {
            return null;
        }
    }

    // Consent設定をリセット（テスト用）
    resetConsent() {
        localStorage.removeItem(this.consentKey);
        location.reload();
    }
}

// ページ読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    window.cookieConsent = new CookieConsent();
});

// グローバルにアクセス可能にする
window.CookieConsent = CookieConsent;