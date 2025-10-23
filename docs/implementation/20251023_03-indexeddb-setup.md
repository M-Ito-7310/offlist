# Phase 3: IndexedDBセットアップ

**作成日**: 2025年10月23日
**所要時間**: 60分
**前提条件**: Phase 1完了（Next.js環境構築済み）
**ドキュメントバージョン**: 1.0

---

## 目次

1. [Phase概要](#phase概要)
2. [IndexedDBとは](#indexeddbとは)
3. [Dexie.jsインストール](#dexiejsインストール)
4. [データベーススキーマ定義](#データベーススキーマ定義)
5. [型定義](#型定義)
6. [CRUD操作関数実装](#crud操作関数実装)
7. [エラーハンドリング](#エラーハンドリング)
8. [動作確認](#動作確認)
9. [ベストプラクティス](#ベストプラクティス)
10. [チェックリスト](#チェックリスト)
11. [次のステップ](#次のステップ)

---

## Phase概要

### このPhaseで実装すること

Phase 3では、Offlistの**心臓部**となるローカルストレージシステムを構築します。IndexedDBとDexie.jsを使用して、型安全で高性能なデータ永続化レイヤーを実装します。

**主な成果物:**
- Dexie.jsによる型安全なデータベースクラス
- 完全なCRUD操作関数
- エラーハンドリング機構
- TypeScript型定義

**このPhaseの重要性:**
- アプリ全体のデータ管理基盤
- オフライン動作の核心技術
- 後続Phase（UI実装）の前提条件

---

## IndexedDBとは

### IndexedDBの基礎知識

**IndexedDB**は、ブラウザに組み込まれた**NoSQLデータベース**です。大量の構造化データをクライアントサイドに永続的に保存できます。

#### LocalStorageとの比較

| 特性 | localStorage | IndexedDB |
|------|-------------|-----------|
| **容量** | 5-10 MB | 最小50MB〜無制限* |
| **データ型** | 文字列のみ | オブジェクト、配列、Blob、Date等 |
| **検索** | キーのみ | インデックスで高速検索 |
| **非同期** | ❌ 同期API（メインスレッドブロック） | ✅ 非同期API（ノンブロッキング） |
| **トランザクション** | ❌ なし | ✅ ACID対応 |
| **パフォーマンス** | 小規模データ向け | 大規模データ向け |
| **構造化** | キーバリューのみ | 複雑なクエリ対応 |

*ブラウザとデバイスに依存、通常は50MB以上確保可能

#### Cookieとの比較

| 特性 | Cookie | IndexedDB |
|------|--------|-----------|
| **容量** | 4 KB | 最小50MB〜 |
| **サーバー送信** | 自動送信 | ローカルのみ |
| **用途** | セッション管理 | データストレージ |
| **セキュリティ** | HTTP通信で露出 | ブラウザ内で保護 |
| **有効期限** | 設定可能 | 無期限（明示的削除まで） |

### IndexedDBの主要概念

#### 1. データベース
```javascript
// アプリケーション全体で1つのデータベース
const database = indexedDB.open('OfflistDB', 1);
```

#### 2. オブジェクトストア（テーブル）
```javascript
// テーブルに相当
const objectStore = database.createObjectStore('items', { keyPath: 'id' });
```

#### 3. インデックス
```javascript
// 高速検索のための索引
objectStore.createIndex('category', 'category', { unique: false });
```

#### 4. トランザクション
```javascript
// データの一貫性を保証
const transaction = database.transaction(['items'], 'readwrite');
```

### なぜIndexedDBか？

Offlistで IndexedDB を採用する理由:

1. **大容量**: 数千件の買い物リストアイテムも余裕で保存
2. **高速検索**: カテゴリーやチェック状態での絞り込みが高速
3. **オフライン完結**: サーバー不要で完全動作
4. **型安全**: TypeScript + Dexie.jsの組み合わせ
5. **拡張性**: 将来のクラウド同期にも対応可能

---

## Dexie.jsインストール

### Dexie.jsとは

**Dexie.js**は、IndexedDBの**TypeScript対応ラッパーライブラリ**です。

#### なぜDexie.jsを使うのか？

**IndexedDB生API（複雑で読みにくい）:**
```javascript
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

**Dexie.js（シンプルで直感的）:**
```typescript
await db.items.add({ name: 'Item' });
```

#### Dexie.jsの利点

1. **TypeScript完全対応**: 型推論、型安全なクエリ
2. **Promiseベース**: async/awaitで直感的なコード
3. **シンプルAPI**: 学習コスト低、可読性高
4. **高パフォーマンス**: 内部最適化済み
5. **豊富な機能**: クエリ、インデックス、トランザクション、マイグレーション

### インストール手順

#### 1. パッケージインストール

```bash
# Dexie.jsとUUID生成ライブラリをインストール
npm install dexie uuid

# TypeScript型定義をインストール
npm install --save-dev @types/uuid
```

**インストールされるパッケージ:**
- `dexie`: IndexedDBラッパー（本体）
- `uuid`: ユニークID生成（アイテムの主キー用）
- `@types/uuid`: UUID型定義（開発時のみ）

#### 2. インストール確認

```bash
# package.jsonで確認
cat package.json
```

**期待される出力:**
```json
{
  "dependencies": {
    "dexie": "^3.2.4",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/uuid": "^9.0.7"
  }
}
```

---

## データベーススキーマ定義

### ディレクトリ構造の準備

```bash
# libディレクトリ配下にdbフォルダを作成
mkdir -p src/lib/db
```

**最終的なディレクトリ構造:**
```
src/
├── lib/
│   └── db/
│       ├── index.ts      # Dexieデータベースクラス（スキーマ定義）
│       └── queries.ts    # CRUD操作関数
```

### データベースクラスの実装

**ファイル:** `src/lib/db/index.ts`

```typescript
import Dexie, { Table } from 'dexie';

// ========================================
// 型定義
// ========================================

/**
 * カテゴリー型
 */
export type Category = 'food' | 'daily' | 'other';

/**
 * 買い物リストアイテム型
 */
export interface ShoppingItem {
  id?: string;             // UUID（主キー、自動生成）
  name: string;            // 商品名（必須、1-50文字）
  category: Category;      // カテゴリー（food/daily/other）
  checked: boolean;        // 購入済みフラグ（デフォルト: false）
  quantity?: number;       // 数量（オプション、デフォルト: 1）
  memo?: string;           // メモ（オプション、最大200文字）
  createdAt: Date;         // 作成日時（自動設定）
  updatedAt: Date;         // 更新日時（自動更新）
}

// ========================================
// Dexieデータベースクラス
// ========================================

/**
 * Offlistアプリケーションのデータベース
 */
class OfflistDatabase extends Dexie {
  // テーブル定義（TypeScript型付き）
  items!: Table<ShoppingItem, string>;

  constructor() {
    super('OfflistDB'); // データベース名

    // スキーマバージョン1
    this.version(1).stores({
      // items テーブルのインデックス定義
      // 形式: 'primaryKey, index1, index2, ...'
      items: 'id, name, category, checked, createdAt, updatedAt',
      //     ↑    ↑     ↑          ↑        ↑          ↑
      //     主キー  商品名  カテゴリー  完了状態  作成日時    更新日時
    });
  }
}

// ========================================
// シングルトンインスタンス
// ========================================

/**
 * グローバルデータベースインスタンス
 * アプリ全体で1つのインスタンスを共有
 */
export const db = new OfflistDatabase();
```

### インデックスの詳細解説

```typescript
items: 'id, name, category, checked, createdAt, updatedAt'
```

#### 各フィールドの役割

| フィールド | 役割 | インデックスの効果 |
|-----------|------|-------------------|
| **id** | 主キー（必須） | 一意性保証、高速取得 |
| **name** | 商品名検索 | 商品名での部分一致検索が高速化 |
| **category** | カテゴリーフィルター | 「食品のみ」などの絞り込みが高速 |
| **checked** | 完了/未完了フィルター | 「未完了のみ」表示が高速 |
| **createdAt** | 作成日時ソート | 新しい順/古い順の並び替えが高速 |
| **updatedAt** | 更新日時ソート | 最近更新された順の並び替えが高速 |

#### インデックスのメリット

**インデックスなし（フルスキャン）:**
```typescript
// O(n) - 全件走査
const items = await db.items.toArray();
const foodItems = items.filter(item => item.category === 'food');
```

**インデックスあり（高速検索）:**
```typescript
// O(log n) - 二分探索
const foodItems = await db.items
  .where('category')
  .equals('food')
  .toArray();
```

---

## 型定義

### カテゴリー型

```typescript
/**
 * カテゴリー型（3種類）
 */
export type Category = 'food' | 'daily' | 'other';

/**
 * カテゴリーラベルマッピング
 */
export const CATEGORY_LABELS: Record<Category, string> = {
  food: '食品',
  daily: '日用品',
  other: 'その他',
};

/**
 * カテゴリー絵文字（UI表示用）
 */
export const CATEGORY_ICONS: Record<Category, string> = {
  food: '🍎',
  daily: '🧴',
  other: '📦',
};
```

### ShoppingItem型の詳細

```typescript
export interface ShoppingItem {
  /**
   * アイテムID（UUID v4）
   * 例: "550e8400-e29b-41d4-a716-446655440000"
   * 自動生成されるため、新規作成時はundefined
   */
  id?: string;

  /**
   * 商品名
   * 制約: 1-50文字、空白のみ不可
   */
  name: string;

  /**
   * カテゴリー
   */
  category: Category;

  /**
   * 購入済みフラグ
   * true: チェック済み（購入完了）
   * false: 未チェック（購入予定）
   */
  checked: boolean;

  /**
   * 数量（オプション）
   * 未設定時は1とみなす
   */
  quantity?: number;

  /**
   * メモ（オプション）
   * 制約: 最大200文字
   * 例: "特売品", "クーポン使用"
   */
  memo?: string;

  /**
   * 作成日時（自動設定）
   */
  createdAt: Date;

  /**
   * 最終更新日時（自動更新）
   */
  updatedAt: Date;
}
```

### TypeScript型推論の活用

```typescript
// Omitを使った型推論（自動生成フィールドを除外）
type NewShoppingItem = Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>;

// 使用例
const newItem: NewShoppingItem = {
  name: '牛乳',
  category: 'food',
  checked: false,
  quantity: 2,
};

// Partialを使った部分更新型
type UpdateShoppingItem = Partial<Omit<ShoppingItem, 'id' | 'createdAt'>>;

// 使用例
const update: UpdateShoppingItem = {
  checked: true,
  // nameやcategoryは更新しない
};
```

---

## CRUD操作関数実装

### ファイル作成

**ファイル:** `src/lib/db/queries.ts`

```typescript
import { db, ShoppingItem, Category } from './index';
import { v4 as uuidv4 } from 'uuid';

// ========================================
// Create（作成）
// ========================================

/**
 * アイテムを追加
 *
 * @param item - 追加するアイテム（id, createdAt, updatedAtは自動生成）
 * @returns 追加されたアイテム（IDを含む）
 *
 * @example
 * const item = await addItem({
 *   name: '牛乳',
 *   category: 'food',
 *   checked: false,
 * });
 * console.log(item.id); // "550e8400-..."
 */
export async function addItem(
  item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ShoppingItem> {
  const now = new Date();
  const newItem: ShoppingItem = {
    id: uuidv4(), // UUID v4生成（例: "550e8400-e29b-41d4-a716-446655440000"）
    ...item,
    createdAt: now,
    updatedAt: now,
  };

  await db.items.add(newItem);
  return newItem;
}

/**
 * 複数アイテムを一括追加（高速）
 *
 * @param items - 追加するアイテムの配列
 * @returns 追加されたアイテムの配列
 *
 * @example
 * const items = await bulkAddItems([
 *   { name: '牛乳', category: 'food', checked: false },
 *   { name: 'パン', category: 'food', checked: false },
 * ]);
 */
export async function bulkAddItems(
  items: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>[]
): Promise<ShoppingItem[]> {
  const now = new Date();
  const newItems: ShoppingItem[] = items.map(item => ({
    id: uuidv4(),
    ...item,
    createdAt: now,
    updatedAt: now,
  }));

  await db.items.bulkAdd(newItems);
  return newItems;
}

// ========================================
// Read（読み取り）
// ========================================

/**
 * 全アイテムを取得（作成日時降順）
 *
 * @returns 全アイテムの配列（新しい順）
 *
 * @example
 * const items = await getAllItems();
 * console.log(items.length); // 10
 */
export async function getAllItems(): Promise<ShoppingItem[]> {
  return await db.items
    .orderBy('createdAt')
    .reverse() // 新しい順
    .toArray();
}

/**
 * IDでアイテムを取得
 *
 * @param id - アイテムID
 * @returns アイテム（見つからない場合はundefined）
 *
 * @example
 * const item = await getItemById('550e8400-...');
 * if (item) {
 *   console.log(item.name);
 * }
 */
export async function getItemById(id: string): Promise<ShoppingItem | undefined> {
  return await db.items.get(id);
}

/**
 * カテゴリー別にアイテムを取得
 *
 * @param category - カテゴリー（'food' | 'daily' | 'other'）
 * @returns カテゴリーに一致するアイテムの配列
 *
 * @example
 * const foodItems = await getItemsByCategory('food');
 */
export async function getItemsByCategory(category: Category): Promise<ShoppingItem[]> {
  return await db.items
    .where('category')
    .equals(category)
    .toArray();
}

/**
 * 未完了アイテムを取得
 *
 * @returns チェックされていないアイテムの配列
 *
 * @example
 * const unchecked = await getUncheckedItems();
 * console.log(`残り${unchecked.length}個`);
 */
export async function getUncheckedItems(): Promise<ShoppingItem[]> {
  return await db.items
    .where('checked')
    .equals(0) // Dexieではbooleanを0/1として扱う
    .toArray();
}

/**
 * 完了済みアイテムを取得
 *
 * @returns チェック済みアイテムの配列
 */
export async function getCheckedItems(): Promise<ShoppingItem[]> {
  return await db.items
    .where('checked')
    .equals(1)
    .toArray();
}

/**
 * 商品名で検索（部分一致、大文字小文字無視）
 *
 * @param query - 検索キーワード
 * @returns 検索結果の配列
 *
 * @example
 * const results = await searchItems('牛乳');
 */
export async function searchItems(query: string): Promise<ShoppingItem[]> {
  const lowerQuery = query.toLowerCase();
  return await db.items
    .filter(item => item.name.toLowerCase().includes(lowerQuery))
    .toArray();
}

// ========================================
// Update（更新）
// ========================================

/**
 * アイテムを更新
 *
 * @param id - 更新対象のアイテムID
 * @param changes - 更新内容（updatedAtは自動設定）
 * @returns 更新成功時は1、失敗時は0
 *
 * @example
 * await updateItem('550e8400-...', {
 *   name: '低脂肪牛乳',
 *   quantity: 2,
 * });
 */
export async function updateItem(
  id: string,
  changes: Partial<Omit<ShoppingItem, 'id' | 'createdAt'>>
): Promise<number> {
  return await db.items.update(id, {
    ...changes,
    updatedAt: new Date(),
  });
}

/**
 * チェック状態を切り替え
 *
 * @param id - アイテムID
 *
 * @example
 * await toggleItemChecked('550e8400-...'); // false → true
 * await toggleItemChecked('550e8400-...'); // true → false
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

// ========================================
// Delete（削除）
// ========================================

/**
 * アイテムを削除
 *
 * @param id - 削除対象のアイテムID
 *
 * @example
 * await deleteItem('550e8400-...');
 */
export async function deleteItem(id: string): Promise<void> {
  await db.items.delete(id);
}

/**
 * 完了済みアイテムを一括削除
 *
 * @returns 削除されたアイテム数
 *
 * @example
 * const count = await deleteCheckedItems();
 * console.log(`${count}個削除しました`);
 */
export async function deleteCheckedItems(): Promise<number> {
  return await db.items
    .where('checked')
    .equals(1)
    .delete();
}

/**
 * 全アイテムを削除（デバッグ用）
 *
 * @example
 * await deleteAllItems();
 */
export async function deleteAllItems(): Promise<void> {
  await db.items.clear();
}

// ========================================
// ユーティリティ
// ========================================

/**
 * アイテム数を取得
 *
 * @returns 総アイテム数
 *
 * @example
 * const count = await getItemCount();
 */
export async function getItemCount(): Promise<number> {
  return await db.items.count();
}

/**
 * 統計情報を取得
 *
 * @returns アイテムの統計情報
 *
 * @example
 * const stats = await getItemStats();
 * console.log(stats); // { total: 10, checked: 3, unchecked: 7 }
 */
export async function getItemStats(): Promise<{
  total: number;
  checked: number;
  unchecked: number;
}> {
  const total = await db.items.count();
  const checked = await db.items.where('checked').equals(1).count();
  const unchecked = await db.items.where('checked').equals(0).count();

  return { total, checked, unchecked };
}
```

### 高度なクエリ例

```typescript
/**
 * カテゴリー「食品」で未完了のアイテムを取得
 */
export async function getFoodUnchecked(): Promise<ShoppingItem[]> {
  return await db.items
    .where('category')
    .equals('food')
    .and(item => !item.checked)
    .toArray();
}

/**
 * 商品名でアルファベット順にソート
 */
export async function getItemsSortedByName(): Promise<ShoppingItem[]> {
  return await db.items
    .orderBy('name')
    .toArray();
}

/**
 * 最近更新された10件を取得
 */
export async function getRecentlyUpdated(): Promise<ShoppingItem[]> {
  return await db.items
    .orderBy('updatedAt')
    .reverse()
    .limit(10)
    .toArray();
}

/**
 * ページネーション
 */
export async function getItemsPaginated(
  page: number,
  perPage: number = 10
): Promise<ShoppingItem[]> {
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

## エラーハンドリング

### try-catchパターン

```typescript
/**
 * 安全なアイテム追加（エラーハンドリング付き）
 */
export async function safeAddItem(
  item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ShoppingItem | null> {
  try {
    return await addItem(item);
  } catch (error) {
    console.error('Failed to add item:', error);

    // エラー通知（実装例）
    // showToast('アイテムの追加に失敗しました', 'error');

    return null;
  }
}
```

### Dexieエラーの種類

```typescript
import Dexie from 'dexie';

/**
 * エラー種類別のハンドリング
 */
export async function handleDexieError(item: ShoppingItem): Promise<void> {
  try {
    await db.items.add(item);
  } catch (error) {
    if (error instanceof Dexie.ConstraintError) {
      // 制約エラー（重複キーなど）
      console.error('Duplicate item ID:', error);
      alert('このアイテムは既に存在します');
    } else if (error instanceof Dexie.QuotaExceededError) {
      // ストレージ容量超過
      console.error('Storage full:', error);
      alert('ストレージ容量が不足しています。不要なアイテムを削除してください。');
    } else if (error instanceof Dexie.DatabaseClosedError) {
      // データベースが閉じられた
      console.error('Database closed:', error);
      alert('データベース接続エラー。ページを再読み込みしてください。');
    } else {
      // その他のエラー
      console.error('Database error:', error);
      alert('予期しないエラーが発生しました');
    }
  }
}
```

### ストレージ容量チェック

```typescript
/**
 * 使用ストレージ容量を取得（概算）
 */
export async function getStorageSize(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentage = quota > 0 ? (usage / quota) * 100 : 0;

    return { usage, quota, percentage };
  }

  return { usage: 0, quota: 0, percentage: 0 };
}

/**
 * ストレージ容量の警告チェック
 */
export async function checkStorageWarning(): Promise<boolean> {
  const { percentage } = await getStorageSize();

  if (percentage > 80) {
    console.warn(`Storage usage: ${percentage.toFixed(1)}%`);
    return true;
  }

  return false;
}

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

---

## 動作確認

### Chrome DevToolsでの確認

#### 1. DevToolsを開く

1. **Chrome**を起動
2. **F12**キーを押す（または右クリック → 検証）
3. **Application**タブをクリック

#### 2. IndexedDBセクションを確認

```
Application
├── Storage
│   ├── Local Storage
│   ├── Session Storage
│   ├── IndexedDB
│   │   └── OfflistDB          ← ここをクリック
│   │       └── items          ← テーブル
│   └── Cookies
```

#### 3. データの確認

**DevToolsで表示される内容:**
```
| id (primary key)           | name  | category | checked | createdAt           | updatedAt           |
|----------------------------|-------|----------|---------|---------------------|---------------------|
| 550e8400-e29b-41d4-a716... | 牛乳  | food     | false   | 2025-10-23 09:00:00 | 2025-10-23 09:00:00 |
| 660f9511-f3ac-52e5-b827... | パン  | food     | true    | 2025-10-23 09:01:00 | 2025-10-23 09:05:00 |
```

#### 4. 手動でデータ追加

DevToolsからも直接データを追加できます:

1. **items**テーブルを右クリック
2. **Add entry**を選択
3. JSONを入力:
```json
{
  "id": "test-12345",
  "name": "テスト商品",
  "category": "food",
  "checked": false,
  "createdAt": "2025-10-23T00:00:00.000Z",
  "updatedAt": "2025-10-23T00:00:00.000Z"
}
```

### サンプルデータ投入スクリプト

**ファイル:** `src/lib/db/seed.ts`

```typescript
import { bulkAddItems } from './queries';

/**
 * サンプルデータ投入（開発用）
 */
export async function seedDatabase(): Promise<void> {
  const sampleItems = [
    // 食品
    { name: '牛乳', category: 'food' as const, checked: false },
    { name: 'パン', category: 'food' as const, checked: false },
    { name: 'りんご', category: 'food' as const, checked: false },
    { name: '卵', category: 'food' as const, checked: true },
    { name: 'ヨーグルト', category: 'food' as const, checked: false },

    // 日用品
    { name: 'トイレットペーパー', category: 'daily' as const, checked: false },
    { name: '洗剤', category: 'daily' as const, checked: false },
    { name: 'シャンプー', category: 'daily' as const, checked: true },
    { name: 'ティッシュ', category: 'daily' as const, checked: false },

    // その他
    { name: 'ノート', category: 'other' as const, checked: false },
    { name: 'ボールペン', category: 'other' as const, checked: false },
  ];

  try {
    const items = await bulkAddItems(sampleItems);
    console.log(`✅ ${items.length}件のサンプルデータを投入しました`);
  } catch (error) {
    console.error('❌ サンプルデータ投入失敗:', error);
  }
}
```

### ブラウザコンソールでのテスト

**Chromeコンソールで実行:**

```javascript
// モジュールをインポート（Next.js開発サーバー起動中）
import { db } from '@/lib/db';
import { addItem, getAllItems, deleteAllItems } from '@/lib/db/queries';
import { seedDatabase } from '@/lib/db/seed';

// 1. サンプルデータ投入
await seedDatabase();

// 2. 全アイテム取得
const items = await getAllItems();
console.log(items);

// 3. アイテム追加
const newItem = await addItem({
  name: 'バナナ',
  category: 'food',
  checked: false,
});
console.log('追加:', newItem);

// 4. アイテム数確認
const count = await db.items.count();
console.log('総アイテム数:', count);

// 5. カテゴリー別集計
const categories = await db.items.toArray().then(items =>
  items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {})
);
console.log('カテゴリー別:', categories);

// 6. 全削除（クリア）
await deleteAllItems();
console.log('全削除完了');
```

### 動作確認の実行例

**テストコード:** `src/app/test-db/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getAllItems, addItem, deleteAllItems } from '@/lib/db/queries';
import { seedDatabase } from '@/lib/db/seed';
import type { ShoppingItem } from '@/lib/db';

export default function TestDBPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    const allItems = await getAllItems();
    setItems(allItems);
  };

  const handleSeed = async () => {
    setLoading(true);
    await seedDatabase();
    await loadItems();
    setLoading(false);
  };

  const handleAdd = async () => {
    await addItem({
      name: 'テスト商品',
      category: 'food',
      checked: false,
    });
    await loadItems();
  };

  const handleClear = async () => {
    if (confirm('全削除しますか？')) {
      await deleteAllItems();
      await loadItems();
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">IndexedDB テスト</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSeed}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          サンプルデータ投入
        </button>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          アイテム追加
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          全削除
        </button>
        <button
          onClick={loadItems}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          再読み込み
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">アイテム数: {items.length}</h2>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="bg-white p-2 rounded">
              {item.checked ? '✅' : '☐'} {item.name} ({item.category})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

**アクセス:** http://localhost:3000/test-db

---

## ベストプラクティス

### 1. トランザクション管理

**複数操作の原子性を保証:**

```typescript
import { db } from './index';

/**
 * 完了アイテムをアーカイブして削除（トランザクション）
 */
export async function archiveCheckedItems(): Promise<void> {
  await db.transaction('rw', db.items, async () => {
    // 1. 完了アイテムを取得
    const checkedItems = await db.items
      .where('checked')
      .equals(1)
      .toArray();

    // 2. アーカイブ処理（例: 別テーブルに移動）
    // await db.archivedItems.bulkAdd(checkedItems);

    // 3. 削除
    const ids = checkedItems.map(item => item.id!);
    await db.items.bulkDelete(ids);
  });

  // すべて成功するか、すべて失敗（ロールバック）
}
```

**トランザクションのメリット:**
- **原子性**: すべて成功するか、すべて失敗
- **一貫性**: データの整合性を保証
- **隔離性**: 他の操作との干渉を防ぐ

### 2. パフォーマンス最適化

#### バルク操作を使う

**悪い例（遅い）:**
```typescript
// 1000回のトランザクション
for (const item of items) {
  await db.items.add(item);
}
```

**良い例（速い）:**
```typescript
// 1回のトランザクション
await db.items.bulkAdd(items);
```

#### インデックスを活用する

**遅い（フルスキャン）:**
```typescript
const items = await db.items.toArray();
const foodItems = items.filter(item => item.category === 'food');
```

**速い（インデックス使用）:**
```typescript
const foodItems = await db.items
  .where('category')
  .equals('food')
  .toArray();
```

### 3. データマイグレーション戦略

**将来的なスキーマ変更に備える:**

```typescript
class OfflistDatabase extends Dexie {
  items!: Table<ShoppingItem, string>;

  constructor() {
    super('OfflistDB');

    // バージョン1: 初期スキーマ
    this.version(1).stores({
      items: 'id, name, category, checked, createdAt, updatedAt',
    });

    // バージョン2: quantityフィールド追加（将来）
    this.version(2).stores({
      items: 'id, name, category, checked, quantity, createdAt, updatedAt',
    }).upgrade(async (trans) => {
      // 既存データにquantity: 1を設定
      await trans.table('items').toCollection().modify(item => {
        item.quantity = 1;
      });
    });

    // バージョン3: priorityフィールド追加（将来）
    this.version(3).stores({
      items: 'id, name, category, checked, quantity, priority, createdAt, updatedAt',
    }).upgrade(async (trans) => {
      // 既存データにpriority: 'normal'を設定
      await trans.table('items').toCollection().modify(item => {
        item.priority = 'normal';
      });
    });
  }
}
```

**マイグレーションのポイント:**
1. **バージョン番号を増やす**: `this.version(2)`
2. **新しいスキーマを定義**: `stores({...})`
3. **既存データを変換**: `upgrade()`で処理

### 4. エラーレジリエンス

```typescript
/**
 * リトライ付きデータベース操作
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.warn(`Retry ${attempt}/${maxRetries}:`, error);
      await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // 指数バックオフ
    }
  }
  throw new Error('Max retries exceeded');
}

// 使用例
const items = await retryOperation(() => getAllItems());
```

### 5. デバッグモード

```typescript
// 開発環境のみDexieデバッグログを有効化
if (process.env.NODE_ENV === 'development') {
  Dexie.debug = true; // SQLライクなログ出力
}
```

**出力例:**
```
Dexie: Executing: db.items.where('category').equals('food').toArray()
Dexie: Result: [Object, Object, Object] (3 items)
```

---

## チェックリスト

### インストール
- [ ] Dexie.jsインストール完了（`npm install dexie uuid`）
- [ ] TypeScript型定義インストール（`npm install --save-dev @types/uuid`）

### ファイル作成
- [ ] `src/lib/db/index.ts` 作成（データベースクラス）
- [ ] `src/lib/db/queries.ts` 作成（CRUD関数）
- [ ] `src/lib/db/seed.ts` 作成（サンプルデータ）

### 動作確認
- [ ] データベース初期化成功（エラーなし）
- [ ] アイテム追加動作（`addItem()`）
- [ ] アイテム取得動作（`getAllItems()`）
- [ ] アイテム更新動作（`updateItem()`）
- [ ] アイテム削除動作（`deleteItem()`）
- [ ] Chrome DevToolsでデータ確認（Application → IndexedDB → OfflistDB）

### 高度な機能
- [ ] カテゴリーフィルター動作（`getItemsByCategory()`）
- [ ] チェック状態フィルター動作（`getUncheckedItems()`）
- [ ] 商品名検索動作（`searchItems()`）
- [ ] 一括削除動作（`deleteCheckedItems()`）
- [ ] 統計情報取得動作（`getItemStats()`）

### エラーハンドリング
- [ ] try-catch実装
- [ ] ストレージ容量チェック実装
- [ ] エラーメッセージ表示

### テスト
- [ ] サンプルデータ投入成功（`seedDatabase()`）
- [ ] ブラウザコンソールでのテスト実行
- [ ] テストページでの動作確認（`/test-db`）

---

## 次のステップ

### Phase 4への準備

Phase 3でIndexedDBの基盤が完成しました。次のPhaseでは、これらのデータ操作関数を使ってUIコンポーネントを実装します。

**Phase 4で実装すること:**
- `AddItemForm`: `addItem()`を使用
- `ShoppingList`: `getAllItems()`を使用
- `ShoppingItem`: `updateItem()`, `deleteItem()`を使用
- `CategoryFilter`: `getItemsByCategory()`を使用

### 推奨学習リソース

- **Dexie.js公式ドキュメント**: https://dexie.org/
- **MDN IndexedDB**: https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API
- **TypeScript型推論**: https://www.typescriptlang.org/docs/handbook/type-inference.html

### トラブルシューティング

#### Q1: データが保存されない
```typescript
// 解決策1: データベース初期化確認
console.log('DB Open:', db.isOpen());

// 解決策2: エラーログ確認
Dexie.debug = true;
```

#### Q2: 型エラーが出る
```typescript
// 解決策: Omitを使って自動生成フィールドを除外
const item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '牛乳',
  category: 'food',
  checked: false,
};
```

#### Q3: DevToolsでデータが見えない
- Chromeを**シークレットモード以外**で開く
- **Application**タブを確認
- データベース名が**OfflistDB**であることを確認

---

## まとめ

Phase 3では、以下を実装しました:

### 実装内容
1. **Dexie.jsインストール** - TypeScript対応のIndexedDBラッパー
2. **データベーススキーマ定義** - ShoppingItem型とOfflistDatabaseクラス
3. **完全なCRUD操作** - 追加、取得、更新、削除の全関数
4. **型定義** - TypeScriptによる型安全性
5. **エラーハンドリング** - try-catchとDexieエラー処理
6. **動作確認** - Chrome DevToolsとサンプルデータ

### 達成したこと
- ✅ オフラインファーストの基盤完成
- ✅ 型安全なデータ操作
- ✅ 高性能なインデックス検索
- ✅ 拡張可能な設計

### 次のドキュメント
**Phase 4**: `20251023_04-ui-components.md` - UIコンポーネント実装

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
