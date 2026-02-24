# Issue #2: バックエンド基盤 + /api/health

### 背景 / 目的
Express + TypeScript環境を構築し、最初のAPIエンドポイント（ヘルスチェック）を実装する。フロントエンドとの疎通確認の前提となる。

- 依存: #1
- ラベル: `backend`

### スコープ / 作業項目
- [ ] `backend/src/index.ts`作成（Expressサーバーエントリーポイント）
- [ ] CORS設定（開発環境: localhost:5173許可）
- [ ] 環境変数読み込み（dotenv）
- [ ] `/api/health`エンドポイント実装
- [ ] `package.json`にscripts追加
  - `dev`: tsx watch実行
  - `build`: TypeScriptコンパイル
  - `start`: 本番起動

### ゴール / 完了条件（Acceptance Criteria）
- [ ] `npm run dev`でExpressサーバーが起動する
- [ ] `GET /api/health`が`{ "status": "ok" }`を返す
- [ ] CORS設定が有効になっている
- [ ] 環境変数`PORT`で起動ポートを変更できる

### テスト観点
- リクエスト: `curl http://localhost:3001/api/health`
- 検証方法: レスポンスが`{"status":"ok"}`であること
- CORS確認: ブラウザからのリクエストが通ること

### 参考ドキュメント
- `docs/04_api.md` - GET /api/health仕様
- `docs/02_architecture.md` - バックエンド責務定義
