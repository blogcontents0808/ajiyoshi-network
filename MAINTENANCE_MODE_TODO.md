# メンテナンスモード実装 - 次回作業予定

## 現状の問題

- `next.config.js` の redirects/rewrites は `public/` フォルダ内の静的HTMLファイルには適用されない
- `public/index.html`, `public/blog.html` などが直接配信されてしまう
- Middleware も静的ファイルには適用されない

## 次回試すべき方法

### 方法1: 静的HTMLファイルを直接置き換える（最も確実）



1. `public/` フォルダ内のHTMLファイルをバックアップ
2. 各HTMLファイルの内容を `maintenance.html` の内容に置き換え
3. デプロイ
4. メンテナンス終了時にバックアップから復元

### 方法2: public/index.html を削除して Next.js のルーティングを使う

1. `public/index.html` を削除（またはリネーム）
2. `pages/index.jsx` でメンテナンスモードを表示
3. 他の静的HTMLも同様に対応

### 方法3: Vercel Edge Config を使う（Pro プランが必要かも）

- Vercel の Edge Middleware でリダイレクト
- 静的ファイルより前に処理される

## 作成済みファイル

- `public/maintenance.html` - メンテナンスページ（作成済み）
- `middleware.js` - Next.js Middleware（静的ファイルには効かない）
- `next.config.js` - redirects/rewrites 設定済み（静的ファイルには効かない）

## Vercel 環境変数

- `NEXT_PUBLIC_MAINTENANCE_MODE=true` が設定済み

## 推奨アクション

次回は **方法1** で進めることを推奨。
`public/` フォルダ内のHTMLファイルをバックアップして、メンテナンスページに置き換える。

---
作成日: 2026-02-09
