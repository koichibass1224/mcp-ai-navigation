# Issue #4: Claude API連携基盤

### 背景 / 目的
@anthropic-ai/sdkを用いてClaude API通信の基盤を実装する。MCPツール定義をClaudeに渡し、ツール呼び出しを受け取れる構造を作る。

- 依存: #3
- ラベル: `backend`, `ai`

### スコープ / 作業項目
- [ ] `@anthropic-ai/sdk`パッケージ追加
- [ ] `backend/src/services/claude.ts`作成
  - Anthropicクライアント初期化
  - メッセージ送信関数
  - ツール定義を渡す構造
  - tool_use/tool_resultのハンドリング構造
- [ ] システムプロンプト定義（`docs/04_api.md`参照）
- [ ] エラーハンドリング（APIエラー、レート制限）

### ゴール / 完了条件（Acceptance Criteria）
- [ ] 環境変数`ANTHROPIC_API_KEY`を読み込める
- [ ] Claude APIにテストメッセージを送信し応答を受け取れる
- [ ] MCPツール定義をClaude APIに渡せる構造になっている
- [ ] APIエラー時に適切なエラーログが出力される

### テスト観点
- ユニット: Anthropicクライアント初期化
- 手動確認: テストメッセージで応答が返る
- 検証方法: `curl`またはテストスクリプトで確認

### 参考ドキュメント
- `docs/04_api.md` - Claudeシステムプロンプト設計、Claude API呼び出しパラメータ
- `docs/02_architecture.md` - Claude責務定義

### 要確認事項
- Claude APIモデル: `claude-sonnet-4-20250514`で確定か
