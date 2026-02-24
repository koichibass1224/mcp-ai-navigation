# CLAUDE.md - MCP × Google Maps AIナビ PoC

このファイルはClaude Codeがプロジェクトを理解し、開発を支援するためのルール・設定をまとめたものです。

---

## プロジェクト概要

MCP（Model Context Protocol）を用いた「実行AI型ナビゲーション」の思想検証PoCをWebブラウザアプリとして構築するプロジェクト。

### 核心思想

- **AIがその場で判断する**: ルート探索ロジックをコードに固定実装せず、Claudeが自然文条件を解釈してAPI呼び出しを自律的に決定
- **MCPの接続標準化の価値**: ツール追加時にFunction Calling定義の書き直し不要
- **実車ナビの"頭脳"が同一構造で動く**: Web/組み込みに関わらず、Claude ↔ MCP ↔ API の構造は不変

---

## 技術スタック

| レイヤー | 技術 | バージョン目安 |
|---|---|---|
| フロントエンド | React + Vite + TypeScript | React 18, Vite 5, TS 5 |
| 地図ライブラリ | Leaflet + react-leaflet + OpenStreetMap | Leaflet 1.9, react-leaflet 4 |
| バックエンド | Node.js + Express + TypeScript | Express 4 |
| MCPサーバー | @modelcontextprotocol/sdk（インプロセス） | latest |
| AI | Claude Sonnet API (@anthropic-ai/sdk) | claude-sonnet-4-20250514 |
| 外部API | Google Maps (Directions/Distance Matrix/Geocoding) | - |
| デプロイ | Vercel (フロント) + Railway (バックエンド) | - |

---

## ディレクトリ構造（推奨）

```
map_mcp/
├── CLAUDE.md                 # このファイル
├── docs/                     # ドキュメント（要件定義、設計書）
├── frontend/                 # React + Vite アプリ
│   ├── src/
│   │   ├── components/       # UIコンポーネント
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MapView/
│   │   │   │   ├── LeafletMap.tsx
│   │   │   │   ├── RouteLayer.tsx
│   │   │   │   └── MarkerLayer.tsx
│   │   │   ├── SidePanel/
│   │   │   │   ├── InputForm.tsx
│   │   │   │   ├── LocationInput.tsx
│   │   │   │   ├── MessageInput.tsx
│   │   │   │   ├── SearchButton.tsx
│   │   │   │   ├── ResultPanel.tsx
│   │   │   │   └── ReasoningLog.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── types/            # TypeScript型定義
│   │   ├── hooks/            # カスタムフック
│   │   ├── utils/            # ユーティリティ関数
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/                  # Node.js + Express + MCPサーバー
│   ├── src/
│   │   ├── index.ts          # エントリーポイント
│   │   ├── routes/
│   │   │   └── navigate.ts   # /api/navigate エンドポイント
│   │   ├── mcp/
│   │   │   ├── server.ts     # MCPサーバー実装
│   │   │   └── tools/        # MCPツール定義
│   │   │       ├── routeSearch.ts
│   │   │       ├── distanceCompare.ts
│   │   │       └── geocode.ts
│   │   ├── services/
│   │   │   ├── claude.ts     # Claude API連携
│   │   │   └── googleMaps.ts # Google Maps API連携
│   │   └── types/
│   ├── package.json
│   └── tsconfig.json
└── .env.example              # 環境変数テンプレート
```

---

## 開発ルール

### コーディング規約

1. **言語**: TypeScript必須（strict mode）
2. **コンポーネント**: 関数コンポーネント + Hooks
3. **状態管理**: useState + propsドリルダウン（Redux不使用）
4. **スタイリング**: CSS Modules または Tailwind CSS
5. **コメント**: 日本語OK、ただし過度なコメントは避ける

### ファイル命名規則

- コンポーネント: PascalCase（例: `MapView.tsx`）
- ユーティリティ: camelCase（例: `decodePolyline.ts`）
- 型定義: PascalCase（例: `RouteData.ts`）

### 重要な制約

- **Google Maps UIコンポーネント（InfoWindow, SearchBox等）は使用しない** → Leaflet + OpenStreetMapのみ
- **オフライン対応不要**
- **認証・ユーザー管理不要**
- **データベース不要**（ステートレス設計）
- **React Router不使用**（SPA単一画面）

---

## API仕様概要

### Backend REST API

| メソッド | パス | 説明 |
|---|---|---|
| POST | `/api/navigate` | ナビゲーションリクエスト（メイン） |
| GET | `/api/health` | ヘルスチェック |

### MCPツール

| ツール名 | Google API | 用途 |
|---|---|---|
| route_search | Directions API | ルート検索・polyline取得 |
| distance_compare | Distance Matrix API | 複数地点間の距離・時間比較 |
| geocode | Geocoding API | 地名→緯度経度変換 |

---

## UI/UXガイドライン

### カラースキーム（ダークモード）

| 要素 | 色コード |
|---|---|
| 背景 | `#1a1a2e` |
| パネル背景 | `#16213e` |
| テキスト | `#e0e0e0` |
| ルート線 | `#00d4ff`（シアン） |
| マーカー（出発） | `#4ade80`（グリーン） |
| マーカー（目的地） | `#f87171`（レッド） |
| ボタン | `#3b82f6`（ブルー） |
| AI判断ログ | `#8b5cf6`（パープル） |

### レイアウト方針

- 左: 地図（70%）/ 右: パネル（30%）
- 地図が画面の主役
- ナビ風の暗めUIを意識

---

## 環境変数

```env
# Claude API
ANTHROPIC_API_KEY=sk-ant-xxx

# Google Maps API
GOOGLE_MAPS_API_KEY=AIzaxxx

# Server
PORT=3001
NODE_ENV=development

# Frontend (Vite)
VITE_API_BASE_URL=http://localhost:3001
```

---

## 開発コマンド

### フロントエンド

```bash
cd frontend
npm install
npm run dev       # 開発サーバー起動（Vite）
npm run build     # 本番ビルド
npm run preview   # ビルド結果プレビュー
```

### バックエンド

```bash
cd backend
npm install
npm run dev       # 開発サーバー起動（tsx watch）
npm run build     # TypeScriptコンパイル
npm start         # 本番起動
```

---

## PoC成功基準（チェックリスト）

- [ ] 自然文入力の違いによって、異なるルート結果が返ること
- [ ] Claudeがルート条件をコードに固定実装せず解釈していること
- [ ] MCP経由でGoogle Maps APIが正しく呼ばれること
- [ ] 自社ナビ風UIにルート・距離・時間が描画されること
- [ ] Claudeの判断過程（ツール選択理由）が可視化されていること

---

## 注意事項

- これはPoCであり、本番品質は求めない
- 挙動と思想が伝わることを優先
- 過度な最適化・抽象化は避ける
- エラーハンドリングは最低限でOK
