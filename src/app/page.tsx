'use client';

import { useEffect } from 'react';
import { addItem, getAllItems } from '@/lib/db';

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
