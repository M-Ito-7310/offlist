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
