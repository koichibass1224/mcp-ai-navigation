# STATUS.md - 開発進捗まとめ

> **最終更新**: 2024-02-24
> **現在のPhase**: Phase 2（Core機能実装中）

---

## 1. クイックサマリー

| 項目 | 状態 |
|---|---|
| **現在の進捗** | Phase 1完了、Phase 2実装中 |
| **完了済みIssue** | #1〜#7（7/17） |
| **次のタスク** | Issue #8: Leaflet地図表示 |
| **ブロッカー** | なし |

### 直近のマイルストーン
- [x] 要件定義・設計ドキュメント作成
- [x] CLAUDE.md（開発ルール）作成
- [x] 実装計画・Issue作成（17件）
- [x] **Phase 1: Walking Skeleton**（#1〜#7）✅ 完了
- [ ] **Phase 2: Core機能**（#8〜#12）← 次はここ
- [ ] Phase 3: AI判断可視化（#13〜#14）
- [ ] Phase 4: 堅牢化・デプロイ（#15〜#17）

---

## 2. ドキュメント構成

### 必読ファイル（優先度順）

| ファイル | 内容 | 読む場面 |
|---|---|---|
| `STATUS.md` | このファイル。進捗・次タスク確認 | **最初に読む** |
| `CLAUDE.md` | 開発ルール・コーディング規約 | コード書く前 |
| `docs/implementation_plan.md` | 実装計画・Issue一覧・依存関係 | タスク確認時 |
| `docs/01_requirements.md` | 要件定義・MVP機能 | 機能仕様確認時 |
| `docs/02_architecture.md` | アーキテクチャ・通信フロー | 設計確認時 |
| `docs/04_api.md` | API仕様・MCPツール定義 | API実装時 |
| `docs/05_sitemap.md` | 画面構成・カラースキーム | UI実装時 |

### ディレクトリ構造

```
map_mcp/
├── STATUS.md              ← このファイル
├── CLAUDE.md              ← 開発ルール
├── docs/
│   ├── 01_requirements.md
│   ├── 02_architecture.md
│   ├── 04_api.md
│   ├── 05_sitemap.md
│   ├── implementation_plan.md
│   └── issues/            ← Issue詳細（17件）
├── frontend/              ← React + Vite + Tailwind
│   └── src/
│       ├── components/    ← Header, Footer, MainLayout
│       ├── utils/         ← api.ts
│       └── App.tsx
├── backend/               ← Express + MCP + Claude
│   └── src/
│       ├── mcp/           ← server.ts, tools/routeSearch.ts
│       ├── services/      ← claude.ts, googleMaps.ts
│       └── index.ts
└── .env.example
```

---

## 3. 完了済みIssue

| Issue | タイトル | 完了日 |
|---|---|---|
| #1 | プロジェクト初期セットアップ | 2024-02-24 |
| #2 | バックエンド基盤 + /api/health | 2024-02-24 |
| #3 | MCPサーバー基盤構築 | 2024-02-24 |
| #4 | Claude API連携基盤 | 2024-02-24 |
| #5 | route_search MCPツール実装 | 2024-02-24 |
| #6 | フロントエンド基盤（Vite + React） | 2024-02-24 |
| #7 | フロント⇔バックエンド疎通確認 | 2024-02-24 |

---

## 4. 次に取り組むべきIssue

### Phase 2: Core機能

```
#8（地図表示）→ #11（ルート描画）
#9（入力フォーム）→ #10（/api/navigate）→ #12（結果パネル）
```

### 次のIssue詳細

**Issue #8: Leaflet地図表示**
- 場所: `docs/issues/8-leaflet-map-display.md`
- 作業: react-leaflet + OpenStreetMap地図表示
- 依存: #6

**Issue #9: 入力フォーム**
- 場所: `docs/issues/9-input-form.md`
- 作業: 出発地/目的地/条件入力フォーム

---

## 5. Phase別進捗状況

| Phase | 説明 | Issue範囲 | 進捗 |
|---|---|---|---|
| **Phase 1** | Walking Skeleton | #1〜#7 | ✅ 7/7 (100%) |
| **Phase 2** | Core機能 | #8〜#12 | 0/5 (0%) |
| **Phase 3** | AI判断可視化 | #13〜#14 | 0/2 (0%) |
| **Phase 4** | 堅牢化・デプロイ | #15〜#17 | 0/3 (0%) |
| **合計** | - | #1〜#17 | **7/17 (41%)** |

---

## 6. 実装済みコード一覧

### バックエンド (`backend/src/`)

| ファイル | 内容 |
|---|---|
| `index.ts` | Expressサーバー、/api/health |
| `mcp/server.ts` | MCPサーバー基盤 |
| `mcp/tools/routeSearch.ts` | route_search MCPツール |
| `services/claude.ts` | Claude API連携 |
| `services/googleMaps.ts` | Google Maps API連携 |

### フロントエンド (`frontend/src/`)

| ファイル | 内容 |
|---|---|
| `App.tsx` | メインコンポーネント、ヘルスチェック |
| `components/Header.tsx` | ヘッダー |
| `components/Footer.tsx` | フッター |
| `components/MainLayout.tsx` | 70%/30%レイアウト |
| `utils/api.ts` | API呼び出しユーティリティ |

### 確認方法

```bash
# バックエンド起動
cd backend && npm run dev

# フロントエンド起動
cd frontend && npm run dev

# ヘルスチェック
curl http://localhost:3001/api/health
# => {"status":"ok","services":{"mcp":"running","tools":["route_search"]}}
```

---

## 7. 開発再開時のチェックリスト

### 環境確認

- [x] Node.js v18以上がインストールされている
- [ ] APIキーが`backend/.env`に設定されている
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `GOOGLE_MAPS_API_KEY`

### 起動手順

```bash
# 1. バックエンド起動
cd backend && npm run dev

# 2. フロントエンド起動（別ターミナル）
cd frontend && npm run dev

# 3. ブラウザでアクセス
# http://localhost:5173
```

---

## 8. 既知の問題・TODO

### 要確認事項

| # | 項目 | ステータス |
|---|---|---|
| 1 | Claude APIモデル確定 | claude-sonnet-4-20250514で実装済み |
| 2 | Google Maps APIクォータ | 未確認 |
| 3 | geocode/distance_compareツール | MVPでは未実装 |
| 4 | 会話履歴 | 基盤は実装済み |
| 5 | Vercel/Railwayアカウント | 未確認 |

### その他TODO

- [x] `.env.example`作成
- [ ] README.md作成（Issue #17で対応）
- [ ] `backend/.env`にAPIキー設定

---

## 更新履歴

| 日付 | 更新内容 |
|---|---|
| 2024-02-24 | 初版作成 |
| 2024-02-24 | Phase 1完了（#1〜#7実装完了） |
