# PWA Implementation

## PWA実装概要

Offlistの核心的価値は「**機内モードでも完璧に動作する**」というPWA(Progressive Web App)の実力を証明することです。このドキュメントでは、PWA技術の実装詳細を解説します。

## PWAの3つの柱

### 1. Web App Manifest
- アプリのメタデータ定義
- ホーム画面アイコン、スプラッシュスクリーン

### 2. Service Worker
- リソースのキャッシュ
- オフライン動作の実現

### 3. HTTPS
- セキュア接続（Vercelで自動対応）

---

## Web App Manifest

### manifest.json

**場所:** `public/manifest.json`

```json
{
  "name": "Offlist - オフライン買い物リスト",
  "short_name": "Offlist",
  "description": "圏外でも使える買い物リストアプリ。スーパーの地下でもサクサク動作します。",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#007AFF",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "ja",
  "dir": "ltr",
  "categories": ["shopping", "productivity", "lifestyle"],
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
      "src": "/icons/icon-maskable-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/screenshot-mobile.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/screenshot-desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "shortcuts": [
    {
      "name": "新しいアイテムを追加",
      "short_name": "追加",
      "description": "買い物リストに新しいアイテムを追加",
      "url": "/?action=add",
      "icons": [
        {
          "src": "/icons/shortcut-add.png",
          "sizes": "96x96",
          "type": "image/png"
        }
      ]
    }
  ]
}
```

### プロパティ解説

#### display: "standalone"
- ブラウザUIを非表示
- ネイティブアプリのような全画面表示
- ステータスバーのみ表示

**他のオプション:**
- `fullscreen`: ステータスバーも非表示（ゲーム向け）
- `minimal-ui`: 最小限のブラウザUI（戻るボタンのみ）
- `browser`: 通常のブラウザ表示

#### background_color と theme_color

**background_color (#FFFFFF):**
- スプラッシュスクリーン背景色
- アプリ起動時に最初に表示される色

**theme_color (#007AFF):**
- iOS: ステータスバーの色
- Android: ツールバーの色
- PWAのブランドカラー

#### icons: purpose

**any:**
- 通常のアイコン
- そのままの形で表示

**maskable:**
- Android Adaptive Icons対応
- OSがマスクをかけて円形・角丸にする
- セーフゾーン（中央80%）に重要な要素を配置

**maskableアイコン設計:**
```
┌─────────────────────┐
│  ← 10%余白           │
│    ┌───────────┐    │
│    │           │    │
│10% │  アイコン  │ 10%│
│    │  (80%)    │    │
│    │           │    │
│    └───────────┘    │
│           10%余白 → │
└─────────────────────┘
```

---

## Service Worker実装

### next-pwa設定

**インストール:**
```bash
npm install next-pwa
```

**next.config.js:**
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
  runtimeCaching: [
    // HTML（NetworkFirst）
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlist-pages',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24時間
        },
        networkTimeoutSeconds: 10,
      },
    },
    // 静的リソース（CacheFirst）
    {
      urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'offlist-static',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30日
        },
      },
    },
    // API（NetworkOnly）
    {
      urlPattern: /\/api\/.*/,
      handler: 'NetworkOnly',
    },
  ],
});

module.exports = withPWA({
  reactStrictMode: true,
  // その他のNext.js設定
});
```

### キャッシュ戦略

#### 1. NetworkFirst（HTML）

```
リクエスト
  ↓
ネットワークを試す（タイムアウト: 10秒）
  ↓
成功? → レスポンスを返す + キャッシュに保存
  ↓
失敗? → キャッシュから返す
  ↓
キャッシュなし? → エラー
```

**適用対象:** HTML、動的コンテンツ

**メリット:**
- 常に最新データを取得
- オフライン時もキャッシュで動作

#### 2. CacheFirst（静的リソース）

```
リクエスト
  ↓
キャッシュを確認
  ↓
キャッシュあり? → 即座に返す
  ↓
キャッシュなし? → ネットワークから取得 + キャッシュに保存
```

**適用対象:** CSS, JS, 画像, フォント

**メリット:**
- 超高速読み込み
- ネットワーク使用量削減

#### 3. NetworkOnly（API）

```
リクエスト
  ↓
ネットワークから取得
  ↓
キャッシュしない
```

**適用対象:** API（将来のクラウド同期用）

**理由:**
- データの鮮度が重要
- MVPではAPIなし

---

## ホーム画面インストール

### beforeinstallprompt イベント

**InstallPrompt.tsx:**
```typescript
'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // インストール可否を確認
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      // すでにインストール済み
      return;
    }

    // beforeinstallpromptイベントをキャッチ
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 初回訪問かチェック
      const hasSeenPrompt = localStorage.getItem('hasSeenInstallPrompt');
      if (!hasSeenPrompt) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;

    // ブラウザのインストールプロンプトを表示
    await deferredPrompt.prompt();

    // ユーザーの選択を取得
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed successfully');
    } else {
      console.log('PWA installation dismissed');
    }

    // プロンプトをクリア
    setDeferredPrompt(null);
    setShowPrompt(false);

    // 表示済みフラグを保存
    localStorage.setItem('hasSeenInstallPrompt', 'true');
  }

  function handleDismiss() {
    setShowPrompt(false);
    localStorage.setItem('hasSeenInstallPrompt', 'true');
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg animate-slideUp">
      <div className="max-w-md mx-auto flex items-center gap-4">
        <img src="/icons/icon-96x96.png" alt="Offlist" className="w-12 h-12 rounded-lg" />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">ホーム画面に追加</h3>
          <p className="text-sm text-gray-600">オフラインでも使える買い物リストアプリ</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            後で
          </button>
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition"
          >
            追加
          </button>
        </div>
      </div>
    </div>
  );
}
```

### インストール後の検知

```typescript
useEffect(() => {
  // インストール完了イベント
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed');
    // 分析イベント送信
  });
}, []);
```

### スタンドアロンモード検知

```typescript
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

if (isStandalone) {
  // PWAとして起動中
  console.log('Running as PWA');
} else {
  // ブラウザで表示中
  console.log('Running in browser');
}
```

---

## アイコン設計

### サイズと用途

| サイズ | 用途 |
|--------|------|
| 72x72 | iOS: iPhone通知アイコン |
| 96x96 | Android: 低解像度デバイス |
| 128x128 | Chrome Web Store |
| 144x144 | Windows: スタートメニュー |
| 152x152 | iOS: iPad |
| 192x192 | Android: 標準 |
| 384x384 | Android: 高解像度 |
| 512x512 | Android: スプラッシュスクリーン |

### デザインガイドライン

#### アイコンコンセプト
- **モチーフ**: 買い物カゴ
- **色**: iOS Blue (#007AFF) + ホワイト
- **スタイル**: フラットデザイン、シンプル

#### 具体的デザイン
```
┌─────────────────────┐
│                     │
│       ┌───┐         │
│      ╱     ╲        │
│     │  🛒   │       │ ← 買い物カゴアイコン
│     │       │       │
│      ╲_____╱        │
│                     │
│   Offlist (文字)     │
│                     │
└─────────────────────┘

背景: ホワイト (#FFFFFF)
カゴ: iOS Blue (#007AFF)
```

### Maskableアイコン

**セーフゾーン（中央80%）に収める:**
```
┌─────────────────────┐
│  ← 余白10%          │
│    ┌───────────┐    │
│    │           │    │
│    │    🛒     │    │ ← アイコンを中央に
│    │           │    │
│    └───────────┘    │
│          余白10% → │
└─────────────────────┘
```

---

## スプラッシュスクリーン

### 自動生成
- **iOS**: manifest.jsonから自動生成
- **Android**: `theme_color` と最大アイコンを使用

### カスタムスプラッシュ（オプション）

```html
<!-- app/layout.tsx -->
<head>
  <link
    rel="apple-touch-startup-image"
    href="/splash/iphone5.png"
    media="(device-width: 320px) and (device-height: 568px)"
  />
  <link
    rel="apple-touch-startup-image"
    href="/splash/iphone6.png"
    media="(device-width: 375px) and (device-height: 667px)"
  />
  <!-- その他のデバイスサイズ -->
</head>
```

---

## オフライン検知

### navigator.onLine

```typescript
'use client';

import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // 初期状態を設定
    setIsOnline(navigator.onLine);

    // イベントリスナー
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Network: Online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('Network: Offline');
    };

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

### OnlineStatus.tsx

```typescript
export function OnlineStatus() {
  const isOnline = useOnlineStatus();

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        } animate-pulse`}
      />
      <span className="text-sm text-gray-600">
        {isOnline ? 'オンライン' : 'オフライン'}
      </span>
    </div>
  );
}
```

---

## PWA品質チェックリスト

### Lighthouse PWA Audit

**必須項目:**
- ✅ HTTPS
- ✅ manifest.json
- ✅ Service Worker登録
- ✅ オフライン動作
- ✅ 200以上のアイコン
- ✅ start_url が200を返す
- ✅ viewport meta tag
- ✅ theme_color設定

**推奨項目:**
- ✅ maskableアイコン
- ✅ shortcuts定義
- ✅ screenshots追加
- ✅ description充実
- ✅ スプラッシュスクリーン最適化

### テスト手順

1. **Chrome DevTools → Lighthouse**
   - PWAカテゴリーを実行
   - 100点満点を目指す

2. **オフラインテスト**
   - DevTools → Network → Offline
   - アプリが完全動作するか確認

3. **インストールテスト**
   - Chrome: アドレスバーの「+」アイコン
   - Safari: 共有 → ホーム画面に追加

4. **実機テスト**
   - iOS: Safari
   - Android: Chrome
   - 機内モードで動作確認

---

## プラットフォーム別の違い

### iOS (Safari)
- **インストール方法**: 共有ボタン → ホーム画面に追加
- **制限**: `beforeinstallprompt` 非対応
- **対策**: 手動インストール説明を表示

### Android (Chrome)
- **インストール方法**: 自動プロンプトまたはメニュー
- **制限**: なし
- **メリット**: フルPWA対応

### デスクトップ (Chrome, Edge)
- **インストール方法**: アドレスバーの「+」アイコン
- **表示**: ウィンドウアプリとして起動
- **メリット**: マルチタスク、ウィンドウリサイズ

---

## デモ時のポイント

### 1. インストール
「ブラウザからアクセスして、ホーム画面に追加するだけです」

### 2. アイコン表示
「ほら、他のアプリと同じようにアイコンが並びますよね」

### 3. 起動
「タップすると…ブラウザのURLバーなし、完全にアプリです」

### 4. オフライン（クライマックス）
**「ここで、スマホを機内モードにしてみてください」**
- 機内モードON
- アプリを起動
- 「圏外なのに…ほら、動くでしょう?」
- リストの追加・編集を実演

### 5. 技術説明
「これはPWAという技術で、Webサイトなのにアプリのように動きます」

---

**このドキュメントの目的**: PWAの技術的実装を完全理解し、デモで最大限の驚きを与える

**ドキュメント作成日**: 2025年10月23日
**バージョン**: 1.0
