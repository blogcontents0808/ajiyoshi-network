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
```bash
重要な環境変数:
NEXT_PUBLIC_SANITY_PROJECT_ID=qier3tei
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=（要確認・更新）
GOOGLE_SHEETS_CREDENTIALS=（要確認・更新）
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
```
1. Sanity Studioログイン
   → https://ajiyoshi-network.sanity.studio/

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

## 🛡️ セキュリティ・パフォーマンス

### 🔐 実装済みセキュリティ対策
```
セキュリティ機能:
├── CSP (Content Security Policy)
├── CORS設定
├── XSS対策
├── CSRF対策
├── 環境変数による機密情報保護
├── HTTPS強制
└── セキュリティヘッダー設定
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

#### 1. サイトが表示されない
```bash
# ビルドエラー確認
npm run build

# 依存関係修復
rm -rf node_modules package-lock.json
npm install

# Vercelログ確認
vercel logs
```

#### 2. ブログが更新されない
```bash
# Sanity接続確認
node -e "const client = require('./lib/sanity'); client.fetch('*[_type == \"post\"]').then(console.log)"

# 手動同期
node complete-sanity-sync.js

# データ修復
node fix-blog-data.js
```

#### 3. お問い合わせフォーム不具合
```bash
# 環境変数確認
cat .env.local

# Google Sheets API接続テスト
node -e "console.log(process.env.GOOGLE_SHEETS_CREDENTIALS)"

# メール送信テスト
node test-contact-form.js
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