# Issue #6: フロントエンド基盤（Vite + React）

### 背景 / 目的
Vite + React + TypeScript環境を構築し、アプリケーションの基本レイアウト（Header/Footer/MainLayout）を作成する。ダークモードUIの土台を整える。

- 依存: #1
- ラベル: `frontend`, `setup`

### スコープ / 作業項目
- [ ] Vite + React + TypeScriptプロジェクト初期化（#1で作成済みの場合はスキップ）
- [ ] Tailwind CSS設定
  - `tailwind.config.js`作成
  - カスタムカラー定義（`docs/05_sitemap.md`参照）
- [ ] 基本コンポーネント作成
  - `src/components/Header.tsx`
  - `src/components/Footer.tsx`
  - `src/components/MainLayout.tsx`
- [ ] `src/App.tsx`で基本レイアウト組み立て
- [ ] グローバルスタイル設定（背景色#1a1a2e）

### ゴール / 完了条件（Acceptance Criteria）
- [ ] `npm run dev`で開発サーバーが起動する
- [ ] Header/Footer/MainLayoutコンポーネントが表示される
- [ ] Tailwind CSSが適用されている
- [ ] ダークモードの背景色`#1a1a2e`が適用されている

### テスト観点
- 手動確認: ブラウザでhttp://localhost:5173にアクセス
- 検証方法: Header/Footerが表示され、背景がダークネイビー

### 参考ドキュメント
- `docs/05_sitemap.md` - カラースキーム、レイアウト方針
- `docs/02_architecture.md` - フロントエンド責務
- `CLAUDE.md` - コンポーネント命名規則
