# Issue #17: デプロイ設定（Vercel + Railway）

### 背景 / 目的
フロントエンドをVercel、バックエンドをRailwayにデプロイする設定を行う。PoCをWeb上で動作させ、デモ可能な状態にする。

- 依存: #16
- ラベル: `infra`, `deploy`

### スコープ / 作業項目
- [ ] Vercel設定
  - プロジェクト作成
  - ビルドコマンド: `npm run build`
  - 出力ディレクトリ: `dist/`
  - 環境変数: `VITE_API_BASE_URL`
- [ ] Railway設定
  - プロジェクト作成
  - 起動コマンド: `npm start`
  - 環境変数設定
    - `ANTHROPIC_API_KEY`
    - `GOOGLE_MAPS_API_KEY`
    - `PORT`（Railway自動割当）
- [ ] CORS設定更新
  - 本番Vercelドメインを許可
- [ ] README.md作成
  - デプロイ手順
  - 環境変数一覧
  - ローカル開発手順

### ゴール / 完了条件（Acceptance Criteria）
- [ ] Vercelにフロントエンドがデプロイされる
- [ ] Railwayにバックエンドがデプロイされる
- [ ] 環境変数が各プラットフォームに設定されている
- [ ] 本番環境でCORS設定が正しく動作する
- [ ] デプロイ手順がREADMEに記載されている

### テスト観点
- E2E: 本番URLでルート検索が動作する
- 検証方法: デプロイ後にブラウザからアクセスし動作確認

### 参考ドキュメント
- `docs/02_architecture.md` - デプロイアーキテクチャ、デプロイ設定
- `docs/01_requirements.md` - 技術スタック（デプロイ先）

### 要確認事項
- Vercel/Railwayアカウント作成済みか
- 無料枠の制限確認
