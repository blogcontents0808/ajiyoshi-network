# vibe blog by sanity

Sanityを活用したヘッドレスCMSブログシステム

## 概要

vibe blog by sanityは、Sanity CMSをバックエンドに使用したモダンなブログシステムです。ヘッドレスCMSの柔軟性と、静的サイトのパフォーマンスを両立しています。

## 特徴

- **Sanity CMS統合**: ヘッドレスCMSでコンテンツを柔軟に管理
- **リアルタイムプレビュー**: Sanity Studioで即座に変更を確認
- **画像最適化**: Sanityの画像パイプラインで自動最適化
- **構造化コンテンツ**: ブロックエディタでリッチなコンテンツ作成
- **APIファースト**: GROQクエリで必要なデータのみ取得
- **マルチユーザー対応**: 複数の編集者で同時作業可能

## 技術スタック

- **フロントエンド**: Next.js 14, React 18, TypeScript
- **CMS**: Sanity v3
- **スタイリング**: Tailwind CSS
- **デプロイ**: Vercel/Firebase対応

## ディレクトリ構造

```
vibe-blog-by-sanity/
├── app/                      # Next.jsアプリケーション
│   ├── app/                 # App Router
│   │   ├── globals.css      # グローバルスタイル
│   │   ├── layout.tsx       # レイアウトコンポーネント
│   │   ├── page.tsx         # トップページ
│   │   └── posts/           # 記事ページ
│   ├── lib/                 # ユーティリティ
│   ├── schemaTypes/         # Sanityスキーマ
│   └── package.json         # プロジェクト設定
├── contents/                # ブログコンテンツ
│   ├── common/             # 共通設定
│   │   ├── author.md       # 著者情報
│   │   └── setting.md      # サイト設定
│   └── posts/              # 記事ソース
├── tools/                   # ビルド・デプロイツール
├── Makefile                 # Makeコマンド
└── README.md                # このファイル
```

## 使い方

### クイックスタート

```bash
# コマンド一覧を表示
make

# 初期セットアップ
make setup

# 開発サーバーを起動
make dev

# Sanity Studioを起動（別ターミナル）
make studio
```

### 初期設定

1. **Sanityプロジェクトの作成**
   ```bash
   cd app
   npx sanity init
   ```

2. **環境変数の設定**
   ```bash
   # .env.local を作成
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_api_token
   ```

3. **設定ファイルの更新**
   - `app/sanity.config.ts`のprojectIdを更新

### 開発コマンド

```bash
# 開発サーバーを起動
make dev

# Sanity Studioを起動
make studio

# ビルド
make build

# プレビュー
make preview

# デプロイ
make deploy
```

### コンテンツ管理

- **Sanity Studio**: http://localhost:3333
- 記事の作成・編集はStudio経由で行います
- 記事、著者、カテゴリ、サイト設定を管理できます

### デプロイ

```bash
# Vercelにデプロイ
make deploy-vercel

# Firebaseにデプロイ
make deploy-firebase

# Sanity Studioをデプロイ
make deploy-studio
```

## 機能

### SEO対策
- Open Graphタグの自動生成
- 構造化データの埋め込み
- レスポンシブデザイン

### パフォーマンス
- Next.js 14の最新機能を活用
- 画像の自動最適化
- 静的生成による高速表示

### カスタマイズ
- Tailwind CSSによる柔軟なスタイリング
- TypeScript完全対応
- 拡張可能なスキーマ設計

## 必要環境

- Node.js 18以上
- npm または yarn
- Sanityアカウント

## ライセンス

MIT License