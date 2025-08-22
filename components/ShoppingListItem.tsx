import React from 'react';
import { ShoppingItem } from '../types';

interface Props {
  item: ShoppingItem;
  onUpdate: (item: ShoppingItem) => void;
  onRemove: (id: string) => void;
}

const ShoppingListItem: React.FC<Props> = ({ item, onUpdate, onRemove }) => (
  <div className="flex justify-between items-center p-2 border rounded">
    <span className={item.purchased ? 'line-through text-gray-500' : ''}>{item.name}</span>
    <div className="space-x-2">
      <button
        className="px-2 py-1 bg-green-600 text-white rounded"
        onClick={() => onUpdate({ ...item, purchased: !item.purchased })}
      >
        {item.purchased ? 'Desmarcar' : 'Comprar'}
      </button>
      <button
        className="px-2 py-1 bg-red-600 text-white rounded"
        onClick={() => onRemove(item.id)}
      >
        Remover
      </button>
    </div>
  </div>
);

export default ShoppingListItem;
