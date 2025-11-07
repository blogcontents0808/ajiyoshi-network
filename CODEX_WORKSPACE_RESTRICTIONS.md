# 🚧 CODEX ワークスペース制限設定

**味美ネットワーク - CODEX運用安全ガイドライン**

---

## 🎯 ワークスペース制限の目的

### 🛡️ 安全性確保
- **データ保護**: 重要ファイルの誤削除・破損防止
- **スコープ限定**: 作業範囲を明確に定義
- **リスク最小化**: 予期しない変更による影響を局所化

### 📁 許可範囲
```
✅ 許可: D:\AI-SANDBOX\ 配下のみ
❌ 禁止: D:\AI-SANDBOX\ 外のすべて
```

---

## 🔐 CODEX運用ルール

### ✅ 許可される操作

#### 1. ファイル操作
```bash
# 許可されるパス
D:\AI-SANDBOX\ajiyoshi-network-clean\**
D:\AI-SANDBOX\backup\**
D:\AI-SANDBOX\temp\**

# 許可される操作
- ファイル読み取り (Read)
- ファイル編集 (Edit) 
- ファイル作成 (Write)
- ディレクトリ作成 (mkdir)
- ファイル移動 (mv) - AI-SANDBOX内のみ
- ファイル削除 (rm) - 確認後のみ
```

#### 2. 開発操作
```bash
# Node.js / npm 操作
cd D:\AI-SANDBOX\ajiyoshi-network-clean
npm install
npm run dev
npm run build
npm run studio

# Git 操作
git status
git add .
git commit -m "message"
git push
```

#### 3. Sanity操作
```bash
# Sanity Studio
cd D:\AI-SANDBOX\ajiyoshi-network-clean\vibe-blog-by-sanity
npm run studio

# データ同期
node complete-sanity-sync.js
node fix-blog-data.js
```

### ❌ 禁止される操作

#### 1. システムレベル操作
```bash
# 絶対禁止
❌ C:\Windows\**
❌ C:\Program Files\**
❌ C:\Users\[username]\AppData\**
❌ レジストリ操作
❌ システムサービス操作
```

#### 2. 外部ディレクトリ
```bash
# AI-SANDBOX外のアクセス禁止
❌ D:\other-projects\**
❌ C:\work\**
❌ ホームディレクトリ直接操作
❌ デスクトップファイル操作
```

#### 3. 危険なコマンド
```bash
# 実行禁止コマンド
❌ format / fdisk
❌ rm -rf / (ルート削除)
❌ reg delete (レジストリ削除)
❌ net user (ユーザー操作)
❌ sc delete (サービス削除)
```

---

## 📋 CODEXへの指示テンプレート

### 🤖 基本制約指示

```markdown
## ワークスペース制約

あなたの作業範囲は以下に限定されます：

**許可範囲**: `D:\AI-SANDBOX\` 配下のみ
**禁止範囲**: `D:\AI-SANDBOX\` 外のすべてのディレクトリ

### 必須確認事項
1. ファイルパスが D:\AI-SANDBOX\ で始まることを確認
2. システムファイルには一切触れない
3. 不明なファイル操作は事前に確認を求める
4. バックアップを作成してから重要な変更を実行

### エラー時の対応
- パス制限エラーが発生したら作業を停止
- 許可範囲外のアクセスは拒否する
- 疑問がある場合は必ず確認する
```

### 🔧 技術的制約

```markdown
## 技術的制約

### ファイル操作制限
- 読み取り: D:\AI-SANDBOX\** のみ
- 書き込み: D:\AI-SANDBOX\** のみ  
- 削除: 重要ファイルは確認後のみ
- 移動: AI-SANDBOX内の移動のみ

### コマンド実行制限
- cd コマンド: D:\AI-SANDBOX\** のみ
- npm/node: プロジェクトディレクトリ内のみ
- git: プロジェクトリポジトリ内のみ
- システムコマンド: 使用禁止

### ネットワーク制限
- 外部API: Sanity, Vercel, Github のみ
- ファイルダウンロード: プロジェクト関連のみ
- パッケージインストール: package.json記載のもののみ
```

---

## ⚠️ 安全確認チェックリスト

### 🔍 作業前確認
```markdown
□ 作業対象が D:\AI-SANDBOX\ 配下か確認
□ バックアップが存在するか確認  
□ 変更内容が適切な範囲か確認
□ 削除ファイルが重要でないか確認
□ 外部アクセスが必要最小限か確認
```

### 🛠️ 操作中確認
```markdown
□ ファイルパスが制限範囲内か確認
□ エラーメッセージに注意
□ 予期しない動作の場合は停止
□ ログを適切に記録
□ 進捗を定期的に報告
```

### ✅ 作業後確認
```markdown
□ 変更内容が意図通りか確認
□ システムが正常動作するか確認
□ 不要ファイルが残っていないか確認
□ 次回作業のための記録を残す
□ バックアップの更新
```

---

## 🚨 違反時の対応

### 🔴 レベル1: 軽微な違反
**症状**: 許可範囲外のファイル参照
**対応**: 
1. 即座に操作停止
2. エラーメッセージ表示
3. 正しいパスへの誘導

### 🟠 レベル2: 中程度の違反
**症状**: システムファイルへのアクセス試行
**対応**:
1. 操作の強制停止
2. 警告メッセージ表示
3. 操作ログの記録
4. 管理者への報告

### 🔴 レベル3: 重大な違反
**症状**: 危険なシステムコマンド実行
**対応**:
1. 全操作の即座停止
2. セッション終了
3. 緊急ログ記録
4. 即座の管理者通知

---

## 📁 ディレクトリ構造と権限

### ✅ 完全アクセス許可
```
D:\AI-SANDBOX\
├── ajiyoshi-network-clean\     # メインプロジェクト
│   ├── app\                    # フルアクセス
│   ├── components\             # フルアクセス
│   ├── lib\                    # フルアクセス
│   ├── public\                 # フルアクセス
│   ├── styles\                 # フルアクセス
│   ├── vibe-blog-by-sanity\    # フルアクセス
│   └── *.js, *.json, *.md      # フルアクセス
├── backup\                     # 読み取り専用推奨
└── temp\                       # 一時ファイル用
```

### 🔒 特別注意ディレクトリ
```
D:\AI-SANDBOX\ajiyoshi-network-clean\
├── .env.local                  # 環境変数 - 慎重に扱う
├── package.json                # 依存関係 - 変更時は確認
├── next.config.js              # 設定ファイル - 重要
├── sanity.config.js            # Sanity設定 - 重要
└── .git\                       # Git管理 - 慎重に扱う
```

---

## 🔄 バックアップ戦略

### 📦 自動バックアップ
```bash
# 作業開始前の自動バックアップ
rsync -av D:\AI-SANDBOX\ajiyoshi-network-clean\ D:\AI-SANDBOX\backup\$(date +%Y%m%d_%H%M%S)\

# Git による履歴管理
cd D:\AI-SANDBOX\ajiyoshi-network-clean
git add -A
git commit -m "作業開始前バックアップ: $(date)"
```

### 🔙 復元手順
```bash
# 緊急時復元
cp -r D:\AI-SANDBOX\backup\[最新日時]\ D:\AI-SANDBOX\ajiyoshi-network-clean\

# Git による復元
git checkout [安全なコミット]
git reset --hard HEAD
```

---

## 📊 監視・ログ

### 📈 監視項目
- ファイルアクセスパターン
- コマンド実行履歴  
- エラー発生頻度
- 外部アクセス試行
- リソース使用量

### 📝 ログ記録
```bash
# アクセスログ
echo "$(date): CODEX accessed $filepath" >> D:\AI-SANDBOX\logs\access.log

# エラーログ  
echo "$(date): ERROR - $error_message" >> D:\AI-SANDBOX\logs\error.log

# 操作ログ
echo "$(date): COMMAND - $command" >> D:\AI-SANDBOX\logs\operations.log
```

---

## 📞 緊急時連絡・対応

### 🆘 緊急時対応フロー
1. **即座に作業停止**
2. **現状の記録・保存** 
3. **エラー内容の詳細記録**
4. **バックアップから復元**
5. **管理者への詳細報告**

### 📋 報告テンプレート
```markdown
## CODEX緊急事態報告

**発生日時**: [YYYY-MM-DD HH:MM:SS]
**操作内容**: [実行していた作業]
**エラー内容**: [詳細なエラーメッセージ]
**影響範囲**: [影響を受けたファイル・システム]
**復旧状況**: [現在の復旧進捗]
**今後の対策**: [再発防止案]
```

---

**📅 作成日**: 2025年11月7日  
**✏️ 作成者**: Claude Code  
**🏷️ バージョン**: v1.0.0  
**🔒 セキュリティレベル**: 高  
**⚠️ 重要度**: 最高