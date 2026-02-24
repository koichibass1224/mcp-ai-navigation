# 06. デザインシステム

## MCP × Google Maps AIナビ PoC

Apple Human Interface Guidelines (HIG) を参考にした、Tailwind CSS実装前提のデザインシステム。

---

## 1. 設計思想

### 1.1 コンセプト

**「通常ナビ」と「AIナビ」の違いを直感的に理解できるUI**

- 通常モード: シンプル、機能的
- AIモード: インテリジェント、判断過程が可視化

### 1.2 Apple HIG 準拠ポイント

- **Clarity**: コンテンツが主役、UIは透明に
- **Deference**: システムが邪魔しない
- **Depth**: 階層を視覚的に伝える
- **Direct Manipulation**: 直接操作の感覚

---

## 2. カラーシステム

### 2.1 ダークモード基調（ナビ風）

| 用途 | 色名 | HEX | Tailwind |
|------|------|-----|----------|
| 背景（最深） | Background | `#000000` | `bg-black` |
| 背景（サーフェス） | Surface | `#1c1c1e` | `bg-[#1c1c1e]` |
| 背景（エレベート） | Elevated | `#2c2c2e` | `bg-[#2c2c2e]` |
| 区切り線 | Separator | `#38383a` | `border-[#38383a]` |
| テキスト（Primary） | Label | `#ffffff` | `text-white` |
| テキスト（Secondary） | Secondary Label | `#ebebf5` | `text-[#ebebf599]` |
| テキスト（Tertiary） | Tertiary Label | `#ebebf5` | `text-[#ebebf54d]` |

### 2.2 アクセントカラー

| 用途 | 色名 | HEX | Tailwind |
|------|------|-----|----------|
| プライマリアクション | Blue | `#0a84ff` | `bg-[#0a84ff]` |
| 成功/出発地 | Green | `#30d158` | `text-[#30d158]` |
| 警告 | Orange | `#ff9f0a` | `text-[#ff9f0a]` |
| エラー/目的地 | Red | `#ff453a` | `text-[#ff453a]` |
| AIモード | Purple | `#bf5af2` | `text-[#bf5af2]` |
| ルート線 | Cyan | `#64d2ff` | `text-[#64d2ff]` |

### 2.3 Tailwind カスタム設定

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        surface: '#1c1c1e',
        elevated: '#2c2c2e',
        separator: '#38383a',
        'label-secondary': 'rgba(235, 235, 245, 0.6)',
        'label-tertiary': 'rgba(235, 235, 245, 0.3)',
        'apple-blue': '#0a84ff',
        'apple-green': '#30d158',
        'apple-orange': '#ff9f0a',
        'apple-red': '#ff453a',
        'apple-purple': '#bf5af2',
        'apple-cyan': '#64d2ff',
      },
    },
  },
}
```

---

## 3. タイポグラフィ

### 3.1 フォントファミリー

```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
```

Tailwind: `font-sans`（デフォルトでシステムフォント）

### 3.2 フォントスケール

| 用途 | サイズ | ウェイト | Tailwind |
|------|--------|----------|----------|
| Large Title | 34px | Bold | `text-4xl font-bold` |
| Title 1 | 28px | Bold | `text-3xl font-bold` |
| Title 2 | 22px | Bold | `text-2xl font-bold` |
| Title 3 | 20px | Semibold | `text-xl font-semibold` |
| Headline | 17px | Semibold | `text-base font-semibold` |
| Body | 17px | Regular | `text-base` |
| Callout | 16px | Regular | `text-base` |
| Subheadline | 15px | Regular | `text-sm` |
| Footnote | 13px | Regular | `text-xs` |
| Caption 1 | 12px | Regular | `text-xs` |
| Caption 2 | 11px | Regular | `text-[11px]` |

### 3.3 レターカラー組み合わせ

```html
<!-- Primary -->
<p class="text-white">メインテキスト</p>

<!-- Secondary -->
<p class="text-white/60">補助テキスト</p>

<!-- Tertiary -->
<p class="text-white/30">ヒント・プレースホルダー</p>
```

---

## 4. 余白・間隔

### 4.1 スペーシングスケール（8pt基調）

| 名前 | 値 | Tailwind | 用途 |
|------|-----|----------|------|
| 4xs | 2px | `p-0.5` | 最小間隔 |
| 3xs | 4px | `p-1` | インライン要素間 |
| 2xs | 8px | `p-2` | 密接な要素間 |
| xs | 12px | `p-3` | 小コンポーネント内 |
| sm | 16px | `p-4` | 標準コンポーネント内 |
| md | 20px | `p-5` | セクション内 |
| lg | 24px | `p-6` | カード内 |
| xl | 32px | `p-8` | セクション間 |
| 2xl | 40px | `p-10` | 大セクション間 |
| 3xl | 48px | `p-12` | ページ余白 |

### 4.2 コンポーネント間隔の指針

```html
<!-- カード内パディング -->
<div class="p-4">...</div>

<!-- フォーム要素間 -->
<div class="space-y-4">...</div>

<!-- セクション間 -->
<div class="space-y-6">...</div>

<!-- サイドパネル内 -->
<div class="p-4 space-y-4">...</div>
```

---

## 5. 角丸

### 5.1 角丸スケール

| 名前 | 値 | Tailwind | 用途 |
|------|-----|----------|------|
| none | 0px | `rounded-none` | 地図、フルブリード |
| sm | 4px | `rounded` | 小ボタン、タグ |
| md | 8px | `rounded-lg` | カード、入力欄 |
| lg | 12px | `rounded-xl` | モーダル、大カード |
| xl | 16px | `rounded-2xl` | シート、オーバーレイ |
| full | 9999px | `rounded-full` | アイコンボタン、バッジ |

### 5.2 コンポーネント別指針

```html
<!-- 入力欄 -->
<input class="rounded-lg" />

<!-- ボタン -->
<button class="rounded-lg">標準</button>
<button class="rounded-full">アイコン</button>

<!-- カード -->
<div class="rounded-xl">...</div>

<!-- モード切り替えトグル -->
<div class="rounded-full">...</div>
```

---

## 6. 影の効果

### 6.1 エレベーションシステム

| レベル | 用途 | Tailwind |
|--------|------|----------|
| 0 | 埋め込み要素 | なし |
| 1 | カード、入力 | `shadow-sm` |
| 2 | ドロップダウン | `shadow-md` |
| 3 | モーダル | `shadow-lg` |
| 4 | ポップオーバー | `shadow-xl` |

### 6.2 ダークモード用カスタム影

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'dark-sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 6px rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 10px 15px rgba(0, 0, 0, 0.5)',
        'dark-xl': '0 20px 25px rgba(0, 0, 0, 0.5)',
        'glow-blue': '0 0 20px rgba(10, 132, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(191, 90, 242, 0.3)',
      },
    },
  },
}
```

### 6.3 使用例

```html
<!-- 通常カード -->
<div class="bg-elevated rounded-xl shadow-dark-md">...</div>

<!-- AIモードアクティブ -->
<div class="bg-elevated rounded-xl shadow-glow-purple">...</div>
```

---

## 7. コンポーネント設計

### 7.1 ボタン

#### プライマリボタン
```html
<button class="
  w-full py-3 px-4
  bg-apple-blue hover:bg-apple-blue/90
  text-white font-semibold
  rounded-xl
  transition-colors
  disabled:opacity-50 disabled:cursor-not-allowed
">
  ルート検索
</button>
```

#### セカンダリボタン
```html
<button class="
  py-2 px-4
  bg-elevated hover:bg-separator
  text-white font-medium
  rounded-lg
  transition-colors
">
  キャンセル
</button>
```

#### アイコンボタン
```html
<button class="
  p-2
  bg-elevated hover:bg-separator
  text-white
  rounded-full
  transition-colors
">
  <IconComponent class="w-5 h-5" />
</button>
```

### 7.2 入力フィールド

```html
<div class="space-y-1">
  <label class="text-sm text-white/60">出発地</label>
  <input
    type="text"
    placeholder="例: 東京駅"
    class="
      w-full py-3 px-4
      bg-elevated
      border border-separator
      rounded-xl
      text-white placeholder-white/30
      focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue
      transition-colors
    "
  />
</div>
```

### 7.3 カード

```html
<div class="
  p-4
  bg-elevated
  rounded-xl
  border border-separator
">
  <h3 class="text-base font-semibold text-white mb-2">タイトル</h3>
  <p class="text-sm text-white/60">説明文</p>
</div>
```

### 7.4 セグメントコントロール（モード切り替え）

```html
<div class="
  inline-flex
  p-1
  bg-surface
  rounded-full
">
  <button class="
    py-2 px-4
    rounded-full
    text-sm font-medium
    transition-colors
    bg-elevated text-white
  ">
    通常モード
  </button>
  <button class="
    py-2 px-4
    rounded-full
    text-sm font-medium
    transition-colors
    text-white/60 hover:text-white
  ">
    AIモード
  </button>
</div>
```

### 7.5 結果カード

```html
<!-- 通常モード結果 -->
<div class="p-4 bg-elevated rounded-xl border border-separator">
  <div class="flex items-center gap-2 mb-2">
    <span class="text-apple-cyan">●</span>
    <span class="text-sm text-white/60">通常ルート</span>
  </div>
  <p class="text-lg font-semibold text-white">首都高速経由</p>
  <p class="text-apple-cyan">15.2 km / 約25分</p>
</div>

<!-- AIモード結果 -->
<div class="p-4 bg-elevated rounded-xl border border-apple-purple/50 shadow-glow-purple">
  <div class="flex items-center gap-2 mb-2">
    <span class="text-apple-purple">✦</span>
    <span class="text-sm text-apple-purple">AI推奨ルート</span>
  </div>
  <p class="text-lg font-semibold text-white">一般道経由</p>
  <p class="text-apple-cyan">18.5 km / 約30分</p>
  <p class="text-sm text-white/60 mt-2">
    理由: 現在首都高で渋滞が発生しているため、一般道を推奨
  </p>
</div>
```

### 7.6 AI判断ログ

```html
<div class="p-4 bg-apple-purple/10 rounded-xl border border-apple-purple/30">
  <div class="flex items-center gap-2 mb-3">
    <span class="text-apple-purple">🤖</span>
    <span class="text-sm font-medium text-apple-purple">AI判断ログ</span>
  </div>
  <div class="space-y-2 text-sm">
    <div class="flex items-start gap-2">
      <span class="text-white/40">1.</span>
      <span class="text-white/80">「渋滞を避けて」を検出</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-white/40">2.</span>
      <span class="text-white/80">departure_time=now を設定</span>
    </div>
    <div class="flex items-start gap-2">
      <span class="text-white/40">3.</span>
      <span class="text-white/80">route_search ツールを実行</span>
    </div>
  </div>
</div>
```

---

## 8. アクセシビリティ配慮

### 8.1 コントラスト比

| 組み合わせ | 比率 | 判定 |
|------------|------|------|
| 白 on #1c1c1e | 12.6:1 | ✅ AAA |
| 白/60 on #1c1c1e | 7.5:1 | ✅ AAA |
| #0a84ff on #1c1c1e | 5.2:1 | ✅ AA |
| #bf5af2 on #1c1c1e | 4.8:1 | ✅ AA |

### 8.2 フォーカスインジケーター

```html
<button class="
  focus:outline-none
  focus:ring-2 focus:ring-apple-blue focus:ring-offset-2 focus:ring-offset-surface
">
  ボタン
</button>
```

### 8.3 タッチターゲット

最小サイズ: 44×44px

```html
<!-- 最小タッチターゲット -->
<button class="min-w-[44px] min-h-[44px]">...</button>
```

### 8.4 スクリーンリーダー対応

```html
<!-- 視覚的に隠すがスクリーンリーダーには読ませる -->
<span class="sr-only">AIモードが有効です</span>

<!-- アイコンボタンのラベル -->
<button aria-label="位置情報を取得">
  <LocationIcon />
</button>

<!-- ライブリージョン（結果更新時） -->
<div aria-live="polite" aria-atomic="true">
  ルートが更新されました
</div>
```

### 8.5 モーション配慮

```html
<!-- 動きを減らす設定に対応 -->
<div class="transition-colors motion-reduce:transition-none">
  ...
</div>
```

---

## 9. レイアウト構成

### 9.1 メインレイアウト

```
┌──────────────────────────────────────────────────────────┐
│ Header (h-14)                                            │
├────────────────────────────────────┬─────────────────────┤
│                                    │                     │
│                                    │  Side Panel         │
│         Map Area                   │  (w-[360px])        │
│         (flex-1)                   │                     │
│                                    │  - Mode Toggle      │
│                                    │  - Input Form       │
│                                    │  - Results          │
│                                    │  - AI Log           │
│                                    │                     │
├────────────────────────────────────┴─────────────────────┤
│ Footer (h-10)                                            │
└──────────────────────────────────────────────────────────┘
```

### 9.2 サイドパネル幅

- Desktop: `w-[360px]` (固定)
- Tablet: `w-[320px]`
- Mobile: フルスクリーンシート

---

## 10. 状態管理

### 10.1 ローディング

```html
<button disabled class="opacity-50 cursor-not-allowed">
  <span class="animate-spin mr-2">⟳</span>
  検索中...
</button>
```

### 10.2 エラー

```html
<div class="p-4 bg-apple-red/10 border border-apple-red/30 rounded-xl">
  <p class="text-apple-red">エラーが発生しました</p>
</div>
```

### 10.3 空状態

```html
<div class="text-center py-8">
  <p class="text-white/40">出発地と目的地を入力してください</p>
</div>
```

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2024-XX-XX | 初版作成 |
