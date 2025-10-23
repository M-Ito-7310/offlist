# Phase 3: IndexedDB Setup

**Priority**: 🔴 Critical (MVP必須)
**Estimated Time**: 45-60 minutes
**Status**: ⬜ Not Started
**Prerequisites**: Phase 1完了

---

## 概要

Dexie.jsを使用してIndexedDBのスキーマとCRUD操作を実装します。オフラインファーストの核となるデータレイヤーを構築します。

**Goal**: 完全に動作するローカルデータベースとCRUD操作関数

---

## タスクチェックリスト

### Task 3.1: TypeScript型定義作成 (10分)

- [ ] `src/types/index.ts` にShoppingItem型を定義
- [ ] Category型を定義

**ファイル**: `src/types/index.ts`

```typescript
export type Category = 'food' | 'daily' | 'other';

export interface ShoppingItem {
  id: string; // UUID
  name: string; // アイテム名 (1-50文字)
  category: Category; // カテゴリー
  checked: boolean; // 購入済みフラグ
  quantity?: number; // 数量 (1-999)
  memo?: string; // メモ (0-100文字)
  createdAt: Date; // 作成日時
  updatedAt: Date; // 更新日時
}
```

---

### Task 3.2: Dexie.js データベース定義 (15分)

- [ ] `src/lib/db.ts` を作成
- [ ] Dexieクラスを継承したデータベースクラスを定義
- [ ] スキーマとインデックスを設定

**ファイル**: `src/lib/db.ts`

```typescript
import Dexie, { Table } from 'dexie';
import { ShoppingItem } from '@/types';

export class OfflistDatabase extends Dexie {
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

**検証**:
```bash
npm run dev
# DevTools → Application → IndexedDB → OfflistDB 確認
```

---

### Task 3.3: CRUD操作関数実装 (20分)

- [ ] アイテム追加関数
- [ ] アイテム取得関数 (全件、ID指定、カテゴリーフィルター)
- [ ] アイテム更新関数
- [ ] アイテム削除関数
- [ ] 完了アイテム一括削除関数

**ファイル**: `src/lib/db.ts` (続き)

```typescript
import { v4 as uuidv4 } from 'uuid';

// Create
export async function addItem(
  item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const newItem: ShoppingItem = {
    ...item,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await db.items.add(newItem);
  return newItem.id;
}

// Read
export async function getAllItems(): Promise<ShoppingItem[]> {
  return await db.items.orderBy('createdAt').reverse().toArray();
}

export async function getItemById(id: string): Promise<ShoppingItem | undefined> {
  return await db.items.get(id);
}

export async function getItemsByCategory(category: Category): Promise<ShoppingItem[]> {
  return await db.items.where('category').equals(category).toArray();
}

export async function getUncheckedItems(): Promise<ShoppingItem[]> {
  return await db.items.where('checked').equals(false).toArray();
}

// Update
export async function updateItem(id: string, updates: Partial<ShoppingItem>): Promise<void> {
  await db.items.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
}

export async function toggleItemChecked(id: string): Promise<void> {
  const item = await db.items.get(id);
  if (item) {
    await db.items.update(id, {
      checked: !item.checked,
      updatedAt: new Date(),
    });
  }
}

// Delete
export async function deleteItem(id: string): Promise<void> {
  await db.items.delete(id);
}

export async function deleteCheckedItems(): Promise<number> {
  const checkedItems = await db.items.where('checked').equals(true).toArray();
  await db.items.bulkDelete(checkedItems.map((item) => item.id));
  return checkedItems.length;
}

export async function deleteAllItems(): Promise<void> {
  await db.items.clear();
}
```

---

### Task 3.4: エラーハンドリング追加 (10分)

- [ ] try-catchでエラーをキャッチ
- [ ] エラーログを出力
- [ ] エラーメッセージをユーザーフレンドリーに

**ファイル**: `src/lib/db.ts` (エラーハンドリング追加例)

```typescript
export async function addItem(
  item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const newItem: ShoppingItem = {
      ...item,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.items.add(newItem);
    return newItem.id;
  } catch (error) {
    console.error('Failed to add item:', error);
    throw new Error('アイテムの追加に失敗しました');
  }
}
```

---

### Task 3.5: DevToolsで動作確認 (5分)

- [ ] ブラウザのDevToolsでIndexedDBを確認
- [ ] テストデータを手動で追加
- [ ] CRUD操作が正常に動作することを確認

**テストコード例** (`src/app/page.tsx` で一時的にテスト):

```tsx
'use client';

import { useEffect } from 'react';
import { addItem, getAllItems, deleteAllItems } from '@/lib/db';

export default function Home() {
  useEffect(() => {
    const testDB = async () => {
      // テストデータ追加
      await addItem({ name: 'りんご', category: 'food', checked: false });
      await addItem({ name: '牛乳', category: 'food', checked: false });
      await addItem({ name: 'ティッシュ', category: 'daily', checked: false });

      // 全件取得
      const items = await getAllItems();
      console.log('All items:', items);

      // クリーンアップ
      // await deleteAllItems();
    };

    testDB();
  }, []);

  return <div>Check DevTools Console for IndexedDB test results</div>;
}
```

**検証**:
```bash
# DevTools → Console でログ確認
# DevTools → Application → IndexedDB → OfflistDB → items テーブル確認
```

---

## 成果物

- ✅ TypeScript型定義完成
- ✅ Dexie.jsデータベース初期化
- ✅ CRUD操作関数実装
- ✅ エラーハンドリング実装
- ✅ DevToolsで動作確認完了

---

## 検証コマンド

```bash
npm run dev
# DevTools → Application → IndexedDB → OfflistDB
```

**合格基準**:
- IndexedDBが初期化される
- アイテムの追加・取得・更新・削除が動作
- エラーハンドリングが機能

---

## 次のPhase

Phase 4: UI Components (レイアウト、AddItemForm、ShoppingItem、CategoryFilter)

**コマンド**: `/next-ticket` で Phase 4 に進む

---

**関連ドキュメント**:
- [docs/idea/05-offline-storage.md](../../idea/05-offline-storage.md)
- [docs/implementation/20251023_00-overview.md](../../implementation/20251023_00-overview.md)

**作成日**: 2025-10-23
