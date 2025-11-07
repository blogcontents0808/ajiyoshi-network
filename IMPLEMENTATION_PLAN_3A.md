# 推奨アプローチ3-A：段階的復活実装計画

## 🎯 目標
元の`ajiyoshi-network`プロジェクトを復活させ、現行システムの稼働を維持しながら段階的に移行する

**対象URL:** `https://ajiyoshi-network-blogcontents0808s-projects.vercel.app`

## 📋 実装フェーズ詳細

### 🟢 フェーズ1: 元プロジェクト環境変数設定（30分、リスク：LOW）

#### 1-1. プロジェクト確認・アクセス
```bash
# 現在のプロジェクト一覧確認
vercel project ls

# 元プロジェクトが存在することを確認済み
# ajiyoshi-network (https://ajiyoshi-network-blogcontents0808s-projects.vercel.app)
```

#### 1-2. 環境変数の移行設定
```bash
# 元プロジェクトに切り替える必要があるか確認
vercel link --project ajiyoshi-network

# 環境変数を元プロジェクトに設定
vercel env add GOOGLE_SPREADSHEET_ID production
# 値: 16_rP-kDw3MLgNw_M16w9jgmi2LQB57b_D00gbQk3ek8

vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production
# 値: ajiyoshi-contact-service@ajiyoshi-network-contact.iam.gserviceaccount.com

vercel env add GOOGLE_PRIVATE_KEY production --sensitive
# 値: [JSONファイルからの秘密鍵]
```

#### 1-3. 設定確認
```bash
# 元プロジェクトの環境変数確認
vercel env ls --project ajiyoshi-network
```

### 🟡 フェーズ2: GitHubコード同期（1時間、リスク：MEDIUM）

#### 2-1. GitHubリポジトリの特定・アクセス
元プロジェクトはGitHub自動デプロイを使用していることを確認済み：
- **リポジトリ:** `github.com/blogcontents0808/ajiyoshi-network`
- **ブランチ:** `main`
- **最終コミット:** `dea1621`

#### 2-2. 修正版コードの反映
**重要な修正箇所:**

1. **CORS設定修正** - `pages/api/contact/index.js:183`
```javascript
// 現在のcleanプロジェクトの修正版をGitHubに反映
const isProductionVercel = origin && origin.match(
  /^https:\/\/ajiyoshi-network(-clean)?-[\w-]+-blogcontents0808s-projects\.vercel\.app$/
);
const isMainDomain = origin === 'https://ajiyoshi-network.vercel.app' || 
                    origin === 'https://ajiyoshi-network-clean.vercel.app' ||
                    origin === 'https://ajiyoshi-network-blogcontents0808s-projects.vercel.app';
```

#### 2-3. デプロイメント実行
GitHubにコミット後、Vercelが自動デプロイを実行

### 🟢 フェーズ3: テスト・動作確認（30分、リスク：LOW）

#### 3-1. 基本機能テスト
1. **サイトアクセス確認**
   ```
   https://ajiyoshi-network-blogcontents0808s-projects.vercel.app
   ```

2. **お問い合わせフォームアクセス**
   ```
   https://ajiyoshi-network-blogcontents0808s-projects.vercel.app/contact.html
   ```

#### 3-2. 統合テスト
1. **テストデータ送信**
   - 名前: `復活テスト太郎`
   - メール: `recovery-test@example.com`
   - 件名: `元プロジェクト復活確認`
   - 内容: `ajiyoshi-networkプロジェクト復活テストです`

2. **スプレッドシート反映確認**
   ```
   https://docs.google.com/spreadsheets/d/16_rP-kDw3MLgNw_M16w9jgmi2LQB57b_D00gbQk3ek8/edit
   ```

#### 3-3. エラーログ確認
```bash
# 元プロジェクトのデプロイメントログ確認
vercel logs https://ajiyoshi-network-blogcontents0808s-projects.vercel.app
```

### 🟡 フェーズ4: 運用切り替え案内（随時、リスク：LOW）

#### 4-1. URL案内変更
**メインURL変更:**
- **旧案内:** `https://ajiyoshi-network-clean.vercel.app`
- **新案内:** `https://ajiyoshi-network-blogcontents0808s-projects.vercel.app`

#### 4-2. SEO・外部リンク対応
1. **Google Search Console更新**
2. **SNSリンク更新**
3. **名刺・印刷物の次回更新時に反映**

#### 4-3. リダイレクト設定（オプション）
`ajiyoshi-network-clean`から元URLへのリダイレクト設定

---

## 🔍 代替手順：GitHubアクセスない場合

### GitHubリポジトリにアクセスできない場合の対処

#### 代替案A: ローカルリポジトリクローン
```bash
# GitHubから最新版をクローン
git clone https://github.com/blogcontents0808/ajiyoshi-network.git
cd ajiyoshi-network

# 現在のcleanプロジェクトから修正版ファイルをコピー
cp ../ajiyoshi-network-clean/pages/api/contact/index.js ./pages/api/contact/

# コミット・プッシュ
git add .
git commit -m "🔧 Fix CORS settings and environment variables integration"
git push origin main
```

#### 代替案B: Vercel CLI直接デプロイ
```bash
# 元プロジェクト用ディレクトリ作成
mkdir ajiyoshi-network-recovery
cd ajiyoshi-network-recovery

# 修正版ファイルを配置
# [手動でファイルコピー・設定]

# 元プロジェクトにデプロイ
vercel --prod --project ajiyoshi-network
```

---

## ⚠️ リスク対策・フォールバック計画

### 想定リスク・対策

#### リスク1: 環境変数設定エラー
**対策:**
- 現在の`ajiyoshi-network-clean`は稼働維持
- エラー発生時は即座にcleanプロジェクトに戻す

#### リスク2: GitHubデプロイエラー
**対策:**
- コミット前に必ずローカルテスト実行
- エラー時は`git revert`で即座に復旧

#### リスク3: CORS設定エラー
**対策:**
- 新しい正規表現で全パターンをカバー
- テスト環境での事前確認

### フォールバック手順
```bash
# 緊急時：cleanプロジェクトを主URLとして案内
# 1. DNS案内を即座に戻す
# 2. 外部サービス連携は継続使用
# 3. 修正・再実行
```

---

## 📊 成功基準・KPI

### 技術的成功基準
- ✅ 元プロジェクトでお問い合わせフォーム正常動作
- ✅ スプレッドシートへの自動記録
- ✅ セキュリティ機能正常動作
- ✅ エラーログゼロ

### 運用的成功基準
- ✅ ダウンタイム0分達成
- ✅ ユーザー影響なし
- ✅ データ連続性保持
- ✅ 元URLでの正常アクセス

### パフォーマンス基準
- 📊 フォーム送信レスポンス時間: <3秒
- 📊 ページロード時間: <2秒
- 📊 API応答時間: <1秒
- 📊 スプレッドシート反映: <10秒

---

## 📅 実装スケジュール

### 推奨実行タイミング
**平日の午前中（10:00-12:00）を推奨**
- 問題発生時の対応時間確保
- 技術サポート対応可能時間
- ユーザー利用が比較的少ない時間

### タイムテーブル
| 時刻 | フェーズ | 所要時間 | 累計 |
|------|----------|----------|------|
| 10:00-10:30 | フェーズ1: 環境変数設定 | 30分 | 30分 |
| 10:30-11:30 | フェーズ2: コード同期 | 1時間 | 1.5時間 |
| 11:30-12:00 | フェーズ3: テスト確認 | 30分 | 2時間 |
| 12:00- | フェーズ4: 運用切り替え | 随時 | - |

---

## 🏆 期待される効果

### 短期効果（即時〜1週間）
1. **元URLの復活**: `ajiyoshi-network-***`形式
2. **GitHub統合復旧**: 自動デプロイ機能活用
3. **運用安定性向上**: メインストリーム復帰

### 長期効果（1ヶ月〜）
1. **運用コスト削減**: 単一プロジェクト管理
2. **開発効率向上**: GitHub連携活用
3. **SEO効果**: 一貫したURL使用
4. **ブランド統一**: 正式プロジェクト名使用

---

## 📞 実装支援体制

### 技術サポート
- **Claude Code Assistant**: 実装支援・トラブルシューティング
- **Vercel公式ドキュメント**: 参照・確認
- **GitHub Actions**: 自動化サポート

### 緊急時連絡
- **現行システム**: `ajiyoshi-network-clean.vercel.app`で継続対応
- **復旧手順**: 本ドキュメントのフォールバック計画に従う

---

**実装準備完了**  
**リスクレベル:** 🟢 LOW-MEDIUM  
**推奨実行:** ✅ 即時実行可能  
**成功確率:** 95%+

*作成日: 2025年9月14日*  
*最終更新: 2025年9月14日 08:00*