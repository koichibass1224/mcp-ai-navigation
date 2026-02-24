# Issue #11: ルート描画（RouteLayer）

### 背景 / 目的
バックエンドから取得したpolylineを地図上に描画するコンポーネントを実装する。出発地・目的地マーカーも表示し、ルート全体がビューに収まるようにする。

- 依存: #8, #10
- ラベル: `frontend`, `map`

### スコープ / 作業項目
- [ ] コンポーネント作成
  - `src/components/MapView/RouteLayer.tsx`
    - Polylineコンポーネントでルート線を描画
    - 色: シアン（#00d4ff）、太さ: 4px
  - `src/components/MapView/MarkerLayer.tsx`
    - 出発地マーカー（緑 #4ade80）
    - 目的地マーカー（赤 #f87171）
- [ ] polyline座標をpropsで受け取る
- [ ] fitBounds実装
  - ルート全体が画面に収まるようビュー調整
- [ ] App.tsxに状態追加
  - `route: RouteData | null`
- [ ] 型定義
  - `src/types/RouteData.ts`

### ゴール / 完了条件（Acceptance Criteria）
- [ ] polyline座標配列を受け取り地図上に線を描画する
- [ ] ルート線の色がシアン（#00d4ff）で表示される
- [ ] 出発地マーカー（緑）が表示される
- [ ] 目的地マーカー（赤）が表示される
- [ ] ルート全体が画面に収まるようfitBoundsが適用される

### テスト観点
- 手動確認: ルート検索後に地図上に線が描画される
- 手動確認: マーカーが正しい位置に表示される
- 検証方法: 東京駅→横浜駅でルートが視認できる

### 参考ドキュメント
- `docs/05_sitemap.md` - カラースキーム（ルート線、マーカー色）
- `docs/01_requirements.md` - F-04 ルート描画
- `docs/04_api.md` - route.polyline形式
