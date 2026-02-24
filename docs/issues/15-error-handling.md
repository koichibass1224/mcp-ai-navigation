# Issue #15: エラーハンドリング改善

### 背景 / 目的
API通信エラー・Google Maps APIエラー・Claude APIエラーの適切なハンドリングとUI表示を実装する。ユーザーにわかりやすいエラーメッセージを提供する。

- 依存: #12, #14
- ラベル: `backend`, `frontend`, `error-handling`

### スコープ / 作業項目
- [ ] バックエンドエラーハンドリング
  - Claude APIエラー → 503 + CLAUDE_API_ERROR
  - Google Maps APIエラー → 502 + GOOGLE_MAPS_ERROR
  - バリデーションエラー → 400 + VALIDATION_ERROR
  - 内部エラー → 500 + INTERNAL_ERROR
- [ ] タイムアウト設定
  - フロント → バックエンド: 30秒
  - バックエンド → Claude API: 25秒
  - MCP → Google Maps API: 10秒
- [ ] フロントエンドエラー表示
  - エラーメッセージコンポーネント
  - リトライ促すUI
- [ ] App.tsxにerror state追加

### ゴール / 完了条件（Acceptance Criteria）
- [ ] Claude APIエラー時に503とエラーメッセージを返す
- [ ] Google Maps APIエラー時に502とエラーメッセージを返す
- [ ] フロントエンドでエラーメッセージをユーザーに表示する
- [ ] ネットワークエラー時にリトライを促すメッセージを表示
- [ ] タイムアウト設定が適用されている（フロント30秒、Claude25秒、Google10秒）

### テスト観点
- 手動確認: 無効なAPIキーでエラーが表示される
- 手動確認: ネットワーク切断でエラーが表示される
- 検証方法: エラーコード・メッセージが仕様通り

### 参考ドキュメント
- `docs/02_architecture.md` - エラーハンドリング方針、タイムアウト設定
- `docs/04_api.md` - エラーレスポンス形式、エラーコード一覧
