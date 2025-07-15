# Vibe Project Universal Makefile
# このMakefileは全プロジェクトで共通です

# プロジェクト名を自動検出
PROJECT_NAME := $(notdir $(CURDIR))

# カラー定義
GREEN := \033[0;32m
YELLOW := \033[1;33m
CYAN := \033[0;36m
RED := \033[0;31m
NC := \033[0m

# 共通変数定義
NODE_CMD = node
NPM_CMD = npm
NPSX_CMD = npx
PUBLIC_DIR = public
DEV_PORT ?= 3000

# 利用可能なポートを探す関数
define find_available_port
    port=$(DEV_PORT); \
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; do \
        echo "$(YELLOW)⚠ ポート $port は使用中です。次のポートを試します...$(NC)"; \
        port=$((port + 1)); \
    done; \
    echo "$port"
endef

# プロジェクト固有の設定を読み込み（必須）
include tools/makefile/Makefile_local

# デフォルトターゲット
.DEFAULT_GOAL := help

# PHONYターゲットの宣言
.PHONY: help setup preview dev deploy clean

# ヘルプ表示
help: ## コマンド一覧を表示
	@echo "$(CYAN)=========================================$(NC)"
	@echo "$(CYAN)$(PROJECT_NAME) - コマンド一覧$(NC)"
	@echo "$(CYAN)=========================================$(NC)"
	@echo ""
	@echo "$(GREEN)基本コマンド:$(NC)"
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-15s %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)ローカルコマンド:$(NC)"
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' tools/makefile/Makefile_local 2>/dev/null | awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-15s %s\n", $$1, $$2}' || echo "  （プロジェクト固有のコマンドはありません）"
	@echo ""

# セットアップ
setup: ## 初期セットアップ
	@echo "$(CYAN)▶ セットアップ中...$(NC)"
	@$(call setup_command)
	@echo "$(GREEN)✓ セットアップ完了$(NC)"

# プレビュー
preview: ## ローカルでプレビュー
	@echo "$(CYAN)▶ プレビューを開始...$(NC)"
	@$(call preview_command)

# 開発サーバー起動
dev: ## 開発サーバーを起動
	@echo "$(CYAN)▶ 開発サーバーを起動中...$(NC)"
	@AVAILABLE_PORT=$($(call find_available_port)); \
	echo "$(CYAN)📍 URL: http://localhost:$$AVAILABLE_PORT$(NC)"; \
	DEV_PORT=$$AVAILABLE_PORT $(call dev_command)

# デプロイ
deploy: ## プロジェクトをデプロイ
	@echo "$(CYAN)▶ デプロイを開始...$(NC)"
	@$(call deploy_command)
	@echo "$(GREEN)✓ デプロイ完了$(NC)"

# クリーンアップ
clean: ## ビルドファイルを削除
	@echo "$(YELLOW)▶ クリーンアップ中...$(NC)"
	@$(call clean_command)
	@echo "$(GREEN)✓ クリーンアップ完了$(NC)"

# すべてのプロジェクト固有のターゲットはtools/makefile/Makefile_localに定義する