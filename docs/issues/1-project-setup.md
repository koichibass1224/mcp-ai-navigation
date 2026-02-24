# Issue #1: プロジェクト初期セットアップ

### 背景 / 目的
MCP × Google Maps AIナビ PoCの開発基盤を構築する。frontend/backendの両ディレクトリでTypeScript開発が可能な状態にする。

- 依存: -
- ラベル: `infra`, `setup`

### スコープ / 作業項目
- [ ] `frontend/`ディレクトリ作成
  - Vite + React + TypeScriptプロジェクト初期化
  - `package.json`、`tsconfig.json`、`vite.config.ts`作成
  - Tailwind CSS導入
- [ ] `backend/`ディレクトリ作成
  - Node.js + TypeScriptプロジェクト初期化
  - `package.json`、`tsconfig.json`作成
  - 必要パッケージ: express, cors, dotenv, typescript, tsx
- [ ] `.env.example`をプロジェクトルートに作成
  - ANTHROPIC_API_KEY
  - GOOGLE_MAPS_API_KEY
  - PORT
  - VITE_API_BASE_URL
- [ ] `.gitignore`更新

### ゴール / 完了条件（Acceptance Criteria）
- [ ] `frontend/`に`package.json`、`tsconfig.json`、`vite.config.ts`が存在する
- [ ] `backend/`に`package.json`、`tsconfig.json`が存在する
- [ ] `.env.example`がルートに作成されている
- [ ] `npm install`が両ディレクトリでエラーなく完了する
- [ ] `.gitignore`に`node_modules`、`.env`が含まれている

### テスト観点
- 手動確認: 各ディレクトリで`npm install`が成功する
- 手動確認: TypeScriptコンパイルエラーがない
- 検証方法: `npm install && npx tsc --noEmit`

### 参考ドキュメント
- `docs/02_architecture.md` - 技術スタック詳細
- `CLAUDE.md` - 開発ルール・命名規則
