# Offline Storage

## オフラインストレージ概要

Offlistの核心技術は**IndexedDB**を使った完全なローカルデータ永続化です。サーバーサイドデータベース(Neon PostgreSQL等)を一切使わず、ブラウザ内のIndexedDBだけで全データを管理します。

## なぜIndexedDBか

### LocalStorageとの比較

| 特性 | localStorage | IndexedDB |
|------|-------------|-----------|
| **容量** | 5-10 MB | 最小50MB〜無制限* |
| **データ型** | 文字列のみ | オブジェクト、配列、Blob等 |
| **検索** | キーのみ | インデックスで高速検索 |
| **非同期** | ❌ 同期API | ✅ 非同期API |
| **トランザクション** | ❌ なし | ✅ ACID対応 |
| **パフォーマンス** | 小規模データ向け | 大規模データ向け |

*ブラウザとデバイスに依存、通常は50MB以上

### Cookieとの比較

| 特性 | Cookie | IndexedDB |
|------|--------|-----------|
| **容量** | 4 KB | 最小50MB〜 |
| **サーバー送信** | 自動送信 | ローカルのみ |
| **用途** | セッション管理 | データストレージ |
| **セキュリティ** | HTTP通信で露出 | ブラウザ内で保護 |

### 結論
- **大容量**: 数千件のアイテムも余裕
- **高速**: インデックスによる検索
- **型安全**: TypeScriptと相性抜群（Dexie.js）

---

## Dexie.js

### なぜDexie.jsか

**IndexedDB生API:**
```javascript
// 複雑で読みにくい
const request = indexedDB.open('MyDatabase', 1);
request.onsuccess = (event) => {
  const db = event.target.result;
  const transaction = db.transaction(['items'], 'readwrite');
  const objectStore = transaction.objectStore('items');
  const addRequest = objectStore.add({ name: 'Item' });
  addRequest.onsuccess = () => {
    console.log('Added');
  };
};
```

**Dexie.js:**
```typescript
// シンプルで直感的
await db.items.add({ name: 'Item' });
```

### Dexie.jsの利点

1. **TypeScript完全対応**: 型推論、型安全なクエリ
2. **Promiseベース**: async/awaitで直感的
3. **シンプルAPI**: 学習コスト低
4. **高パフォーマンス**: 内部最適化
5. **豊富な機能**: クエリ、インデックス、トランザクション

---

## データベース設計

### スキーマ定義

**lib/db/index.ts:**
```typescript
import Dexie, { Table } from 'dexie';

// 買い物リストアイテム
export interface ShoppingItem {
  id?: string;             // UUID（主キー）
  name: string;            // 商品名（必須、1-50文字）
  category: Category;      // カテゴリー
  checked: boolean;        // 購入済みフラグ
  quantity?: number;       // 数量（オプション）
  memo?: string;           // メモ（オプション）
  createdAt: Date;         // 作成日時
  updatedAt: Date;         // 更新日時
}

// カテゴリー型
export type Category = 'food' | 'daily' | 'other';

// Dexieデータベースクラス
class OfflistDatabase extends Dexie {
  // テーブル定義
  items!: Table<ShoppingItem, string>;

  constructor() {
    super('OfflistDB'); // データベース名

    // スキーマバージョン1
    this.version(1).stores({
      items: 'id, name, category, checked, createdAt, updatedAt',
      //     ↑    ↑     ↑          ↑        ↑          ↑
      //     主キー  インデックス付きフィールド
    });
  }
}

// シングルトンインスタンス
export const db = new OfflistDatabase();
```

### インデックスの意味

```typescript
items: 'id, name, category, checked, createdAt, updatedAt'
```

- **id**: 主キー（必須、ユニーク）
- **name**: 商品名で検索可能
- **category**: カテゴリー別フィルター
- **checked**: 完了/未完了で絞り込み
- **createdAt**: 作成日時でソート
- **updatedAt**: 更新日時でソート

**インデックスのメリット:**
- 高速検索: O(log n) の時間複雑度
- ソート効率化: 事前ソート済み
- フィルタリング: WHERE句のような絞り込み

---

## CRUD操作

### lib/db/queries.ts

```typescript
import { db, ShoppingItem } from './index';
import { v4 as uuidv4 } from 'uuid';

/**
 * アイテム追加
 */
export async function addItem(
  item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ShoppingItem> {
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

/**
 * 全アイテム取得（作成日時降順）
 */
export async function getAllItems(): Promise<ShoppingItem[]> {
  return await db.items
    .orderBy('createdAt')
    .reverse()
    .toArray();
}

/**
 * カテゴリー別アイテム取得
 */
export async function getItemsByCategory(category: Category): Promise<ShoppingItem[]> {
  return await db.items
    .where('category')
    .equals(category)
    .toArray();
}

/**
 * 未完了アイテム取得
 */
export async function getUncheckedItems(): Promise<ShoppingItem[]> {
  return await db.items
    .where('checked')
    .equals(0) // Dexieではbooleanを0/1として扱う
    .toArray();
}

/**
 * アイテム取得（ID指定）
 */
export async function getItemById(id: string): Promise<ShoppingItem | undefined> {
  return await db.items.get(id);
}

/**
 * アイテム更新
 */
export async function updateItem(
  id: string,
  changes: Partial<Omit<ShoppingItem, 'id' | 'createdAt'>>
): Promise<void> {
  await db.items.update(id, {
    ...changes,
    updatedAt: new Date(),
  });
}

/**
 * チェック状態切り替え
 */
export async function toggleItemChecked(id: string): Promise<void> {
  const item = await db.items.get(id);
  if (item) {
    await db.items.update(id, {
      checked: !item.checked,
      updatedAt: new Date(),
    });
  }
}

/**
 * アイテム削除
 */
export async function deleteItem(id: string): Promise<void> {
  await db.items.delete(id);
}

/**
 * 完了アイテム一括削除
 */
export async function deleteCheckedItems(): Promise<number> {
  return await db.items
    .where('checked')
    .equals(1)
    .delete();
}

/**
 * 全アイテム削除（デバッグ用）
 */
export async function deleteAllItems(): Promise<void> {
  await db.items.clear();
}

/**
 * アイテム数取得
 */
export async function getItemCount(): Promise<number> {
  return await db.items.count();
}

/**
 * 検索（商品名）
 */
export async function searchItems(query: string): Promise<ShoppingItem[]> {
  return await db.items
    .filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
    .toArray();
}
```

---

## 高度なクエリ

### 複合条件フィルター

```typescript
// カテゴリー「食品」で未完了のアイテム
export async function getFoodUnchecked(): Promise<ShoppingItem[]> {
  return await db.items
    .where('category')
    .equals('food')
    .and(item => !item.checked)
    .toArray();
}
```

### ソート

```typescript
// 商品名でアルファベット順
export async function getItemsSortedByName(): Promise<ShoppingItem[]> {
  return await db.items
    .orderBy('name')
    .toArray();
}

// 更新日時で新しい順
export async function getRecentlyUpdated(): Promise<ShoppingItem[]> {
  return await db.items
    .orderBy('updatedAt')
    .reverse()
    .limit(10) // 最新10件
    .toArray();
}
```

### ページネーション

```typescript
// 10件ずつ取得
export async function getItemsPaginated(page: number, perPage: number = 10): Promise<ShoppingItem[]> {
  const offset = (page - 1) * perPage;
  return await db.items
    .orderBy('createdAt')
    .reverse()
    .offset(offset)
    .limit(perPage)
    .toArray();
}
```

---

## トランザクション

### 複数操作の原子性

```typescript
import { db } from './index';

/**
 * 完了アイテムをアーカイブして削除
 */
export async function archiveCheckedItems(): Promise<void> {
  await db.transaction('rw', db.items, async () => {
    // 完了アイテムを取得
    const checkedItems = await db.items
      .where('checked')
      .equals(1)
      .toArray();

    // アーカイブ処理（例: 別テーブルに移動）
    // await db.archivedItems.bulkAdd(checkedItems);

    // 削除
    const ids = checkedItems.map(item => item.id!);
    await db.items.bulkDelete(ids);
  });
}
```

### トランザクションのメリット
- **原子性**: すべて成功するか、すべて失敗
- **一貫性**: データの整合性を保証
- **隔離性**: 他の操作との干渉を防ぐ

---

## スキーママイグレーション

### バージョンアップ

**例: 数量フィールドを追加**

```typescript
class OfflistDatabase extends Dexie {
  items!: Table<ShoppingItem, string>;

  constructor() {
    super('OfflistDB');

    // バージョン1: 初期スキーマ
    this.version(1).stores({
      items: 'id, name, category, checked, createdAt, updatedAt',
    });

    // バージョン2: quantityフィールド追加
    this.version(2).stores({
      items: 'id, name, category, checked, quantity, createdAt, updatedAt',
    }).upgrade(async (trans) => {
      // 既存データにquantity: 1を設定
      await trans.table('items').toCollection().modify(item => {
        item.quantity = 1;
      });
    });
  }
}
```

### マイグレーション戦略

1. **新しいバージョン定義**: `this.version(2)`
2. **スキーマ更新**: `stores({...})`
3. **データ変換**: `upgrade()`で既存データを更新

---

## データのエクスポート/インポート

### エクスポート（JSON）

```typescript
/**
 * 全データをJSON形式でエクスポート
 */
export async function exportData(): Promise<string> {
  const allItems = await db.items.toArray();
  return JSON.stringify(allItems, null, 2);
}

/**
 * ダウンロード
 */
export function downloadData() {
  exportData().then(data => {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `offlist-backup-${new Date().toISOString()}.json`;
    a.click();
  });
}
```

### インポート（JSON）

```typescript
/**
 * JSONデータをインポート
 */
export async function importData(jsonData: string): Promise<void> {
  const items: ShoppingItem[] = JSON.parse(jsonData);

  await db.transaction('rw', db.items, async () => {
    // 既存データを削除（オプション）
    await db.items.clear();

    // 新しいデータを追加
    await db.items.bulkAdd(items);
  });
}
```

---

## ストレージ容量管理

### 容量確認

```typescript
/**
 * 使用ストレージ容量を取得（概算）
 */
export async function getStorageSize(): Promise<string> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;

    const usageMB = (usage / (1024 * 1024)).toFixed(2);
    const quotaMB = (quota / (1024 * 1024)).toFixed(2);

    return `使用中: ${usageMB} MB / ${quotaMB} MB`;
  }
  return '不明';
}
```

### ストレージ永続化

```typescript
/**
 * ストレージの永続化をリクエスト
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    const isPersisted = await navigator.storage.persist();
    console.log(`Persistent storage: ${isPersisted}`);
    return isPersisted;
  }
  return false;
}
```

**永続化のメリット:**
- ブラウザがストレージを勝手に削除しない
- ディスク容量が厳しくてもデータを保護

---

## エラーハンドリング

### try-catchパターン

```typescript
export async function safeAddItem(item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShoppingItem | null> {
  try {
    return await addItem(item);
  } catch (error) {
    console.error('Failed to add item:', error);
    // エラー通知
    showToast('アイテムの追加に失敗しました', 'error');
    return null;
  }
}
```

### Dexieエラー種類

```typescript
import { DexieError } from 'dexie';

try {
  await db.items.add(item);
} catch (error) {
  if (error instanceof Dexie.ConstraintError) {
    // 制約エラー（重複キーなど）
    console.error('Duplicate item');
  } else if (error instanceof Dexie.QuotaExceededError) {
    // ストレージ容量超過
    console.error('Storage full');
  } else {
    // その他のエラー
    console.error('Database error:', error);
  }
}
```

---

## パフォーマンス最適化

### バルク操作

**悪い例（遅い）:**
```typescript
// 1件ずつ追加（ループで1000回のトランザクション）
for (const item of items) {
  await db.items.add(item);
}
```

**良い例（速い）:**
```typescript
// 一括追加（1回のトランザクション）
await db.items.bulkAdd(items);
```

### インデックスの活用

**遅い:**
```typescript
// フルスキャン
const items = await db.items.toArray();
const foodItems = items.filter(item => item.category === 'food');
```

**速い:**
```typescript
// インデックス使用
const foodItems = await db.items
  .where('category')
  .equals('food')
  .toArray();
```

---

## デバッグ

### Dexie.debug

```typescript
// 開発環境のみ有効化
if (process.env.NODE_ENV === 'development') {
  Dexie.debug = true; // SQLライクなログ出力
}
```

### Chrome DevTools

1. **Application タブ → IndexedDB**
2. **OfflistDB → items**
3. データをテーブル形式で表示・編集

---

## 将来的な拡張: クラウド同期

### 同期戦略

```typescript
/**
 * IndexedDB → Neon PostgreSQL 同期
 */
export async function syncToCloud(): Promise<void> {
  // オフライン確認
  if (!navigator.onLine) {
    console.log('Offline: sync skipped');
    return;
  }

  // 未同期アイテム取得
  const unsyncedItems = await db.items
    .where('synced')
    .equals(0)
    .toArray();

  if (unsyncedItems.length === 0) return;

  // APIに送信
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: unsyncedItems }),
    });

    if (response.ok) {
      // 同期済みフラグを更新
      const ids = unsyncedItems.map(item => item.id!);
      await db.items
        .where('id')
        .anyOf(ids)
        .modify({ synced: 1 });
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}
```

### Service Workerでバックグラウンド同期

```javascript
// sw.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'offlist-sync') {
    event.waitUntil(syncData());
  }
});
```

---

## セキュリティ

### 同一オリジンポリシー

- IndexedDBは**同一オリジン**でのみアクセス可能
- 他のWebサイトからは読み取り不可

### データ暗号化（将来）

```typescript
import CryptoJS from 'crypto-js';

// 暗号化
function encryptData(data: string, password: string): string {
  return CryptoJS.AES.encrypt(data, password).toString();
}

// 復号化
function decryptData(encrypted: string, password: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}
```

---

## まとめ

### Offlistのオフラインストレージの強み

1. **完全ローカル**: サーバー不要で高速
2. **大容量**: 数千件のアイテムも余裕
3. **型安全**: TypeScript + Dexie.js
4. **拡張性**: クラウド同期への移行が容易

### IndexedDB選定の正当性

- ✅ LocalStorageの容量制限を回避
- ✅ 構造化データの保存
- ✅ 高速検索・ソート
- ✅ トランザクション対応
- ✅ PWAとの相性抜群

---

**このドキュメントの目的**: オフラインストレージの設計思想と実装詳細を完全理解する

**ドキュメント作成日**: 2025年10月23日
**バージョン**: 1.0
