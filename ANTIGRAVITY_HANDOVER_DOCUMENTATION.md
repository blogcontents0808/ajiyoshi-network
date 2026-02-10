# 🚀 Antigravity運用引継ぎドキュメント

**味美ネットワーク ウェブサイト完全引継ぎ資料**

---

## 📋 プロジェクト概要

### 🎯 サイト情報
- **プロジェクト名**: 味美ネットワーク公式サイト
- **URL**: https://ajiyoshi-network.vercel.app/
- **管理者**: Antigravity（引継ぎ先）
- **前管理者**: Claude Code
- **引継ぎ日**: 2025年12月8日

### 🏗️ 技術構成
```
技術スタック:
├── フロントエンド: Next.js 14.0.0 (App Router)
├── CMS: Sanity 3.15.1
├── ホスティング: Vercel
├── 言語: JavaScript/TypeScript
├── スタイル: CSS Modules + styled-components
└── 認証: Sanity OAuth
```

### 📁 ディレクトリ構造
```
ajiyoshi-network-clean/
├── app/                    # Next.js App Router (メイン)
├── pages/                  # 静的HTMLページ
├── public/                 # 静的ファイル・画像
├── components/             # React コンポーネント
├── lib/                   # ユーティリティ・API設定
├── schemaTypes/           # Sanity スキーマ定義
├── styles/                # CSS・スタイルシート
├── images/                # 画像ファイル
├── node_modules/          # 依存関係
├── .vercel/               # Vercel設定
├── .sanity/               # Sanity設定
└── vibe-blog-by-sanity/   # Sanity Studio（廃止予定）
```

---

## 🔧 重要な設定情報

### 📦 package.json 依存関係
```json
主要な依存関係:
- "next": "^14.0.0"
- "sanity": "^3.15.1"
- "@sanity/client": "^6.4.11"
- "react": "^18.0.0"
- "nodemailer": "^6.9.7"
- "googleapis": "^128.0.0"
```

### 🔐 環境変数（.env.local）

#### 📋 必須環境変数一覧
```bash
# ===== Sanity CMS 設定 =====
NEXT_PUBLIC_SANITY_PROJECT_ID=qier3tei
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=（要確認・更新：Sanity管理画面で取得）

# ===== Google Sheets API設定（お問い合わせフォーム用） =====
GOOGLE_SERVICE_ACCOUNT_EMAIL=（サービスアカウントのメールアドレス）
GOOGLE_PRIVATE_KEY=（サービスアカウントの秘密鍵：改行を\\nで置換）
GOOGLE_SPREADSHEET_ID=16_rP-kDw3MLgNw_M16w9jgmi2LQB57b_D00gbQk3ek8
GOOGLE_SHEET_ID=（GOOGLE_SPREADSHEET_IDのエイリアス）

# ===== Gmail SMTP設定（管理者通知用） =====
GMAIL_USER=（Gmail のメールアドレス）
GMAIL_PASS=（Gmail のアプリパスワード：2要素認証必須）

# ===== 管理者メール設定 =====
ADMIN_EMAIL_1=（主管理者のメールアドレス）
ADMIN_EMAIL_2=（副管理者のメールアドレス：任意）
ADMIN_EMAIL_3=（第三管理者のメールアドレス：任意）
```

#### 🛠️ 環境変数セットアップ手順

**1. Sanity API トークン取得:**
```
手順:
1. https://www.sanity.io/manage にログイン
2. プロジェクト「ajiyoshi-network-blog」を選択
3. 「API」タブ → 「Tokens」
4. 「Add API token」で新しいトークンを作成
5. 権限: Editor または Viewer（用途に応じて）
6. 取得したトークンを SANITY_API_TOKEN に設定
```

**2. Google Sheets API セットアップ:**
```
手順:
1. Google Cloud Console (https://console.cloud.google.com) にアクセス
2. 新しいプロジェクト作成または既存プロジェクト選択
3. 「APIs & Services」→「Library」→「Google Sheets API」を有効化
4. 「Credentials」→「Create Credentials」→「Service account」
5. サービスアカウント作成後、「Keys」タブでJSON キーをダウンロード
6. JSON ファイルから以下を抽出:
   - client_email → GOOGLE_SERVICE_ACCOUNT_EMAIL
   - private_key → GOOGLE_PRIVATE_KEY（改行を \\n に置換）

Google Sheetsファイル設定:
1. スプレッドシート作成（共有設定でサービスアカウントに編集権限付与）
2. スプレッドシートIDをURLから取得
   例: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
3. GOOGLE_SPREADSHEET_ID に設定

シート構造（推奨）:
| A列(日時) | B列(名前) | C列(メール) | D列(件名) | E列(内容) | F列(状態) |
|----------|----------|------------|----------|----------|----------|
```

**3. Gmail SMTP セットアップ:**
```
手順:
1. Gmailアカウントで2要素認証を有効化
2. Google アカウント → セキュリティ → 2段階認証プロセス
3. 「アプリパスワード」を生成
4. 生成されたパスワードを GMAIL_PASS に設定
5. Gmailアドレスを GMAIL_USER に設定

注意:
- 通常のGmailパスワードではなく、アプリパスワード必須
- 2要素認証が無効だとアプリパスワード生成不可
```

#### 🔍 環境変数設定確認方法
```bash
# 設定確認スクリプト（機密情報をマスク表示）
node -e "
console.log('=== 環境変数設定確認 ===');
console.log('SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '❌未設定');
console.log('SANITY_TOKEN:', process.env.SANITY_API_TOKEN ? '✅設定済み（***）' : '❌未設定');
console.log('GOOGLE_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.substring(0,10) + '***' : '❌未設定');
console.log('GOOGLE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✅設定済み（***）' : '❌未設定');
console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SPREADSHEET_ID || '❌未設定');
console.log('GMAIL_USER:', process.env.GMAIL_USER ? process.env.GMAIL_USER.substring(0,5) + '***' : '❌未設定');
console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? '✅設定済み（***）' : '❌未設定');
console.log('ADMIN_EMAILS:', [process.env.ADMIN_EMAIL_1, process.env.ADMIN_EMAIL_2, process.env.ADMIN_EMAIL_3].filter(Boolean).length + '個設定済み');
"
```

### 🌐 Vercel設定
- **プロジェクトID**: prj_enm7Ps9HRmyu4o2PTFvA0j5tLlVX
- **チームID**: team_dBp80GXF7VT7O08cCKNJaCT3
- **デプロイ**: Gitプッシュ時自動デプロイ

---

## 🚀 開発・運用手順

### 1. 📥 初期セットアップ
```bash
# リポジトリクローン
git clone [repository-url]
cd ajiyoshi-network-clean

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev           # http://localhost:3000

# Sanity Studio（必要時）
npm run studio        # http://localhost:3333
```

### 2. 🏗️ ビルド・デプロイ
```bash
# 本番ビルド
npm run build

# ローカルで本番環境テスト
npm start

# Vercelデプロイ（自動）
git push origin main

# 手動デプロイ（緊急時）
vercel --prod
```

### 3. 🔄 定期メンテナンス
```bash
# セキュリティ監査
npm audit
npm audit fix

# 依存関係更新
npm update

# ブログ同期（手動）
node complete-sanity-sync.js
```

---

## 📝 Sanity CMS 完全ガイド

### 🎛️ Sanity プロジェクト情報
- **プロジェクトID**: qier3tei
- **データセット**: production
- **Studio URL**: https://ajiyoshi-network.sanity.studio/

### 📊 データ構造
```typescript
スキーマタイプ:
├── post (記事)
│   ├── title: 記事タイトル
│   ├── slug: URLスラッグ
│   ├── publishedAt: 公開日
│   ├── body: 記事本文
│   ├── mainImage: アイキャッチ画像
│   ├── author: 投稿者
│   └── categories: カテゴリー
├── author (投稿者)
├── category (カテゴリー)
└── setting (設定)
```

### ✏️ 記事投稿・更新手順

#### 📝 基本的な記事作成フロー
```
1. Sanity Studioログイン
   URL: https://ajiyoshi-network.sanity.studio/
   または: npm run studio → http://localhost:3333

2. 新規記事作成
   ├─ 「Posts」セクションから「Create new Post」
   ├─ 必須項目入力（Title、Slug、Published date）
   ├─ 本文作成（Portable Text Editor使用）
   ├─ アイキャッチ画像設定
   └─ カテゴリー・投稿者選択

3. プレビュー確認
   └─ Preview タブで記事確認

4. 公開
   ├─ Publish ボタンで公開
   └─ サイトに自動反映（即座）
```

#### 🎯 記事作成の詳細手順とベストプラクティス

**タイトル設定のコツ:**
```
推奨形式:
- 「【日程】イベント名: 簡潔な説明」
- 例: 「【12/6開催】味美推しフェス: 地域の魅力を発信するイベント開催」

注意点:
- 60文字以内を推奨（SEO最適化）
- キーワードを前半に配置
- 具体的な日付や場所を含める
```

**スラッグ設定:**
```
推奨形式: YYYY-MM-DD-event-name
例: 2025-12-06-ajiyoshi-oshi-fes

注意点:
- 英数字とハイフンのみ使用
- 日付を含めることで重複を防止
- 簡潔で分かりやすい名称
```

**画像設定の推奨事項:**
```
サイズ:
- 幅: 800px~1200px
- 高さ: 500px~800px
- アスペクト比: 16:9または3:2を推奨

ファイル:
- 容量: 5MB以下
- 形式: JPG（一般的な写真）、PNG（ロゴ・図表）
- 命名: YYYY-MM-DD-イベント名-01.jpg

Alt text:
- 必須設定（アクセシビリティ）
- 画像の内容を具体的に記述
- 例: "味美推しフェス会場の様子、多くの来場者が楽しんでいる"
```

#### 📅 記事投稿のタイミング戦略
```
事前告知記事:
├─ イベント1週間前: 告知記事公開
├─ イベント3日前: 詳細情報更新
└─ イベント当日: ライブ更新（可能な場合）

事後報告記事:
├─ イベント翌日: 速報・感謝記事
├─ イベント3日後: 詳細レポート
└─ イベント1週間後: 総括・次回予告

定期記事:
├─ 月初: 月間予定・目標
├─ 月末: 月間振り返り・実績
└─ 四半期: 活動報告・計画更新
```

#### 🔗 内部リンク・関連記事設定
```
推奨構造:
├─ 関連イベントへのリンク
├─ 過去の類似記事への参照
├─ 今後の予定への誘導
└─ お問い合わせページへの導線

SEO効果:
├─ 内部リンクでサイト回遊率向上
├─ 関連キーワードでの検索順位向上
└─ ユーザーエンゲージメント向上
```

### 🖼️ 画像管理ベストプラクティス
```
推奨設定:
├─ サイズ: 幅800px以内、高さ600px以内
├─ ファイル容量: 5MB以下
├─ 形式: JPG, PNG, WebP
├─ 命名規則: 日付-イベント名-番号.jpg
└─ Alt text: 必須設定
```

---

## 🎯 主要ページ・機能

### 📄 ページ一覧
```
主要ページ:
├── / (ホーム): app/page.js
├── /blog (ブログ一覧): app/blog/page.js
├── /blog/[slug] (記事詳細): app/blog/[slug]/page.js
├── /contact (お問い合わせ): app/contact/page.js
├── /about (概要): public/about.html
└── /privacy (プライバシー): public/privacy.html
```

### 🔌 API エンドポイント
```
API:
├── /api/contact: お問い合わせフォーム処理
├── /api/blog: ブログ記事取得
└── Sanity API: CMS連携
```

### 🎨 スタイリング構成
```
スタイル:
├── styles/globals.css: グローバルスタイル
├── app/*/page.module.css: ページ別CSS
├── components/*.module.css: コンポーネント別CSS
└── styled-components: 動的スタイル
```

---

## 🛠️ 頻繁な作業・タスク

### 📝 新しいブログ記事追加
```
手順:
1. Sanity Studioでの記事作成
2. 画像アップロード・設定
3. カテゴリー・タグ設定
4. プレビュー確認
5. 公開実行
6. サイト確認（自動反映）
```

### 🔧 サイト修正・更新
```
手順:
1. ローカルで開発 (npm run dev)
2. 修正・テスト
3. Git コミット・プッシュ
4. Vercel自動デプロイ
5. 本番確認
```

### 🆕 新規ページ追加
```
手順:
1. app/[page-name]/ ディレクトリ作成
2. page.js, layout.js 作成
3. メタデータ設定
4. ナビゲーション更新
5. スタイル適用
```

---

## 🛡️ セキュリティ・リスク管理

### 🔐 実装済みセキュリティ対策

#### 🚨 高度なセキュリティ機能
```
フロントエンド保護:
├── CSP (Content Security Policy) - XSS攻撃防止
├── CORS設定 - 不正オリジンからのアクセス拒否  
├── XSS対策 - HTMLエスケープ・サニタイゼーション
├── CSRF対策 - トークンベース認証
├── HTTPS強制 - 通信暗号化
└── セキュリティヘッダー設定 - 各種攻撃対策

API・バックエンド保護:
├── レート制限 - DDoS・スパム攻撃対策（15分間で5回まで）
├── 入力値検証 - SQL注入・スクリプト注入対策
├── 環境変数暗号化 - 機密情報保護
├── エラーハンドリング - 情報漏洩防止
├── ログ記録 - セキュリティ監査・追跡
└── アクセス制御 - 認証・認可システム
```

#### 📊 お問い合わせフォームの多層防御
```
防御レイヤー:
1. フロントエンド検証
   ├─ JavaScript によるリアルタイム検証
   ├─ 入力形式チェック（メール形式等）
   └─ 文字数制限・必須項目チェック

2. API レベル防御
   ├─ レート制限（IP別・時間別制御）
   ├─ 厳密な入力値検証・サニタイゼーション
   ├─ XSS・SQLインジェクション攻撃検出
   ├─ CORS オリジン制限
   └─ 危険パターン自動検出・拒否

3. データ保存時保護
   ├─ HTMLエスケープ処理
   ├─ 個人情報の適切なログ記録
   ├─ Google Sheets API認証
   └─ 暗号化通信（HTTPS）

4. 通知時セキュリティ
   ├─ Gmail SMTP認証
   ├─ メール内容のHTMLエスケープ
   ├─ 送信先制限（管理者のみ）
   └─ エラー時の適切なログ記録
```

### ⚠️ リスク管理・緊急時対応

#### 🚨 想定リスクと対策

**1. セキュリティインシデント**
```
リスク: サイト改ざん・データ漏洩・不正アクセス
影響度: 高
発生確率: 低

対策:
├─ 即座対応: サイト停止・アクセス遮断
├─ 調査: ログ解析・被害範囲特定
├─ 復旧: バックアップからの復元
├─ 報告: 関係者・利用者への連絡
└─ 再発防止: セキュリティ強化・監視強化

緊急連絡先:
- Vercel サポート: https://vercel.com/help
- Sanity サポート: https://www.sanity.io/support  
- Google Workspace 管理者
```

**2. サービス停止・障害**
```
リスク: サーバーダウン・API障害・DNS問題
影響度: 中
発生確率: 中

対策:
├─ 監視: Vercel Dashboard での稼働状況確認
├─ 復旧: 自動復旧またはロールバック
├─ 代替: 静的ページでの最小限サービス継続
├─ 通知: SNS等での利用者への状況報告
└─ 事後: 障害原因分析・改善策実装

障害時チェック項目:
- Vercel サービス状況: https://www.vercel-status.com/
- Sanity サービス状況: https://status.sanity.io/
- DNS設定・ドメイン状況
- 外部API依存サービス状況
```

**3. データ消失・バックアップ障害**
```
リスク: コード・設定・記事データ・画像ファイル消失
影響度: 高
発生確率: 低

対策:
├─ 予防: 定期バックアップ・Git版管理
├─ 冗長化: 複数ロケーションでのデータ保存
├─ 検証: バックアップ整合性の定期確認
├─ 復旧: 段階的復旧プロセス
└─ 文書化: 復旧手順の詳細記録

バックアップ先:
- Git リポジトリ（コード・設定）
- Vercel 自動バックアップ（デプロイ履歴）
- Sanity Cloud（記事・画像データ）
- Google Sheets（お問い合わせデータ）
```

**4. 依存関係・技術的負債**
```
リスク: パッケージ脆弱性・ライブラリサポート終了
影響度: 中
発生確率: 高

対策:
├─ 定期監査: npm audit によるセキュリティチェック
├─ 更新管理: 段階的なバージョンアップ戦略
├─ テスト: アップデート前の十分な動作確認
├─ 文書化: 変更履歴・影響範囲の記録
└─ 代替準備: 重要ライブラリの代替案検討

推奨メンテナンススケジュール:
- 毎週: npm audit チェック
- 毎月: 軽微なパッケージ更新
- 四半期: メジャーバージョン検討・テスト
- 半年: 技術スタック全体見直し
```

#### 🔒 個人情報・GDPR対応

**個人情報保護対策**
```
取得データ:
├─ お問い合わせフォーム: 名前・メールアドレス・内容
├─ アクセスログ: IPアドレス・アクセス時刻・リファラー
└─ Sanity CMS: 管理者アカウント情報

保護措置:
├─ 暗号化: HTTPS通信・データベース暗号化
├─ アクセス制限: 管理者のみアクセス可能
├─ ログ管理: 個人情報のマスク化・自動削除
├─ 同意確認: プライバシーポリシー同意必須
└─ 削除権: データ削除要求への対応手順

法的対応:
- プライバシーポリシー: /privacy.html で公開
- 利用規約: /terms.html で公開  
- Cookie ポリシー: 最小限のトラッキング
- データ削除要求: contact@ajiyoshi-network.jp へ連絡
```

### ⚡ パフォーマンス最適化
```
最適化:
├── Next.js App Router (SSG/SSR)
├── 画像最適化 (next/image)
├── CDN配信 (Vercel Edge)
├── Sanity CDN (画像・アセット)
├── コード分割
└── キャッシュ戦略
```

---

## 🚨 トラブルシューティング

### ❌ よくある問題と解決法

#### 1. 【重要】React依存関係エラー・デプロイエラー
```bash
# 問題: React 18とReact DOM 19の競合によるデプロイエラー
# 症状: "npm warn ERESOLVE overriding peer dependency" + Vercel デプロイ失敗

# 解決手順:
# 1. package.jsonのReactバージョンを固定
"react": "18.3.1",
"react-dom": "18.3.1",

# 2. overridesセクションを更新
"overrides": {
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "@sanity/icons": "^3.0.0"
}

# 3. 依存関係再インストール
rm -rf node_modules package-lock.json
npm install

# 4. ビルドテスト
npm run build

# 5. 再デプロイ
vercel --prod
```

#### 2. サイトが表示されない
```bash
# ビルドエラー確認
npm run build

# 依存関係修復
rm -rf node_modules package-lock.json
npm install

# Vercelログ確認
vercel logs [deployment-url]

# 直前の正常バージョンにロールバック
vercel rollback [deployment-id]
```

#### 3. ブログが更新されない
```bash
# Sanity接続確認
node -e "
const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03'
});
client.fetch('*[_type == \"post\"]').then(console.log);
"

# 手動同期（実在するファイルの場合）
node sync-new-posts.js

# Sanity Studio確認
npm run studio
# ブラウザで http://localhost:3333 にアクセス
```

#### 4. お問い合わせフォーム不具合
```bash
# 環境変数確認
echo "GOOGLE_SERVICE_ACCOUNT_EMAIL: $(echo $GOOGLE_SERVICE_ACCOUNT_EMAIL | cut -c1-10)..."
echo "GMAIL_USER: $(echo $GMAIL_USER | cut -c1-5)..."

# フォームテスト（テストモード）
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -H "x-test: true" \
  -d '{
    "name": "テストユーザー",
    "email": "test@example.com",
    "subject": "テスト件名",
    "message": "これはテストメッセージです。"
  }'

# 本番APIテスト
curl -X POST https://ajiyoshi-network-clean.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "テストユーザー",
    "email": "test@example.com", 
    "subject": "テスト件名",
    "message": "これはテストメッセージです。"
  }'
```

---

## 📊 監視・分析

### 📈 重要指標
```
監視項目:
├── サイト稼働率 (Vercel Dashboard)
├── ページ表示速度 (Core Web Vitals)
├── SEOスコア (Google Search Console)
├── ブログ記事更新頻度
└── お問い合わせ受信数
```

### 🔍 分析ツール
```
ツール:
├── Vercel Analytics (アクセス解析)
├── Google Search Console (検索パフォーマンス)
├── Lighthouse (パフォーマンス測定)
└── Sanity Vision (データクエリ)
```

---

## 💾 バックアップ・災害復旧

### 🔄 バックアップ戦略
```
自動バックアップ:
├── Git リポジトリ (コード・設定)
├── Vercel デプロイ履歴
├── Sanity Cloud (CMSデータ)
└── 画像ファイル (Sanity CDN)
```

### 🆘 緊急復旧手順
```
サイト停止時:
1. Vercel Dashboard → Deployments 確認
2. 直前の正常バージョンにロールバック
3. Sanity データ整合性確認
4. 根本原因調査・修正
5. 再デプロイ
```

---

## 🔄 最近の重要な変更（2025年12月まで）

### 📅 主要な更新履歴
```
2025年12月9日: 【重要】React依存関係修正・Antigravity引継ぎ完了
- React 18とReact DOM 19の競合問題解決
- package.jsonでReact 18.3.1に固定
- overridesセクション更新によるバージョン統一
- Vercelデプロイエラー完全解消
- Antigravity向け包括的引継ぎドキュメント完成
- セキュリティ・リスク管理項目追加
- お問い合わせフォーム環境設定詳細化

2025年12月6日:
- 味美推しフェス記事公開
- ブログデータ更新（11記事）

2025年11月:
- CODEX引継ぎドキュメント作成
- セキュリティ強化パッチ適用

2025年10月:
- Next.js App Router完全移行
- セキュリティヘッダー実装

2025年9月:
- Sanity CMS統合完成
- お問い合わせシステム修復
```

### 🔧 2025年12月9日の技術的修正詳細
```
修正内容:
├─ package.json依存関係修正
│  ├─ "react": "18.3.1" (固定バージョン)
│  ├─ "react-dom": "18.3.1" (固定バージョン)
│  └─ overrides セクション更新
├─ npm install による依存関係再構築
├─ ビルドテスト成功確認
├─ Vercel本番デプロイ成功
└─ 新しい本番URL: https://ajiyoshi-network-clean-ghsqkbl4k-blogcontents0808s-projects.vercel.app

修正理由:
- Sanity Vision の依存関係がReact DOM 19を要求
- プロジェクト側はReact 18を使用
- バージョン競合によりVercelデプロイが失敗
- overrides による強制的なバージョン統一で解決

影響:
- デプロイエラー完全解消
- 今後の安定運用確保
- Antigravity での運用準備完了
```

---

## 🚀 今後の発展計画

### 📈 推奨改善項目
```
短期目標 (3ヶ月):
├── TypeScript完全移行
├── テスト自動化導入
├── パフォーマンス監視強化
└── アクセシビリティ向上

中期目標 (6ヶ月):
├── 多言語対応
├── 会員システム
├── イベント管理機能
└── モバイルアプリ対応

長期目標 (1年):
├── AI チャットボット
├── 予約システム
├── EC機能
└── マーケティング自動化
```

---

## 📞 緊急時連絡先・リソース

### 🔗 重要なリンク
```
管理ダッシュボード:
├── Vercel: https://vercel.com/dashboard
├── Sanity: https://www.sanity.io/manage
├── GitHub: https://github.com/[repository]
└── Domain: 独自ドメイン管理

ドキュメント:
├── Next.js: https://nextjs.org/docs
├── Sanity: https://www.sanity.io/docs
├── Vercel: https://vercel.com/docs
└── プロジェクト内README.md
```

### 📚 学習リソース
```
推奨学習:
├── Next.js 公式チュートリアル
├── Sanity Studio ガイド
├── React 18 新機能
└── Web パフォーマンス最適化
```

---

## ⚠️ 重要な注意事項

### 🚫 絶対に行ってはいけない操作
```
危険な操作:
├── 本番データベース直接編集
├── 環境変数のコミット
├── セキュリティ設定無効化
├── バックアップなしの大幅変更
└── 本番での実験的コード実行
```

### ✅ 推奨作業フロー
```
安全な作業手順:
1. ローカル環境でテスト
2. Git ブランチで作業
3. プルリクエストレビュー
4. ステージング確認
5. 本番デプロイ
6. 動作確認・監視
```

---

## 🎯 Antigravity向け特別指示

### 🔧 即座に確認すべき事項
```
優先チェック項目:
1. .env.local ファイルの環境変数値確認
2. Vercel Dashboard アクセス権確認
3. Sanity Studio ログイン確認
4. Google Sheets API 設定確認
5. ドメイン管理権限確認
```

### 📋 初期設定タスク
```
セットアップタスク:
1. 開発環境構築 (npm install → npm run dev)
2. Sanity Studio アクセス確認
3. 記事作成・公開テスト
4. お問い合わせフォームテスト
5. デプロイメントテスト
```

---

**📅 引継ぎ完了日**: 2025年12月8日  
**✏️ 引継ぎ元**: Claude Code  
**🎯 引継ぎ先**: Antigravity  
**📝 文書バージョン**: v2.0.0  
**🔄 次回更新**: 必要に応じて随時

---

**🚀 Antigravity様での運用開始を心よりお祈りしております！**