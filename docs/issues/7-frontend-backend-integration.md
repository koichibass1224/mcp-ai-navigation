# Issue #7: フロント⇔バックエンド疎通確認

### 背景 / 目的
フロントエンドからバックエンドAPIを呼び出し、Walking Skeletonを完成させる。これにより、全レイヤーの疎通が確認できる。

- 依存: #2, #6
- ラベル: `frontend`, `backend`, `integration`

### スコープ / 作業項目
- [ ] フロントエンド環境変数設定
  - `.env`に`VITE_API_BASE_URL=http://localhost:3001`
- [ ] API呼び出しユーティリティ作成
  - `src/utils/api.ts`（fetch wrapper）
- [ ] `/api/health`呼び出しテスト
  - App.tsxのuseEffectで起動時に呼び出し
  - コンソールにステータス出力
- [ ] エラーハンドリング（接続失敗時のログ出力）

### ゴール / 完了条件（Acceptance Criteria）
- [ ] フロントエンドから`/api/health`を呼び出せる
- [ ] 環境変数`VITE_API_BASE_URL`でAPI URLを設定できる
- [ ] CORS経由でのリクエストが成功する
- [ ] 通信エラー時にコンソールにエラーが出力される

### テスト観点
- E2E: フロント起動 → バックエンド起動 → ブラウザでアクセス
- 検証方法: ブラウザDevToolsのConsoleで「API Health: ok」が出力される

### 参考ドキュメント
- `docs/02_architecture.md` - 通信フロー
- `docs/04_api.md` - /api/health仕様
