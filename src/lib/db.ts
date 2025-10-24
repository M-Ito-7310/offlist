import Dexie, { Table } from 'dexie';
import { ShoppingItem, Category } from '@/types';
import { v4 as uuidv4 } from 'uuid';

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

// Create
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

// Read
export async function getAllItems(): Promise<ShoppingItem[]> {
  try {
    return await db.items.orderBy('createdAt').reverse().toArray();
  } catch (error) {
    console.error('Failed to get all items:', error);
    throw new Error('アイテムの取得に失敗しました');
  }
}

export async function getItemById(id: string): Promise<ShoppingItem | undefined> {
  try {
    return await db.items.get(id);
  } catch (error) {
    console.error('Failed to get item by id:', error);
    throw new Error('アイテムの取得に失敗しました');
  }
}

export async function getItemsByCategory(category: Category): Promise<ShoppingItem[]> {
  try {
    return await db.items.where('category').equals(category).toArray();
  } catch (error) {
    console.error('Failed to get items by category:', error);
    throw new Error('カテゴリー別アイテムの取得に失敗しました');
  }
}

export async function getUncheckedItems(): Promise<ShoppingItem[]> {
  try {
    return await db.items.where('checked').equals(0).toArray();
  } catch (error) {
    console.error('Failed to get unchecked items:', error);
    throw new Error('未購入アイテムの取得に失敗しました');
  }
}

// Update
export async function updateItem(id: string, updates: Partial<ShoppingItem>): Promise<void> {
  try {
    await db.items.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to update item:', error);
    throw new Error('アイテムの更新に失敗しました');
  }
}

export async function toggleItemChecked(id: string): Promise<void> {
  try {
    const item = await db.items.get(id);
    if (item) {
      await db.items.update(id, {
        checked: !item.checked,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Failed to toggle item checked:', error);
    throw new Error('アイテムのチェック状態の更新に失敗しました');
  }
}

// Delete
export async function deleteItem(id: string): Promise<void> {
  try {
    await db.items.delete(id);
  } catch (error) {
    console.error('Failed to delete item:', error);
    throw new Error('アイテムの削除に失敗しました');
  }
}

export async function deleteCheckedItems(): Promise<number> {
  try {
    const checkedItems = await db.items.where('checked').equals(1).toArray();
    await db.items.bulkDelete(checkedItems.map((item) => item.id));
    return checkedItems.length;
  } catch (error) {
    console.error('Failed to delete checked items:', error);
    throw new Error('完了アイテムの削除に失敗しました');
  }
}

export async function deleteAllItems(): Promise<void> {
  try {
    await db.items.clear();
  } catch (error) {
    console.error('Failed to delete all items:', error);
    throw new Error('全アイテムの削除に失敗しました');
  }
}
