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
