# Phase 5: Shopping Features

**Priority**: 🔴 Critical (MVP必須)
**Estimated Time**: 90-120 minutes
**Status**: ⬜ Not Started
**Prerequisites**: Phase 1-4完了

---

## 概要

すべてのコンポーネントを統合し、買い物リストアプリのコア機能を完成させます。アニメーション、完了アイテム管理、オフライン動作確認を行います。

**Goal**: 完全に動作する買い物リストアプリ(MVP)

---

## タスクチェックリスト

### Task 5.1: メインページ統合 (40分)

- [x] `src/app/page.tsx` にすべてのコンポーネントを統合
- [x] 状態管理 (useState, useEffect)
- [x] CRUD操作の統合
- [x] カテゴリーフィルター機能
- [x] 完了アイテムの表示/非表示切り替え

**ファイル**: `src/app/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { ShoppingItem, Category } from '@/types';
import { getAllItems, toggleItemChecked, deleteItem, deleteCheckedItems } from '@/lib/db';
import Header from '@/components/Header';
import AddItemForm from '@/components/AddItemForm';
import ShoppingItemComponent from '@/components/ShoppingItem';
import CategoryFilter from '@/components/CategoryFilter';
import EditItemModal from '@/components/EditItemModal';

export default function Home() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ShoppingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadItems = async () => {
    try {
      const allItems = await getAllItems();
      setItems(allItems);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    let filtered = items;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Show/hide completed
    if (!showCompleted) {
      filtered = filtered.filter((item) => !item.checked);
    }

    setFilteredItems(filtered);
  }, [items, selectedCategory, showCompleted]);

  const handleToggleCheck = async (id: string) => {
    try {
      await toggleItemChecked(id);
      await loadItems();
    } catch (error) {
      console.error('Failed to toggle check:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このアイテムを削除しますか?')) return;
    try {
      await deleteItem(id);
      await loadItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleDeleteChecked = async () => {
    const checkedCount = items.filter((item) => item.checked).length;
    if (checkedCount === 0) {
      alert('完了済みアイテムがありません');
      return;
    }
    if (!confirm(`${checkedCount}件の完了済みアイテムを削除しますか?`)) return;

    try {
      await deleteCheckedItems();
      await loadItems();
    } catch (error) {
      console.error('Failed to delete checked items:', error);
    }
  };

  const uncheckedCount = items.filter((item) => !item.checked).length;
  const checkedCount = items.filter((item) => item.checked).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <Header />

      <main className="max-w-2xl mx-auto p-4">
        <AddItemForm onItemAdded={loadItems} />

        <CategoryFilter selectedCategory={selectedCategory} onFilterChange={setSelectedCategory} />

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            未完了: {uncheckedCount} 件 / 完了: {checkedCount} 件
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="text-sm text-primary hover:underline"
            >
              {showCompleted ? '完了済みを非表示' : '完了済みを表示'}
            </button>
            {checkedCount > 0 && (
              <button
                onClick={handleDeleteChecked}
                className="text-sm text-danger hover:underline"
              >
                完了済みを削除
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>アイテムがありません</p>
              <p className="text-sm mt-2">上のフォームから追加してください</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <ShoppingItemComponent
                key={item.id}
                item={item}
                onToggleCheck={handleToggleCheck}
                onEdit={setEditingItem}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>

      <EditItemModal
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onItemUpdated={loadItems}
      />
    </div>
  );
}
```

---

### Task 5.2: アニメーション追加 (20分)

- [x] アイテム追加時のフェードイン
- [x] アイテム削除時のフェードアウト
- [x] チェック時のアニメーション

**Tailwind CSSトランジション追加**:

```tsx
// ShoppingItem.tsx に追加
<div
  className={`bg-white rounded-lg shadow-sm p-4 mb-2 transition-all duration-300 ${
    item.checked ? 'opacity-60 scale-95' : 'opacity-100 scale-100'
  }`}
>
```

**アニメーションCSS追加** (`src/app/globals.css`):

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-fadeOut {
  animation: fadeOut 0.3s ease-in-out;
}
```

---

### Task 5.3: オフライン動作確認 (20分)

- [x] DevToolsでオフラインモードに切り替え
- [x] アイテムの追加・編集・削除が動作することを確認
- [x] ページリロード後もデータが保持されることを確認
- [x] Service Workerでページがキャッシュされることを確認

**確認手順**:
1. `npm run build && npm run start` でプロダクションビルドを起動
2. DevTools → Network → Offline
3. ページをリロード (キャッシュから表示される)
4. アイテムを追加・編集・削除 (IndexedDBで動作)
5. オンラインに戻す

---

### Task 5.4: エラーハンドリング強化 (15分)

- [x] ネットワークエラー時のユーザーフィードバック
- [x] IndexedDBエラー時の再試行ロジック
- [x] トースト通知 (オプション)

**簡易エラー表示追加**:

```tsx
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  if (error) {
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }
}, [error]);

// UI
{error && (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-danger text-white px-4 py-2 rounded-lg shadow-lg z-50">
    {error}
  </div>
)}
```

---

### Task 5.5: パフォーマンス最適化 (15分)

- [x] useCallbackでコールバック関数をメモ化
- [x] useMemoでフィルタリング結果をメモ化
- [x] 不要な再レンダリングを削減

```tsx
import { useMemo, useCallback } from 'react';

const handleToggleCheck = useCallback(async (id: string) => {
  // ...
}, []);

const filteredItems = useMemo(() => {
  let filtered = items;
  if (selectedCategory !== 'all') {
    filtered = filtered.filter((item) => item.category === selectedCategory);
  }
  if (!showCompleted) {
    filtered = filtered.filter((item) => !item.checked);
  }
  return filtered;
}, [items, selectedCategory, showCompleted]);
```

---

### Task 5.6: 最終動作確認 (10分)

- [x] すべての機能が動作
- [x] オフラインで完全動作
- [x] レスポンシブデザイン確認 (モバイル/タブレット/デスクトップ)
- [x] ブラウザコンソールにエラーなし

**確認項目**:
- ✅ アイテム追加
- ✅ アイテム編集
- ✅ アイテム削除
- ✅ チェック機能
- ✅ カテゴリーフィルター
- ✅ 完了アイテム表示/非表示
- ✅ 完了アイテム一括削除
- ✅ オフライン動作
- ✅ データ永続化

---

## 成果物

- ✅ 完全統合されたメインページ
- ✅ すべてのCRUD操作が動作
- ✅ アニメーション実装
- ✅ オフライン完全動作
- ✅ エラーハンドリング実装
- ✅ パフォーマンス最適化

---

## 検証コマンド

```bash
npm run build
npm run start
# http://localhost:3000 で確認
# DevTools → Network → Offline で確認
```

**合格基準**:
- すべての機能が動作
- オフラインで完全動作
- エラーが発生しない

---

## 次のPhase

Phase 6: Deployment (ビルド最適化、Lighthouse、Vercelデプロイ)

**コマンド**: `/next-ticket` で Phase 6 に進む

---

**関連ドキュメント**:
- [docs/idea/03-feature-specifications.md](../../idea/03-feature-specifications.md)
- [docs/implementation/20251023_00-overview.md](../../implementation/20251023_00-overview.md)

**作成日**: 2025-10-23
