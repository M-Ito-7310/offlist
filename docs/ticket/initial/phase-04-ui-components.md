# Phase 4: UI Components

**Priority**: 🔴 Critical (MVP必須)
**Estimated Time**: 90-120 minutes
**Status**: ⬜ Not Started
**Prerequisites**: Phase 1-3完了

---

## 概要

ミニマルデザインのUIコンポーネントを実装します。iOS/Android風のシンプルで直感的なインターフェースを構築します。

**Goal**: 完成したUIコンポーネントセット(レイアウト、フォーム、リストアイテム、フィルター)

---

## タスクチェックリスト

### Task 4.1: レイアウトコンポーネント (15分)

- [ ] ヘッダーコンポーネント作成
- [ ] メインコンテナコンポーネント作成

**ファイル**: `src/components/Header.tsx`

```tsx
export default function Header() {
  return (
    <header className="bg-primary text-white py-4 px-6 shadow-md">
      <h1 className="text-xl font-bold">Offlist</h1>
      <p className="text-sm opacity-90">買い物リスト</p>
    </header>
  );
}
```

**ファイル**: `src/components/Container.tsx`

```tsx
export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-light">
      {children}
    </div>
  );
}
```

---

### Task 4.2: AddItemForm コンポーネント (30分)

- [ ] アイテム追加フォームを作成
- [ ] 名前、カテゴリー、数量、メモの入力フィールド
- [ ] バリデーション (名前必須、1-50文字)
- [ ] 送信後フォームリセット

**ファイル**: `src/components/AddItemForm.tsx`

```tsx
'use client';

import { useState, FormEvent } from 'react';
import { addItem } from '@/lib/db';
import { Category } from '@/types';

export default function AddItemForm({ onItemAdded }: { onItemAdded: () => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [quantity, setQuantity] = useState<number>(1);
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.length > 50) return;

    setIsSubmitting(true);
    try {
      await addItem({
        name: name.trim(),
        category,
        checked: false,
        quantity,
        memo: memo.trim(),
      });
      // Reset form
      setName('');
      setCategory('food');
      setQuantity(1);
      setMemo('');
      onItemAdded();
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('アイテムの追加に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="mb-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="アイテム名 (例: りんご)"
          maxLength={50}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="food">🍎 食品</option>
          <option value="daily">🧴 日用品</option>
          <option value="other">📦 その他</option>
        </select>

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          max="999"
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="メモ (オプション)"
          maxLength={100}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !name.trim()}
        className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '追加中...' : '追加'}
      </button>
    </form>
  );
}
```

---

### Task 4.3: ShoppingItem コンポーネント (30分)

- [ ] リストアイテム表示コンポーネント
- [ ] チェックボックス (完了/未完了)
- [ ] 編集ボタン
- [ ] 削除ボタン
- [ ] チェック済みアイテムのスタイル変更

**ファイル**: `src/components/ShoppingItem.tsx`

```tsx
'use client';

import { ShoppingItem as ShoppingItemType } from '@/types';

interface ShoppingItemProps {
  item: ShoppingItemType;
  onToggleCheck: (id: string) => void;
  onEdit: (item: ShoppingItemType) => void;
  onDelete: (id: string) => void;
}

export default function ShoppingItem({
  item,
  onToggleCheck,
  onEdit,
  onDelete,
}: ShoppingItemProps) {
  const categoryEmoji = {
    food: '🍎',
    daily: '🧴',
    other: '📦',
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 mb-2 transition-all ${
        item.checked ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggleCheck(item.id)}
          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryEmoji[item.category]}</span>
            <span className={`font-medium ${item.checked ? 'line-through text-gray-500' : ''}`}>
              {item.name}
            </span>
            {item.quantity && item.quantity > 1 && (
              <span className="text-sm text-gray-500">x{item.quantity}</span>
            )}
          </div>
          {item.memo && (
            <p className="text-sm text-gray-600 mt-1 ml-7">{item.memo}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="text-primary hover:text-primary-dark px-2 py-1"
          >
            編集
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-danger hover:text-red-700 px-2 py-1"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### Task 4.4: CategoryFilter コンポーネント (15分)

- [ ] カテゴリーフィルターボタン
- [ ] 全て / 食品 / 日用品 / その他

**ファイル**: `src/components/CategoryFilter.tsx`

```tsx
'use client';

import { Category } from '@/types';

interface CategoryFilterProps {
  selectedCategory: Category | 'all';
  onFilterChange: (category: Category | 'all') => void;
}

export default function CategoryFilter({
  selectedCategory,
  onFilterChange,
}: CategoryFilterProps) {
  const categories = [
    { value: 'all' as const, label: '全て', emoji: '📋' },
    { value: 'food' as const, label: '食品', emoji: '🍎' },
    { value: 'daily' as const, label: '日用品', emoji: '🧴' },
    { value: 'other' as const, label: 'その他', emoji: '📦' },
  ];

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onFilterChange(cat.value)}
          className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
            selectedCategory === cat.value
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}
```

---

### Task 4.5: EditItemModal コンポーネント (30分)

- [ ] モーダルでアイテム編集
- [ ] 編集フォーム (AddItemFormと同様)
- [ ] キャンセル / 保存ボタン

**ファイル**: `src/components/EditItemModal.tsx`

```tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { ShoppingItem, Category } from '@/types';
import { updateItem } from '@/lib/db';

interface EditItemModalProps {
  item: ShoppingItem | null;
  onClose: () => void;
  onItemUpdated: () => void;
}

export default function EditItemModal({ item, onClose, onItemUpdated }: EditItemModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [quantity, setQuantity] = useState<number>(1);
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setQuantity(item.quantity || 1);
      setMemo(item.memo || '');
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await updateItem(item.id, {
        name: name.trim(),
        category,
        quantity,
        memo: memo.trim(),
      });
      onItemUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update item:', error);
      alert('更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">アイテムを編集</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="food">🍎 食品</option>
              <option value="daily">🧴 日用品</option>
              <option value="other">📦 その他</option>
            </select>

            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              max="999"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="メモ"
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {isSubmitting ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## 成果物

- ✅ Header, Container コンポーネント
- ✅ AddItemForm コンポーネント
- ✅ ShoppingItem コンポーネント
- ✅ CategoryFilter コンポーネント
- ✅ EditItemModal コンポーネント
- ✅ レスポンシブデザイン対応

---

## 検証コマンド

```bash
npm run dev
# 各コンポーネントがレンダリングされることを確認
```

---

## 次のPhase

Phase 5: Shopping Features (機能統合、アニメーション)

**コマンド**: `/next-ticket` で Phase 5 に進む

---

**作成日**: 2025-10-23
