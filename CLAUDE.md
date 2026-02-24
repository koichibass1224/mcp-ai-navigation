# CLAUDE.md - MCP × Google Maps AIナビ PoC

このファイルはClaude Codeがプロジェクトを理解し、開発を支援するためのルール・設定をまとめたものです。

---

## 基本設定

### 言語設定

- **回答は日本語で行うこと**
- コード内のコメントも日本語OK（ただし最小限に）
- 変数名・関数名は英語で統一

### 行動原則

- **ユーザーが明示的に要求していない変更は行わない**
- **コミットはユーザーが明示的に要求した場合のみ実行**
- 既存のコードスタイル・パターンに従う
- 冗長なコードを避け、シンプルさを優先する

---

## コミットメッセージ規約

### フォーマット

```
<type>: <subject>

<body>（任意）
```

### Type一覧

| Type | 用途 |
|---|---|
| `feat` | 新機能追加 |
| `fix` | バグ修正 |
| `refactor` | リファクタリング（機能変更なし） |
| `style` | コードスタイル変更（フォーマット等） |
| `docs` | ドキュメント変更 |
| `test` | テスト追加・修正 |
| `chore` | ビルド・設定等の雑務 |

### 例

```
feat: ルート検索機能を実装

- route_search MCPツールを追加
- Directions APIとの連携を実装
```

```
fix: polylineデコード時のエラーを修正
```

### ルール

- subjectは日本語OK、50文字以内
- 命令形で記述（「追加した」ではなく「追加」）
- bodyは変更理由や詳細を必要に応じて記載

---

## コーディング規約

### 一般

- 既存のコードスタイルに従う
- 不要なコメントは追加しない（ユーザーが明示的に要求した場合を除く）
- 冗長なコード・過度な抽象化を避ける
- マジックナンバーは定数化する

### TypeScript

- **型定義は必須**（`any`型の使用は避ける）
- `strict: true`を前提とする
- 型推論が効く場合は明示的な型注釈を省略可
- `interface`と`type`は用途に応じて使い分け（オブジェクト型は`interface`推奨）

```typescript
// Good
interface RouteData {
  polyline: LatLng[];
  distance: Distance;
  duration: Duration;
}

// Avoid
const data: any = fetchRoute();
```

### React

- **関数コンポーネントで記述**（クラスコンポーネントは使用しない）
- **Hooksの命名規則に従う**（`useXxx`）
- **Propsの型定義は必ず行う**
- 状態管理は`useState` + propsドリルダウン（Redux不使用）

```typescript
// Good
interface InputFormProps {
  origin: string;
  destination: string;
  onSubmit: (data: FormData) => void;
}

const InputForm: React.FC<InputFormProps> = ({ origin, destination, onSubmit }) => {
  // ...
};

// Avoid
const InputForm = (props: any) => { ... };
```

### スタイリング

- **Tailwind CSSのユーティリティクラスを使用**
- カスタムCSSは原則として書かない
- レスポンシブデザインを考慮（mobile-first）
- カラーはUI/UXガイドラインのカラースキームに準拠

```tsx
// Good
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  検索
</button>

// Avoid
<button style={{ backgroundColor: 'blue', color: 'white' }}>検索</button>
```

---

## ファイル管理

- **新規ファイルの作成は最小限に抑える**
- **既存ファイルの編集を優先**
- ドキュメントファイル（`*.md`）は明示的に要求された場合のみ作成
- 1ファイル1コンポーネント原則

### 命名規則

| 種類 | 命名規則 | 例 |
|---|---|---|
| コンポーネント | PascalCase | `MapView.tsx` |
| カスタムフック | camelCase（use接頭辞） | `useRouteSearch.ts` |
| ユーティリティ | camelCase | `decodePolyline.ts` |
| 型定義ファイル | PascalCase または `types.ts` | `RouteData.ts` |
| 定数ファイル | camelCase | `constants.ts` |

---

## セキュリティ

- **APIキーや認証情報をコードに直接記述しない**
- **環境変数（`.env`）を使用する**
- `.env`ファイルは`.gitignore`に含める
- フロントエンドには`VITE_`接頭辞の環境変数のみ公開

```typescript
// Good
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// NG
const apiKey = "AIzaSyXXXXXXXXXX";
```

---

## パフォーマンス

- **不要なre-renderを避ける**
- `React.memo`、`useMemo`、`useCallback`を適切に使用
- 重い計算処理はメモ化を検討
- コンポーネントの分割粒度を適切に保つ

```typescript
// 重い計算のメモ化
const decodedPolyline = useMemo(
  () => decodePolyline(encodedPolyline),
  [encodedPolyline]
);

// コールバックのメモ化
const handleSubmit = useCallback((data: FormData) => {
  // ...
}, [dependency]);
```

---

## エラーハンドリング

- `try-catch`を適切に使用
- ユーザーフレンドリーなエラーメッセージを表示
- API通信エラーは適切にハンドリング
- エラー状態はUIに反映する

```typescript
try {
  const result = await fetchRoute(params);
  setRoute(result);
} catch (error) {
  setError("ルートの取得に失敗しました。再度お試しください。");
  console.error("Route fetch error:", error);
}
```

---

## プロジェクト固有の制約

- **Google Maps UIコンポーネント（InfoWindow, SearchBox等）は使用しない** → Leaflet + OpenStreetMapのみ
- **オフライン対応不要**
- **認証・ユーザー管理不要**
- **データベース不要**（ステートレス設計）
- **React Router不使用**（SPA単一画面）
- これはPoCであり、本番品質は求めない
- 挙動と思想が伝わることを優先

---

## 技術スタック

| レイヤー | 技術 | バージョン目安 |
|---|---|---|
| フロントエンド | React + Vite + TypeScript | React 18, Vite 5, TS 5 |
| 地図ライブラリ | Leaflet + react-leaflet + OpenStreetMap | Leaflet 1.9, react-leaflet 4 |
| スタイリング | Tailwind CSS | v3 |
| バックエンド | Node.js + Express + TypeScript | Express 4 |
| MCPサーバー | @modelcontextprotocol/sdk（インプロセス） | latest |
| AI | Claude Sonnet API (@anthropic-ai/sdk) | claude-sonnet-4-20250514 |
| 外部API | Google Maps (Directions/Distance Matrix/Geocoding) | - |
| デプロイ | Vercel (フロント) + Railway (バックエンド) | - |

---

## ディレクトリ構造

```
map_mcp/
├── CLAUDE.md                 # このファイル
├── docs/                     # 設計書（参照用）
│   ├── 01_requirements.md    # 要件定義
│   ├── 02_architecture.md    # アーキテクチャ設計
│   ├── 03_database.md        # データベース設計
│   ├── 04_api.md             # API設計
│   └── 05_sitemap.md         # サイトマップ
├── frontend/                 # React + Vite アプリ
│   └── src/
│       ├── components/       # UIコンポーネント
│       ├── types/            # 型定義
│       ├── hooks/            # カスタムフック
│       └── utils/            # ユーティリティ
├── backend/                  # Node.js + Express + MCPサーバー
│   └── src/
│       ├── routes/           # APIエンドポイント
│       ├── mcp/              # MCPサーバー・ツール
│       ├── services/         # 外部API連携
│       └── types/            # 型定義
└── .env.example              # 環境変数テンプレート
```

---

## UI/UXガイドライン

### カラースキーム（ダークモード）

| 要素 | 色コード | Tailwind |
|---|---|---|
| 背景 | `#1a1a2e` | `bg-[#1a1a2e]` |
| パネル背景 | `#16213e` | `bg-[#16213e]` |
| テキスト | `#e0e0e0` | `text-[#e0e0e0]` |
| ルート線 | `#00d4ff` | `text-cyan-400` |
| マーカー（出発） | `#4ade80` | `text-green-400` |
| マーカー（目的地） | `#f87171` | `text-red-400` |
| ボタン | `#3b82f6` | `bg-blue-500` |
| AI判断ログ | `#8b5cf6` | `text-purple-500` |

### レイアウト

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

```bash
# フロントエンド
cd frontend
npm install
npm run dev       # 開発サーバー起動

# バックエンド
cd backend
npm install
npm run dev       # 開発サーバー起動
```

---

## 参照ドキュメント

詳細な設計情報は`docs/`配下を参照:

- `docs/01_requirements.md` - 要件定義・ユーザーフロー
- `docs/02_architecture.md` - アーキテクチャ・通信フロー
- `docs/03_database.md` - データベース設計（不使用の判断根拠）
- `docs/04_api.md` - API仕様・MCPツール定義
- `docs/05_sitemap.md` - 画面構成・コンポーネント構造
