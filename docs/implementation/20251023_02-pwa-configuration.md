# Phase 2: PWA設定

**作成日**: 2025年10月23日
**Phase番号**: 2
**所要時間**: 60分
**前提条件**: Phase 1完了（Next.js + next-pwa基盤）

---

## 目次

1. [Phase概要](#phase概要)
2. [PWA技術の基礎知識](#pwa技術の基礎知識)
3. [manifest.json設定](#manifestjson設定)
4. [アイコン準備](#アイコン準備)
5. [Service Worker設定](#service-worker設定)
6. [インストールプロンプトコンポーネント](#インストールプロンプトコンポーネント)
7. [オンライン状態検知](#オンライン状態検知)
8. [動作確認](#動作確認)
9. [チェックリスト](#チェックリスト)
10. [トラブルシューティング](#トラブルシューティング)
11. [次のステップ](#次のステップ)

---

## Phase概要

### 目的

Phase 1で構築したNext.js基盤に、**PWA（Progressive Web App）機能を完全実装**します。このPhaseの完了後、アプリはホーム画面にインストール可能となり、オフラインでも基本的なリソースが利用できるようになります。

### このPhaseの位置づけ

```
Phase 1（完了） → Phase 2（現在） → Phase 3（IndexedDB）
   基盤構築          PWA機能         データ永続化
```

Phase 2はOfflistの**PWAとしての基盤**を完成させる重要なフェーズです。ここで実装するService WorkerとWeb App Manifestが、後のPhaseでオフライン動作を可能にします。

### 所要時間の内訳

| タスク | 時間 |
|--------|------|
| manifest.json作成 | 10分 |
| アイコン準備 | 15分 |
| Service Worker設定 | 10分 |
| インストールプロンプト実装 | 15分 |
| オンライン状態検知実装 | 5分 |
| 動作確認・テスト | 5分 |
| **合計** | **60分** |

---

## PWA技術の基礎知識

### PWAとは何か？

**Progressive Web App（PWA）**は、Webアプリにネイティブアプリのような機能を追加する技術の総称です。以下の3つの核心技術で構成されます。

#### 1. Service Worker

**役割**: ブラウザとサーバーの間に位置するプロキシスクリプト

```
通常のWebアプリ:
ブラウザ → サーバー → レスポンス

PWA:
ブラウザ → Service Worker → キャッシュ or サーバー → レスポンス
```

**主な機能**:
- リソースのキャッシュ管理
- オフライン時のフォールバック処理
- バックグラウンド同期
- プッシュ通知

**重要な特性**:
- JavaScriptとは別スレッドで動作
- HTTPS必須（localhost除く）
- ページのDOMには直接アクセス不可

#### 2. Web App Manifest

**役割**: アプリのメタデータ定義（名前、アイコン、テーマカラーなど）

**例**:
```json
{
  "name": "Offlist",
  "short_name": "Offlist",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" }
  ],
  "start_url": "/",
  "display": "standalone"
}
```

これにより、ブラウザが「インストール可能なアプリ」として認識します。

#### 3. HTTPS

**理由**: Service Workerは強力な機能のため、セキュアな環境でのみ動作

**開発時の例外**: `localhost`はHTTPでも動作可能

### next-pwaの役割

**next-pwa**は、Next.jsでPWAを簡単に実装するためのライブラリです。

**自動化される処理**:
- Workbox（Googleのキャッシュライブラリ）を使ったService Worker生成
- 静的リソースのプリキャッシュ
- キャッシュ戦略の最適化

**開発者がやること**:
- manifest.jsonのカスタマイズ
- アイコンの準備
- インストールプロンプトの実装（UI部分）

---

## manifest.json設定

### 設置場所

```
Offlist/
├── public/
│   └── manifest.json  ← ここに作成
```

### 完全な設定例

`public/manifest.json`を以下の内容で作成します:

```json
{
  "name": "Offlist - オフライン買い物リスト",
  "short_name": "Offlist",
  "description": "オフラインでも完璧に動作するPWA買い物リストアプリ",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4F46E5",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "categories": ["productivity", "utilities"],
  "screenshots": [],
  "shortcuts": []
}
```

### 各項目の詳細説明

#### 基本情報

| プロパティ | 説明 | Offlistでの設定値 |
|-----------|------|------------------|
| `name` | アプリの正式名称（インストール時に表示） | "Offlist - オフライン買い物リスト" |
| `short_name` | 短縮名（ホーム画面のアイコン下に表示） | "Offlist" |
| `description` | アプリの説明文 | "オフラインでも完璧に動作する..." |

#### 表示設定

| プロパティ | 説明 | 推奨値 |
|-----------|------|--------|
| `display` | 表示モード | `"standalone"` = アドレスバー非表示 |
| `orientation` | 画面向き | `"portrait"` = 縦向き固定 |

**displayモードの種類**:
- `fullscreen`: 全画面（ステータスバーも非表示）
- `standalone`: アプリ風（推奨）
- `minimal-ui`: 最小限のブラウザUI
- `browser`: 通常のブラウザ

#### URL設定

| プロパティ | 説明 | 設定値 |
|-----------|------|--------|
| `start_url` | アプリ起動時のURL | `"/"` = トップページ |
| `scope` | アプリの管理範囲 | `"/"` = 全ページ |

#### カラー設定

| プロパティ | 説明 | Offlistでの設定値 |
|-----------|------|------------------|
| `theme_color` | アドレスバーの色（Android） | `"#4F46E5"` = Indigo 600 |
| `background_color` | スプラッシュ画面の背景色 | `"#ffffff"` = 白 |

**theme_colorの視覚効果**:

```
Android Chrome:
┌─────────────────────────┐
│ ■■■■■■■■■■■■■■■■ │ ← この部分が#4F46E5（Indigo）に
│ Offlist                  │
├─────────────────────────┤
│ アプリコンテンツ         │
```

#### アイコン設定（詳細は次セクション）

```json
"icons": [
  {
    "src": "/icons/icon-192x192.png",  // アイコンのパス
    "sizes": "192x192",                 // サイズ
    "type": "image/png",                // MIMEタイプ
    "purpose": "any"                    // 用途（any or maskable）
  }
]
```

**purpose属性の違い**:
- `any`: 通常のアイコン（そのまま表示）
- `maskable`: Android Adaptive Iconsに対応（セーフゾーン内に重要な要素を配置）

---

## アイコン準備

### 必要なアイコンサイズ

| サイズ | 用途 | 重要度 |
|--------|------|--------|
| 72x72 | 小型デバイス | 低 |
| 96x96 | 小型デバイス | 低 |
| 128x128 | Chrome Web Store | 中 |
| 144x144 | Windows | 中 |
| 152x152 | iOS（Safari） | **高** |
| 192x192 | Android標準 | **高** |
| 384x384 | 高解像度 | 中 |
| 512x512 | Android高解像度、スプラッシュ | **高** |

### ディレクトリ構造

```
Offlist/
├── public/
│   ├── icons/
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   └── manifest.json
```

### アイコン作成方法

#### 方法1: Canvaを使用（推奨・無料）

1. **Canvaにアクセス**: https://www.canva.com/
2. **カスタムサイズで新規作成**: 512x512px
3. **デザイン**:
   - 背景色: `#4F46E5`（Indigo 600）
   - テキスト: "Off" または買い物カートアイコン
   - セーフゾーン: 中央80%に重要な要素を配置
4. **ダウンロード**: PNG形式、512x512px

#### 方法2: オンラインジェネレーター

**PWA Asset Generator（推奨）**:
```bash
# インストール
npm install -g pwa-asset-generator

# 512x512のマスターアイコンから自動生成
pwa-asset-generator logo.png public/icons --icon-only --padding "0" --background "#4F46E5"
```

**手動リサイズツール**:
- https://www.iloveimg.com/resize-image
- https://squoosh.app/

#### 方法3: Figma/Photoshop

**Figma手順**:
1. 512x512のフレーム作成
2. デザイン（セーフゾーン: 中央410x410px）
3. Export設定:
   - Format: PNG
   - 各サイズ（0.14x, 0.19x, 0.25x, 0.28x, 0.3x, 0.375x, 0.75x, 1x）

### デザインガイドライン

#### セーフゾーンの重要性

Android Adaptive Iconsでは、アイコンが円形にマスクされる場合があります:

```
512x512アイコン:
┌──────────────────────┐
│    ▓▓▓▓▓▓▓▓▓▓▓▓    │ ← 外側10%: 切り取られる可能性
│  ▓▓░░░░░░░░░░░░▓▓  │
│  ▓▓░░  Off  ░░▓▓  │ ← セーフゾーン（中央80%）
│  ▓▓░░░░░░░░░░░░▓▓  │
│    ▓▓▓▓▓▓▓▓▓▓▓▓    │
└──────────────────────┘
```

**ベストプラクティス**:
- ロゴや重要なテキストは中央410x410px以内に配置
- 背景色は必ず設定（透明背景は避ける）
- コントラストを確保（明るい背景なら暗いロゴ、逆も可）

#### Offlistのアイコンデザイン例

**シンプルデザイン**:
```
背景: #4F46E5 (Indigo 600)
文字: "Off" (白色、太字)
フォント: Inter Bold or SF Pro Bold
```

**アイコン付きデザイン**:
```
背景: #4F46E5
アイコン: 買い物カート（白）
テキスト: "Offlist" または無し
```

### アイコンの配置

1. `public/icons/`ディレクトリを作成
2. 各サイズのアイコンを配置
3. 命名規則: `icon-{サイズ}x{サイズ}.png`

**確認コマンド**:
```bash
ls -lh public/icons/
# 出力例:
# icon-72x72.png    (約2KB)
# icon-192x192.png  (約5KB)
# icon-512x512.png  (約15KB)
```

---

## Service Worker設定

### next-pwaによる自動生成

Phase 1で`next.config.js`に以下を設定済みです:

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // Next.js設定
});
```

### 自動生成されるファイル

ビルド時に`public/`ディレクトリに以下が生成されます:

```
public/
├── sw.js              # Service Workerメインファイル
├── workbox-*.js       # Workboxライブラリ
└── sw.js.map          # ソースマップ
```

### Workboxのキャッシュ戦略

next-pwaはWorkboxを使用し、以下のキャッシュ戦略を自動適用します:

#### 1. Precaching（プリキャッシュ）

**対象**: ビルド時に生成された静的ファイル
- HTML（`_app.js`, `index.html`など）
- JavaScript（`*.js`）
- CSS（`*.css`）

**動作**:
```
初回アクセス時:
Service Workerインストール → 全静的ファイルをキャッシュ

2回目以降:
リクエスト → キャッシュから即座に返す（超高速）
```

#### 2. Runtime Caching（ランタイムキャッシュ）

**対象**: 画像、フォントなどの動的リソース

**戦略の種類**:

| 戦略 | 動作 | 用途 |
|------|------|------|
| **CacheFirst** | キャッシュ優先、無ければネットワーク | 画像、フォント |
| **NetworkFirst** | ネットワーク優先、失敗時キャッシュ | API（オフライン時のフォールバック） |
| **StaleWhileRevalidate** | キャッシュを返しつつ、バックグラウンドで更新 | 頻繁に更新されるコンテンツ |

**next-pwaのデフォルト設定**:
```javascript
// 自動的に適用される設定
runtimeCaching: [
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60 // 1年
      }
    }
  },
  {
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30日
      }
    }
  }
]
```

### オフラインフォールバック

**デフォルト動作**:
```
オンライン時:
ユーザー → Service Worker → サーバー → レスポンス

オフライン時:
ユーザー → Service Worker → キャッシュ → レスポンス
                          ↓ キャッシュ無し
                      フォールバックページ（エラー）
```

**Phase 3以降の改善**:
IndexedDB実装後、オフラインでも完全なデータアクセスが可能になります。

### Service Workerのライフサイクル

```
1. インストール (Install)
   ↓
   静的リソースをプリキャッシュ
   ↓
2. 待機 (Waiting)
   ↓
   古いService Workerが終了
   ↓
3. 有効化 (Activate)
   ↓
   古いキャッシュを削除
   ↓
4. コントロール (Controlling)
   ↓
   全リクエストを制御
```

**skipWaiting: true の効果**:
待機フェーズをスキップし、即座に有効化（開発時に便利）。

### カスタムService Worker設定（オプション）

より高度な制御が必要な場合、`public/sw.js`を手動作成可能:

```javascript
// public/sw.js（カスタム例）
self.addEventListener('fetch', (event) => {
  // カスタムフェッチ処理
});
```

**注意**: next-pwaと併用する場合、設定が競合する可能性があります。Phase 6までは自動生成で十分です。

---

## インストールプロンプトコンポーネント

### beforeinstallpromptイベントとは

ブラウザがPWAをインストール可能と判断すると、`beforeinstallprompt`イベントが発火します。

**発火条件**:
- manifest.jsonが有効
- Service Workerが登録済み
- HTTPSでアクセス（localhost除く）
- ユーザーがサイトに十分エンゲージ（2回以上訪問など）

### InstallPromptコンポーネント実装

#### ディレクトリ構造

```
Offlist/
├── src/
│   ├── components/
│   │   └── InstallPrompt.tsx  ← 新規作成
```

#### 完全な実装例

`src/components/InstallPrompt.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // beforeinstallpromptイベントをキャプチャ
    const handler = (e: Event) => {
      // ブラウザのデフォルトプロンプトを抑制
      e.preventDefault();

      // イベントを保存（後でprompt()を呼び出すため）
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // カスタムプロンプトを表示
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // ブラウザのインストールプロンプトを表示
    await deferredPrompt.prompt();

    // ユーザーの選択結果を取得
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`ユーザーの選択: ${outcome}`);

    // プロンプトは1回のみ使用可能
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-4 shadow-lg z-50">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex-1">
          <p className="font-semibold">Offlistをインストール</p>
          <p className="text-sm text-indigo-100">
            ホーム画面に追加してオフラインで利用できます
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm text-indigo-100 hover:text-white"
          >
            後で
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50"
          >
            インストール
          </button>
        </div>
      </div>
    </div>
  );
}
```

### コードの詳細解説

#### 1. TypeScript型定義

```typescript
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
```

`beforeinstallprompt`イベントは標準のTypeScript型に含まれていないため、カスタム型を定義します。

#### 2. イベントキャプチャ

```typescript
const handler = (e: Event) => {
  e.preventDefault();  // ブラウザのデフォルト動作を抑制
  setDeferredPrompt(e as BeforeInstallPromptEvent);
  setShowPrompt(true);
};
```

**重要**: `e.preventDefault()`を呼ばないと、ブラウザが独自のタイミングでプロンプトを表示します。

#### 3. プロンプト表示

```typescript
const handleInstallClick = async () => {
  await deferredPrompt.prompt();  // ブラウザのインストールダイアログ表示
  const { outcome } = await deferredPrompt.userChoice;  // 結果取得
};
```

**outcome の値**:
- `'accepted'`: ユーザーがインストールを選択
- `'dismissed'`: ユーザーがキャンセルを選択

### レイアウトへの組み込み

`src/app/layout.tsx`:

```typescript
import InstallPrompt from '@/components/InstallPrompt';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4F46E5" />
      </head>
      <body>
        {children}
        <InstallPrompt />  {/* 追加 */}
      </body>
    </html>
  );
}
```

### ユーザー体験の最適化

#### ベストプラクティス

1. **タイミング**:
   - 初回訪問時は表示しない（ユーザーがアプリの価値を理解していない）
   - 2-3回目の訪問後に表示
   - ユーザーが明確なアクション（リスト作成など）を完了した後

2. **デザイン**:
   - 控えめな位置（画面下部）
   - 簡単に閉じられる
   - インストールのメリットを明示

3. **再表示ロジック**:
   - `localStorage`で閉じた回数を記録
   - 3回閉じたら表示を停止

#### 高度な実装例（オプション）

```typescript
// localStorage活用版
useEffect(() => {
  const dismissCount = parseInt(localStorage.getItem('install-dismiss-count') || '0');

  if (dismissCount >= 3) {
    setShowPrompt(false);
    return;
  }

  const handler = (e: Event) => {
    e.preventDefault();
    setDeferredPrompt(e as BeforeInstallPromptEvent);
    setShowPrompt(true);
  };

  window.addEventListener('beforeinstallprompt', handler);
  return () => window.removeEventListener('beforeinstallprompt', handler);
}, []);

const handleDismiss = () => {
  const count = parseInt(localStorage.getItem('install-dismiss-count') || '0');
  localStorage.setItem('install-dismiss-count', String(count + 1));
  setShowPrompt(false);
};
```

---

## オンライン状態検知

### navigator.onLineとは

ブラウザのオンライン/オフライン状態を検知するAPI。

**値**:
- `navigator.onLine === true`: オンライン
- `navigator.onLine === false`: オフライン

**イベント**:
- `online`: オンラインに復帰
- `offline`: オフラインに遷移

### カスタムフック実装

#### useOnlineStatusフック

`src/hooks/useOnlineStatus.ts`:

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // 初期状態を設定
    setIsOnline(navigator.onLine);

    // オンライン/オフラインイベントのリスナー
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

### 使用例

#### オンライン状態インジケーター

`src/components/OnlineIndicator.tsx`:

```typescript
'use client';

import useOnlineStatus from '@/hooks/useOnlineStatus';

export default function OnlineIndicator() {
  const isOnline = useOnlineStatus();

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {!isOnline && (
        <div className="bg-yellow-500 text-white text-center py-2 text-sm font-medium">
          オフラインモード - データはデバイスに保存されます
        </div>
      )}
    </div>
  );
}
```

#### レイアウトへの組み込み

`src/app/layout.tsx`:

```typescript
import OnlineIndicator from '@/components/OnlineIndicator';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <OnlineIndicator />  {/* 追加 */}
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
```

### 視覚効果

```
オンライン時:
┌───────────────────────────┐
│ Offlist                   │
│ [アプリコンテンツ]        │
└───────────────────────────┘

オフライン時:
┌───────────────────────────┐
│ オフラインモード - データ... │ ← 黄色バー
├───────────────────────────┤
│ Offlist                   │
│ [アプリコンテンツ]        │
└───────────────────────────┘
```

### navigator.onLineの制限

**注意点**:
- `false`は確実にオフライン
- `true`は「ネットワークインターフェースが有効」を意味（実際にインターネット接続があるとは限らない）

**例**:
```
ルーターに接続 + インターネット無し = navigator.onLine === true（誤検知）
```

**より確実な方法（Phase 7以降）**:
サーバーへのpingリクエストで実際の接続性を確認。

---

## 動作確認

### 1. Chrome DevToolsでのPWAチェック

#### 手順

1. **開発サーバー起動**:
   ```bash
   npm run dev
   ```

2. **ブラウザでアクセス**: `http://localhost:3000`

3. **DevToolsを開く**: `F12`または`Ctrl+Shift+I`

4. **Applicationタブを選択**:
   ```
   Application
   ├── Manifest
   ├── Service Workers
   ├── Storage
   │   ├── Local Storage
   │   ├── Session Storage
   │   ├── IndexedDB
   │   └── Cache Storage
   ```

#### チェックポイント

**Manifest**:
- [ ] Name: "Offlist - オフライン買い物リスト"
- [ ] Short name: "Offlist"
- [ ] Start URL: "/"
- [ ] Theme color: "#4F46E5"
- [ ] Icons: 8個表示（72x72〜512x512）
- [ ] Display: "standalone"

**Service Workers**:
- [ ] Status: "activated and is running"
- [ ] Source: "sw.js"
- [ ] "Update on reload"をOFF（本番動作確認時）

**Storage > Cache Storage**:
- [ ] `workbox-precache-v2-...`: 静的ファイルがキャッシュされている
- [ ] `workbox-runtime-...`: ランタイムキャッシュ

### 2. Lighthouseテスト

#### 手順

1. **DevTools > Lighthouseタブ**

2. **設定**:
   - Categories: "Progressive Web App"のみ選択
   - Device: Mobile

3. **"Analyze page load"をクリック**

#### 目標スコア

| カテゴリ | 目標 |
|---------|------|
| **PWA** | **95点以上** |

#### チェック項目

- [x] Installable（インストール可能）
- [x] PWA optimized（PWA最適化済み）
- [x] Provides a valid `apple-touch-icon`
- [x] Configured for a custom splash screen
- [x] Sets a theme color for the address bar
- [x] Content is sized correctly for the viewport
- [x] Has a `<meta name="viewport">` tag with `width` or `initial-scale`
- [x] Service worker registered

### 3. 実機でのインストールテスト

#### Android（Chrome）

1. **スマホでアクセス**: デプロイ後のURL（Phase 6）

2. **インストールプロンプト表示**:
   ```
   ┌─────────────────────────────┐
   │ Offlistをインストール       │
   │ ホーム画面に追加して...     │
   │ [後で] [インストール]       │
   └─────────────────────────────┘
   ```

3. **"インストール"をタップ**

4. **ホーム画面を確認**: Offlistアイコンが追加される

5. **アイコンをタップ**: アプリが独立ウィンドウで起動

#### iOS（Safari）

**注意**: iOSは`beforeinstallprompt`イベントに非対応。手動インストールが必要。

1. **Safariでアクセス**

2. **共有ボタンをタップ**: 画面下部の□↑アイコン

3. **"ホーム画面に追加"を選択**

4. **アイコンと名前を確認**: "Offlist"

5. **"追加"をタップ**

6. **ホーム画面を確認**: Offlistアイコンが追加される

### 4. オフライン動作テスト

#### Chrome DevToolsでシミュレート

1. **DevTools > Networkタブ**

2. **"Online"ドロップダウン > "Offline"を選択**

3. **ページをリロード**: `Ctrl+R`

4. **確認**:
   - [ ] ページが正常に表示される
   - [ ] 静的リソース（画像、CSS、JS）がキャッシュから読み込まれる

#### 実機でテスト

1. **スマホを機内モードに**

2. **Offlistアプリを起動**

3. **確認**:
   - [ ] アプリが起動する
   - [ ] UIが正常に表示される
   - [ ] （Phase 3以降）データの追加・編集・削除が可能

---

## チェックリスト

### Phase 2完了チェック

#### ファイル作成

- [ ] `public/manifest.json`作成済み
- [ ] `public/icons/`ディレクトリ作成済み
- [ ] 8サイズのアイコン配置済み（72x72〜512x512）
- [ ] `src/components/InstallPrompt.tsx`作成済み
- [ ] `src/hooks/useOnlineStatus.ts`作成済み
- [ ] `src/components/OnlineIndicator.tsx`作成済み

#### manifest.json設定

- [ ] `name`と`short_name`が設定されている
- [ ] `icons`配列に8個のアイコン定義
- [ ] `theme_color`: `"#4F46E5"`
- [ ] `background_color`: `"#ffffff"`
- [ ] `display`: `"standalone"`
- [ ] `start_url`: `"/"`

#### Service Worker

- [ ] `next.config.js`でnext-pwa設定済み
- [ ] ビルド時に`public/sw.js`が生成される
- [ ] DevToolsで"activated and is running"を確認

#### インストールプロンプト

- [ ] `beforeinstallprompt`イベントをキャプチャ
- [ ] カスタムUIが表示される
- [ ] "インストール"ボタンでブラウザのプロンプト表示
- [ ] `layout.tsx`に組み込み済み

#### オンライン状態検知

- [ ] `useOnlineStatus`フックが動作
- [ ] オフライン時に黄色バー表示
- [ ] `layout.tsx`に組み込み済み

#### 動作確認

- [ ] Chrome DevTools > Application > Manifestでエラー無し
- [ ] Service Workerが"activated"状態
- [ ] Lighthouseで95点以上
- [ ] オフラインモードでページ表示成功
- [ ] （デプロイ後）実機でインストール成功

---

## トラブルシューティング

### よくある問題と解決策

#### 1. Service Workerが登録されない

**症状**:
```
DevTools > Application > Service Workers
"No service workers found for this scope"
```

**原因と対策**:

| 原因 | 対策 |
|------|------|
| HTTPでアクセス（localhost除く） | HTTPSでアクセスするか、localhostで確認 |
| next-pwa設定ミス | `next.config.js`を確認 |
| ビルドしていない | `npm run build && npm start`で確認 |

**確認コマンド**:
```bash
# 本番ビルド
npm run build

# 本番サーバー起動
npm start
```

#### 2. インストールプロンプトが表示されない

**症状**: `beforeinstallprompt`イベントが発火しない

**原因と対策**:

| 原因 | 対策 |
|------|------|
| 既にインストール済み | アンインストール後、再度アクセス |
| manifest.json無効 | DevTools > Applicationでエラー確認 |
| Service Worker未登録 | 上記「Service Workerが登録されない」参照 |
| ユーザーエンゲージメント不足 | 2-3回訪問後に表示される場合がある |

**強制表示方法（開発時）**:
```
DevTools > Application > Manifest
"Add to home screen"ボタンをクリック
```

#### 3. アイコンが表示されない

**症状**: インストール時にデフォルトアイコン（地球儀など）が表示される

**原因と対策**:

| 原因 | 対策 |
|------|------|
| アイコンパスが間違っている | `public/icons/icon-*.png`に配置確認 |
| manifest.jsonのパスミス | `"src": "/icons/icon-192x192.png"`（先頭に`/`） |
| アイコンサイズ不一致 | ファイル名とsizesが一致しているか確認 |
| 画像フォーマット間違い | PNG形式で保存されているか確認 |

**確認方法**:
```bash
# アイコンファイルの存在確認
ls -lh public/icons/

# ブラウザでアクセスして確認
# http://localhost:3000/icons/icon-192x192.png
```

#### 4. iOS Safariで動作しない

**iOS Safariの制限**:

| 機能 | 対応状況 |
|------|---------|
| Service Worker | ◯ 対応（iOS 11.3以降） |
| `beforeinstallprompt` | ✗ 非対応（手動インストールのみ） |
| Push通知 | ✗ 非対応（iOS 16.4以降で一部対応） |
| Background Sync | ✗ 非対応 |

**対策**:

1. **手動インストールガイドを提供**:
   ```typescript
   // iOS検知
   const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

   if (isIOS) {
     // iOSユーザー向けの説明を表示
   }
   ```

2. **説明UI例**:
   ```
   ┌─────────────────────────────┐
   │ iOSをお使いの方へ           │
   │ 1. 共有ボタン（□↑）をタップ│
   │ 2. "ホーム画面に追加"を選択 │
   └─────────────────────────────┘
   ```

#### 5. Lighthouseで低スコア

**よくある減点項目と対策**:

| 減点項目 | 対策 |
|---------|------|
| "Does not provide a valid `apple-touch-icon`" | `<link rel="apple-touch-icon" href="/icons/icon-192x192.png">`を`<head>`に追加 |
| "Content not sized correctly" | `<meta name="viewport" content="width=device-width, initial-scale=1">`確認 |
| "Theme color not set" | `<meta name="theme-color" content="#4F46E5">`確認 |

**layout.tsxへの追加**:
```typescript
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#4F46E5" />
  <link rel="manifest" href="/manifest.json" />
  <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
</head>
```

#### 6. キャッシュが更新されない

**症状**: コード変更後もブラウザに反映されない

**原因**: Service Workerがキャッシュを返している

**対策**:

1. **開発時**:
   ```
   DevTools > Application > Service Workers
   "Update on reload"にチェック
   ```

2. **本番デプロイ後**:
   - Service Workerは自動的に更新チェック
   - `skipWaiting: true`により即座にアクティベート
   - ユーザーがページをリロードすると新バージョンに更新

3. **強制更新**:
   ```
   DevTools > Application > Service Workers
   "Unregister"をクリック
   ページリロード
   ```

---

## 次のステップ

### Phase 2完了後の状態

```
✓ Next.js + PWA基盤完成
✓ Service Worker動作
✓ インストール可能
✓ オンライン状態検知
✓ オフライン時の静的リソース表示

△ データの永続化（IndexedDB） ← Phase 3で実装
△ 買い物リスト機能 ← Phase 4-5で実装
```

### Phase 3への準備

**Phase 3: IndexedDBセットアップ（60分）**

次のPhaseでは、オフラインでのデータ永続化を実装します。

**主なタスク**:
1. Dexie.jsインストール
2. データベーススキーマ定義
3. CRUD操作関数実装
4. エラーハンドリング

**学習リソース**:
- Dexie.js公式: https://dexie.org/
- IndexedDB入門: https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API

### 推奨休憩

Phase 2で60分間集中したので、**10-15分の休憩**を推奨します。

---

## 参考リソース

### 公式ドキュメント

- **next-pwa**: https://github.com/shadowwalker/next-pwa
- **Workbox**: https://developers.google.com/web/tools/workbox
- **Web App Manifest**: https://developer.mozilla.org/en-US/docs/Web/Manifest
- **Service Worker API**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

### PWAチェックリスト

Google公式: https://web.dev/pwa-checklist/

### アイコンジェネレーター

- **PWA Asset Generator**: https://github.com/onderceylan/pwa-asset-generator
- **Favicon Generator**: https://realfavicongenerator.net/
- **App Icon Generator**: https://www.appicon.co/

### デバッグツール

- **Chrome DevTools**: https://developer.chrome.com/docs/devtools/
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse

---

## まとめ

Phase 2では、**PWAの核心機能**を実装しました。

**達成したこと**:
- ✅ Web App Manifest設定
- ✅ Service Worker自動生成
- ✅ アイコン準備（8サイズ）
- ✅ インストールプロンプトUI
- ✅ オンライン状態検知

**技術的学習**:
- Service Workerのライフサイクル
- Workboxのキャッシュ戦略
- PWAインストールフロー
- `beforeinstallprompt`イベント処理

**次のPhase**:
Phase 3でIndexedDBを実装し、**オフラインでのデータ永続化**を実現します。

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**Phase**: 2/6
**次のドキュメント**: `20251023_03-indexeddb-setup.md`
