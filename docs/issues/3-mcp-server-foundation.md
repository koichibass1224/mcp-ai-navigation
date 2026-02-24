# Issue #3: MCPサーバー基盤構築

### 背景 / 目的
@modelcontextprotocol/sdkを用いて、インプロセスMCPサーバーのスケルトンを実装する。Claudeがツールを呼び出すための基盤となる。

- 依存: #2
- ラベル: `backend`, `mcp`

### スコープ / 作業項目
- [ ] `@modelcontextprotocol/sdk`パッケージ追加
- [ ] `backend/src/mcp/server.ts`作成
  - MCPサーバーインスタンス初期化
  - `tools/list`ハンドラー実装（空配列を返す）
  - `tools/call`ハンドラーのスケルトン
- [ ] Expressサーバー起動時にMCPサーバーも起動
- [ ] `/api/health`にMCPステータスを追加

### ゴール / 完了条件（Acceptance Criteria）
- [ ] MCPサーバーがExpressプロセス内で起動する
- [ ] `tools/list`で空のツール一覧が返る
- [ ] MCPサーバーの起動ログが出力される
- [ ] `/api/health`でMCPサーバーのステータスが確認できる

### テスト観点
- ユニット: MCPサーバー初期化が成功する
- リクエスト: `/api/health`でMCPステータスが`running`
- 検証方法: サーバー起動ログに「MCP Server started」が出力される

### 参考ドキュメント
- `docs/02_architecture.md` - MCP接続方式（インプロセス）
- `docs/04_api.md` - MCPツール定義

### 要確認事項
- @modelcontextprotocol/sdkの最新バージョン・APIを確認
