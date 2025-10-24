'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ShoppingItem, Category } from '@/types';
import { getAllItems, toggleItemChecked, deleteItem, deleteCheckedItems } from '@/lib/db';
import Header from '@/components/Header';
import AddItemForm from '@/components/AddItemForm';
import ShoppingItemComponent from '@/components/ShoppingItem';
import CategoryFilter from '@/components/CategoryFilter';
import EditItemModal from '@/components/EditItemModal';

export default function Home() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadItems = useCallback(async () => {
    try {
      const allItems = await getAllItems();
      setItems(allItems);
    } catch (error) {
      console.error('Failed to load items:', error);
      setError('アイテムの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Show/hide completed
    if (!showCompleted) {
      filtered = filtered.filter((item) => !item.checked);
    }

    return filtered;
  }, [items, selectedCategory, showCompleted]);

  const handleToggleCheck = useCallback(async (id: string) => {
    try {
      await toggleItemChecked(id);
      await loadItems();
    } catch (error) {
      console.error('Failed to toggle check:', error);
      setError('チェック状態の変更に失敗しました');
    }
  }, [loadItems]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('このアイテムを削除しますか?')) return;
    try {
      await deleteItem(id);
      await loadItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
      setError('アイテムの削除に失敗しました');
    }
  }, [loadItems]);

  const handleDeleteChecked = useCallback(async () => {
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
      setError('完了済みアイテムの削除に失敗しました');
    }
  }, [items, loadItems]);

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
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-danger text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}
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
