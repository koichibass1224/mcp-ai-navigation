# Issue #8: Leaflet地図表示

### 背景 / 目的
react-leaflet + OpenStreetMapによる地図コンポーネントを実装する。ナビアプリのコア表示要素であり、ルート描画の土台となる。

- 依存: #6
- ラベル: `frontend`, `map`

### スコープ / 作業項目
- [ ] パッケージ追加
  - `leaflet`
  - `react-leaflet`
  - `@types/leaflet`
- [ ] Leaflet CSS読み込み設定
- [ ] コンポーネント作成
  - `src/components/MapView/LeafletMap.tsx`
    - MapContainer初期化
    - TileLayer（OpenStreetMap）設定
    - 初期中心: 東京駅（35.6812, 139.7671）
    - 初期ズーム: 12
- [ ] MainLayoutに地図を配置（左側70%）

### ゴール / 完了条件（Acceptance Criteria）
- [ ] 画面左側70%に地図が表示される
- [ ] 東京駅付近（35.68, 139.76）を初期中心として表示
- [ ] ズーム・パン操作が可能
- [ ] OpenStreetMapタイルが正しく読み込まれる
- [ ] Leaflet CSSが適用されている

### テスト観点
- 手動確認: 地図がレンダリングされる
- 手動確認: ドラッグ・ズームが動作する
- 検証方法: ブラウザでタイル読み込みを確認

### 参考ドキュメント
- `docs/05_sitemap.md` - 画面レイアウト（左70%/右30%）
- `docs/01_requirements.md` - F-01 地図表示
