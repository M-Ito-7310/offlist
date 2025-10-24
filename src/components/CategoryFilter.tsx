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
