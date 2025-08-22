import React from 'react';
import { ShoppingItem } from '../types';

interface Props {
  item: ShoppingItem;
}

const SummaryItem: React.FC<Props> = ({ item }) => (
  <div className="flex justify-between py-1">
    <span>{item.name}</span>
    <span>{(item.price * item.quantity).toFixed(2)}</span>
  </div>
);

export default SummaryItem;
