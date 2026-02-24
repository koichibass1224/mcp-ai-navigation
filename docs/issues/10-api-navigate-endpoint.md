# Issue #10: /api/navigate エンドポイント実装

### 背景 / 目的
ナビリクエストを受け取り、Claude→MCP→Google Mapsを経由してルートを返すメインAPIを実装する。これがPoCの核心機能となる。

- 依存: #5, #9
- ラベル: `backend`, `api`

### スコープ / 作業項目
- [ ] `backend/src/routes/navigate.ts`作成
  - POST /api/navigate エンドポイント
  - リクエストボディのバリデーション
- [ ] Claude API呼び出しフロー実装
  - システムプロンプト設定（`docs/04_api.md`参照）
  - ユーザーメッセージ構築（origin/destination/message）
  - tool_use → MCPツール実行 → tool_result のループ
- [ ] レスポンス整形
  - polylineデコード（エンコード済み文字列 → 座標配列）
  - distance/duration/steps/summary抽出
  - reasoningフィールド構築
- [ ] フロントエンドからの呼び出し実装
  - InputFormのsubmitで/api/navigate呼び出し

### ゴール / 完了条件（Acceptance Criteria）
- [ ] `POST /api/navigate`でリクエストを受け付ける
- [ ] origin/destination/messageを受け取りClaudeに渡す
- [ ] Claudeがroute_searchツールを呼び出し、結果を返す
- [ ] polyline/distance/duration/stepsを含むレスポンスを返す
- [ ] reasoningフィールドにClaudeの判断情報を含む
- [ ] バリデーションエラー時に400を返す

### テスト観点
- リクエスト: `curl -X POST http://localhost:3001/api/navigate -H "Content-Type: application/json" -d '{"origin":"東京駅","destination":"横浜駅","message":"最短で"}'`
- 検証方法: polyline配列、distance、durationが返る

### 参考ドキュメント
- `docs/04_api.md` - POST /api/navigate仕様、リクエスト/レスポンス形式
- `docs/02_architecture.md` - 通信フロー（シーケンス図）
- `docs/01_requirements.md` - 自然文入力例と期待動作
