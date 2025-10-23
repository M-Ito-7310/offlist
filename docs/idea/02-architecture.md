# Architecture

## システムアーキテクチャ概要

Offlistは、**オフラインファースト**の設計思想に基づいたPWA(Progressive Web App)です。Next.js 14をベースにしつつ、従来のサーバーサイドデータベースではなく、**IndexedDB**をプライマリストレージとして採用し、ネットワーク接続に依存しない完全なローカル動作を実現します。

## 設計思想: オフラインファースト

### 従来型Webアプリとの違い

#### 従来型（オンライン依存）
```
ユーザー操作 → サーバーAPI → データベース → レスポンス → 画面更新
             ↑
         ネットワーク必須（圏外では使えない）
```

#### Offlist（オフラインファースト）
```
ユーザー操作 → IndexedDB → 即座に画面更新
             ↑
         完全ローカル（圏外でも動作）
```

### なぜオフラインファーストか

1. **ユーザー体験の向上**
   - ネットワーク遅延ゼロ
   - 圏外でも完全動作
   - 即座のフィードバック

2. **技術デモとしての明確さ**
   - 機内モードで動作する強烈なインパクト
   - PWAの真価を体感できる

3. **将来の拡張性**
   - オンライン同期は後から追加可能
   - MVPはシンプルに保つ

## 技術スタック詳細

### フロントエンド

#### Next.js 14（App Router）

**選定理由:**
- **Static Export対応**: PWAに最適
- **Server Components**: 初回ロードの高速化
- **Automatic Code Splitting**: パフォーマンス最適化
- **Vercel最適化**: シームレスなデプロイ

**重要な制約:**
- Server Componentsは初回レンダリングのみ使用
- 主要なロジックはClient Componentsで実装
- IndexedDBはクライアントサイドのみ動作

#### TypeScript 5+

**型システム設計:**
```typescript
// 買い物リストアイテム
interface ShoppingItem {
  id: string;              // UUID
  name: string;            // 商品名
  category: Category;      // カテゴリー
  checked: boolean;        // 購入済みフラグ
  quantity?: number;       // 数量（オプション）
  memo?: string;           // メモ（オプション）
  createdAt: Date;         // 作成日時
  updatedAt: Date;         // 更新日時
}

// カテゴリー
type Category = 'food' | 'daily' | 'other';

// カテゴリーラベル
const CATEGORY_LABELS: Record<Category, string> = {
  food: '食品',
  daily: '日用品',
  other: 'その他',
};
```

#### Tailwind CSS 3+

**デザインコンセプト: ミニマル＆ネイティブアプリ風**

カスタム設定:
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // iOS風のカラーパレット
        primary: {
          light: '#007AFF',  // iOS Blue
          DEFAULT: '#007AFF',
          dark: '#0051D5',
        },
        success: '#34C759',  // iOS Green
        danger: '#FF3B30',   // iOS Red
        background: {
          light: '#F2F2F7',  // iOS Background
          DEFAULT: '#FFFFFF',
          dark: '#1C1C1E',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
};
```

### PWA技術

#### next-pwa

**設定:**
```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlist-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30日
        },
      },
    },
  ],
});

module.exports = withPWA({
  // Next.js設定
});
```

**キャッシュ戦略:**
- **NetworkFirst**: オンライン時は最新データ、オフライン時はキャッシュ
- **CacheFirst**: 静的リソース（CSS, JS, 画像）
- **StaleWhileRevalidate**: 頻繁に更新されるリソース

#### Web App Manifest

**manifest.json:**
```json
{
  "name": "Offlist - オフライン買い物リスト",
  "short_name": "Offlist",
  "description": "圏外でも使える買い物リストアプリ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#007AFF",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**アイコンデザイン指針:**
- シンプルな買い物カゴアイコン
- 背景: 白
- メインカラー: iOS Blue (#007AFF)
- 角丸: 22% (iOS標準)

### ローカルストレージ

#### IndexedDB + Dexie.js

**選定理由:**
- **大容量**: LocalStorageの5MB制限を超える
- **構造化データ**: オブジェクトをそのまま保存
- **インデックス**: 高速検索
- **トランザクション**: データ整合性

**Dexie.jsを選んだ理由:**
- **TypeScript完全対応**: 型安全なクエリ
- **シンプルなAPI**: IndexedDB生APIより使いやすい
- **Promiseベース**: async/awaitで直感的

**データベーススキーマ:**
```typescript
// lib/db/index.ts
import Dexie, { Table } from 'dexie';

export interface ShoppingItem {
  id?: string;             // Auto-generated UUID
  name: string;
  category: Category;
  checked: boolean;
  quantity?: number;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Category = 'food' | 'daily' | 'other';

class OfflistDatabase extends Dexie {
  items!: Table<ShoppingItem, string>;

  constructor() {
    super('OfflistDB');
    this.version(1).stores({
      items: 'id, name, category, checked, createdAt, updatedAt',
    });
  }
}

export const db = new OfflistDatabase();
```

**CRUD操作:**
```typescript
// lib/db/queries.ts
import { db } from './index';
import { v4 as uuidv4 } from 'uuid';

// アイテム追加
export async function addItem(item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date();
  const newItem: ShoppingItem = {
    id: uuidv4(),
    ...item,
    createdAt: now,
    updatedAt: now,
  };
  await db.items.add(newItem);
  return newItem;
}

// 全アイテム取得
export async function getAllItems() {
  return await db.items.orderBy('createdAt').reverse().toArray();
}

// アイテム更新
export async function updateItem(id: string, changes: Partial<ShoppingItem>) {
  await db.items.update(id, {
    ...changes,
    updatedAt: new Date(),
  });
}

// アイテム削除
export async function deleteItem(id: string) {
  await db.items.delete(id);
}

// チェック済みアイテム削除
export async function deleteCheckedItems() {
  await db.items.where('checked').equals(1).delete();
}
```

## アプリケーション構造

### ディレクトリ構成

```
Offlist/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # ルートレイアウト（manifest設定）
│   │   ├── page.tsx               # メイン画面
│   │   └── globals.css            # グローバルスタイル
│   ├── components/
│   │   ├── ShoppingList.tsx       # リスト表示コンポーネント
│   │   ├── AddItemForm.tsx        # アイテム追加フォーム
│   │   ├── ShoppingItem.tsx       # 個別アイテム
│   │   ├── CategoryFilter.tsx     # カテゴリーフィルター
│   │   ├── InstallPrompt.tsx      # インストールプロンプト
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Checkbox.tsx
│   │       └── Modal.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts           # Dexie設定
│   │   │   └── queries.ts         # CRUD操作
│   │   └── utils.ts               # ユーティリティ関数
│   └── types/
│       └── index.ts               # 型定義
├── public/
│   ├── icons/                     # PWAアイコン
│   ├── manifest.json              # Web App Manifest
│   └── sw.js                      # Service Worker（next-pwaが自動生成）
├── docs/                          # ドキュメント
├── next.config.js                 # Next.js設定（PWA含む）
├── tailwind.config.ts             # Tailwind設定
└── package.json
```

## 画面設計

### メイン画面レイアウト

```
┌─────────────────────────────────────┐
│  Offlist                      [≡]  │ ← ヘッダー
├─────────────────────────────────────┤
│  [すべて] [食品] [日用品] [その他]  │ ← カテゴリーフィルター
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐  │
│  │ 🛒 商品名を入力...    [追加]  │  │ ← 追加フォーム
│  └─────────────────────────────┘  │
│                                     │
│  ☐ 牛乳              [食品]   [×]  │ ← アイテム
│  ☑ トイレットペーパー [日用品] [×]  │
│  ☐ りんご            [食品]   [×]  │
│  ☐ 洗剤              [日用品] [×]  │
│                                     │
│  [完了済みを表示/非表示]             │
│                                     │
│  ☑ パン              [食品]   [×]  │ ← 完了アイテム
│  ☑ シャンプー        [日用品] [×]  │
│                                     │
├─────────────────────────────────────┤
│  [完了済みを削除]  オフライン状態 🔴 │ ← フッター
└─────────────────────────────────────┘
```

### コンポーネント設計

#### ShoppingList.tsx（メインコンポーネント）

**状態管理:**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { getAllItems } from '@/lib/db/queries';

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // 初回ロード
  useEffect(() => {
    loadItems();
  }, []);

  // オンライン状態の監視
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  async function loadItems() {
    const allItems = await getAllItems();
    setItems(allItems);
  }

  // フィルター適用
  const filteredItems = items.filter(item => {
    if (filter !== 'all' && item.category !== filter) return false;
    if (!showCompleted && item.checked) return false;
    return true;
  });

  // ...
}
```

#### AddItemForm.tsx（追加フォーム）

```typescript
'use client';

import { useState } from 'react';
import { addItem } from '@/lib/db/queries';

export default function AddItemForm({ onItemAdded }: { onItemAdded: () => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('food');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    await addItem({
      name: name.trim(),
      category,
      checked: false,
    });

    setName('');
    onItemAdded();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="商品名を入力..."
        className="flex-1 px-4 py-2 border rounded-lg"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        className="px-4 py-2 border rounded-lg"
      >
        <option value="food">食品</option>
        <option value="daily">日用品</option>
        <option value="other">その他</option>
      </select>
      <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg">
        追加
      </button>
    </form>
  );
}
```

## PWAインストールフロー

### インストールプロンプト実装

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">ホーム画面に追加</h3>
      <p className="text-sm text-gray-600 mb-4">
        オフラインでも使える買い物リストアプリ
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          追加
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="px-4 py-2 border rounded-lg"
        >
          後で
        </button>
      </div>
    </div>
  );
}
```

## オフライン検知とユーザーフィードバック

### オンライン状態インジケーター

```typescript
export function OnlineStatus() {
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

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-sm text-gray-600">
        {isOnline ? 'オンライン' : 'オフライン'}
      </span>
    </div>
  );
}
```

## パフォーマンス最適化

### 初回ロード最適化
- **Static Export**: ビルド時に静的HTML生成
- **Code Splitting**: 自動コード分割
- **Image Optimization**: WebP対応

### ランタイム最適化
- **React.memo**: 不要な再レンダリング防止
- **useMemo / useCallback**: 計算コストの削減
- **Debounce**: 検索フィルターの最適化

## セキュリティ考慮事項

### 初期プロトタイプ
- **XSS対策**: Reactのデフォルトエスケープ
- **IndexedDB**: 同一オリジンポリシーで保護
- **HTTPS**: Vercelで自動対応

### 将来的な対策（クラウド同期時）
- JWT認証
- CSRF対策
- Rate Limiting

## デプロイ戦略

### Vercel設定
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

## 将来的な拡張: クラウド同期

### アーキテクチャ進化

**現在（MVP）:**
```
ブラウザ → IndexedDB
```

**Phase 7以降（クラウド同期）:**
```
ブラウザ → IndexedDB ←→ Neon PostgreSQL
           ↓              ↓
        オフライン        オンライン時同期
```

**同期戦略:**
1. **書き込み**: まずIndexedDBに保存（即座の反映）
2. **バックグラウンド同期**: Service Workerがオンライン検知
3. **競合解決**: Last-Write-Wins または Manual Merge

---

**このアーキテクチャの本質**: シンプルさと拡張性の両立

**ドキュメント作成日**: 2025年10月23日
**バージョン**: 1.0
