# Phase 2: PWA Configuration

**Priority**: 🔴 Critical (MVP必須)
**Estimated Time**: 45-60 minutes
**Status**: ⬜ Not Started
**Prerequisites**: Phase 1 完了

---

## 概要

PWA (Progressive Web App) の完全な設定を行います。manifest.json、アイコン、Service Worker、インストールプロンプトなど、PWAとして動作するために必要なすべての要素を実装します。

**Goal**: ホーム画面にインストール可能なPWAの完成

---

## タスクチェックリスト

### Task 2.1: manifest.json 作成 (15分)

- [ ] `public/manifest.json` を作成
- [ ] アプリ名、説明、テーマカラーを設定
- [ ] アイコン設定 (後で追加)
- [ ] 表示モード、向きを設定

**ファイル**: `public/manifest.json`

```json
{
  "name": "Offlist - オフライン買い物リスト",
  "short_name": "Offlist",
  "description": "機内モードでも完璧に動作するオフラインファーストPWA買い物リストアプリ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#007AFF",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

**検証**:
```bash
cat public/manifest.json
# JSONが正しい形式か確認
```

---

### Task 2.2: manifest.json を HTML に組み込み (5分)

- [ ] `src/app/layout.tsx` で manifest.json をリンク
- [ ] メタタグを追加 (theme-color, apple-mobile-web-app-capable など)

**ファイル**: `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Offlist - オフライン買い物リスト',
  description: '機内モードでも完璧に動作するPWA買い物リストアプリ',
  manifest: '/manifest.json',
  themeColor: '#007AFF',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Offlist',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#007AFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="bg-background-light text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
```

**検証**:
```bash
npm run dev
# DevTools → Application → Manifest で manifest.json が読み込まれているか確認
```

---

### Task 2.3: PWA アイコン生成 (15分)

- [ ] ベースアイコン (512x512) を作成
- [ ] 必要なサイズにリサイズ (72, 96, 128, 144, 152, 192, 384, 512)
- [ ] `public/icons/` に配置

**方法1: オンラインツール使用**
- [PWA Icon Generator](https://www.pwabuilder.com/imageGenerator)
- [Favicon.io](https://favicon.io/)

**方法2: ImageMagick使用**
```bash
# ベースアイコン (icon.png 512x512) から生成
convert icon.png -resize 72x72 public/icons/icon-72x72.png
convert icon.png -resize 96x96 public/icons/icon-96x96.png
convert icon.png -resize 128x128 public/icons/icon-128x128.png
convert icon.png -resize 144x144 public/icons/icon-144x144.png
convert icon.png -resize 152x152 public/icons/icon-152x152.png
convert icon.png -resize 192x192 public/icons/icon-192x192.png
convert icon.png -resize 384x384 public/icons/icon-384x384.png
convert icon.png -resize 512x512 public/icons/icon-512x512.png
```

**方法3: シンプルなプレースホルダー作成**
```bash
# 各サイズのプレースホルダーを生成 (後で置き換え可能)
# SVGからPNGに変換、またはCanvaで作成
```

**デザインガイド**:
- ブランドカラー: #007AFF (iOS Blue)
- シンプルなショッピングカートアイコン
- 背景: 白または透明
- Maskable icon対応 (セーフエリア内にコンテンツ配置)

**検証**:
```bash
ls -lh public/icons/
# 8つのアイコンファイルが存在することを確認
```

---

### Task 2.4: Service Worker 設定確認 (5分)

- [ ] `next.config.mjs` のPWA設定を確認
- [ ] Service Worker が自動生成されることを確認
- [ ] キャッシュ戦略を設定

**ファイル**: `next.config.mjs` (Phase 1で作成済み、追加設定)

```javascript
import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-image',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-js-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-style-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-data',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /\.(?:json|xml|csv)$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'static-data-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: ({ url }) => {
        const isSameOrigin = self.origin === url.origin;
        if (!isSameOrigin) return false;
        const pathname = url.pathname;
        // Exclude /api/ routes
        if (pathname.startsWith('/api/')) return false;
        return true;
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'others',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
```

**検証**:
```bash
npm run build
# public/ ディレクトリに sw.js, workbox-*.js が生成されることを確認
ls public/sw.js public/workbox-*.js
```

---

### Task 2.5: インストールプロンプトコンポーネント作成 (15分)

- [ ] PWAインストールプロンプトを表示するコンポーネントを作成
- [ ] `beforeinstallprompt` イベントをハンドリング
- [ ] インストール済みの場合は非表示

**ファイル**: `src/components/InstallPrompt.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // すでにインストール済みか確認
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg p-4 flex items-center justify-between z-50 border border-gray-200">
      <div className="flex-1">
        <h3 className="font-semibold text-sm">ホーム画面に追加</h3>
        <p className="text-xs text-gray-600 mt-1">オフラインでも使えます</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleDismiss}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          後で
        </button>
        <button
          onClick={handleInstallClick}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          インストール
        </button>
      </div>
    </div>
  );
}
```

**統合**: `src/app/layout.tsx` に追加

```tsx
import InstallPrompt from '@/components/InstallPrompt';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>{/* ... */}</head>
      <body className="bg-background-light text-gray-900 font-sans">
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
```

**検証**:
```bash
npm run dev
# ブラウザで確認 (インストールプロンプトが表示されるか)
```

---

### Task 2.6: オフライン状態インジケーター作成 (5分)

- [ ] オンライン/オフライン状態を表示するコンポーネントを作成
- [ ] `navigator.onLine` を監視
- [ ] オフライン時に警告バナーを表示

**ファイル**: `src/components/OfflineIndicator.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-warning text-white px-4 py-2 text-center text-sm font-medium z-50">
      📡 オフラインモード - すべての機能が引き続き利用可能です
    </div>
  );
}
```

**統合**: `src/app/layout.tsx` に追加

```tsx
import OfflineIndicator from '@/components/OfflineIndicator';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>{/* ... */}</head>
      <body className="bg-background-light text-gray-900 font-sans">
        <OfflineIndicator />
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
```

**検証**:
```bash
# DevTools → Network → Offline にして確認
# オレンジのバナーが表示されるか
```

---

## 成果物

- ✅ `public/manifest.json` 完成
- ✅ PWAアイコン (8サイズ) 配置
- ✅ Service Worker 自動生成設定
- ✅ インストールプロンプト実装
- ✅ オフライン状態インジケーター実装
- ✅ ホーム画面へのインストール可能

---

## 検証コマンド

```bash
# ビルドチェック
npm run build

# Lighthouse PWAテスト
npx lighthouse http://localhost:3000 --view

# DevToolsで確認
# Application → Manifest
# Application → Service Workers
# Network → Offline
```

**合格基準**:
- Lighthouse PWA Score: 80点以上 (Phase 2時点)
- manifest.json が正しく読み込まれる
- Service Worker が登録される
- インストールプロンプトが表示される
- オフラインインジケーターが動作

---

## 次のPhase

Phase 3: IndexedDB Setup (Dexie.js、スキーマ定義、CRUD操作)

**コマンド**: `/next-ticket` で Phase 3 に進む

---

## トラブルシューティング

### Service Workerが登録されない
```bash
# next-pwaの設定を確認
# disable: process.env.NODE_ENV === 'development' を削除してテスト
```

### manifest.jsonが読み込まれない
```bash
# DevTools → Console でエラー確認
# manifest.json の JSON形式が正しいか確認
```

### インストールプロンプトが表示されない
- HTTPSが必要 (localhostは例外)
- すでにインストール済みの場合は表示されない
- Chromeの場合: `chrome://flags` で PWA機能を確認

---

**関連ドキュメント**:
- [docs/idea/04-pwa-implementation.md](../../idea/04-pwa-implementation.md)
- [docs/implementation/20251023_00-overview.md](../../implementation/20251023_00-overview.md)

**作成日**: 2025-10-23
**最終更新**: 2025-10-23
