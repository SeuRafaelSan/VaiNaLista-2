import React from 'react';
import { Unit } from '../types';

interface ItemCardProps {
  item: { name: string; unit?: Unit; icon?: string };
  onAdd: (name: string, unit: Unit, icon?: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onAdd }) => (
  <button
    className="w-full p-2 border rounded flex items-center gap-2 hover:bg-gray-50"
    onClick={() => onAdd(item.name, item.unit || 'unidade', item.icon)}
  >
    {item.icon && <span>{item.icon}</span>}
    <span>{item.name}</span>
  </button>
);

export default ItemCard;
