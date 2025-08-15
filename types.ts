
export interface ShoppingItem {
  id: string;
  name: string;
  unit: string;
  icon?: string;
  quantity: number;
  price: number;
  purchased: boolean;
}

export type Unit = 'unidade' | 'kg' | 'litro' | 'pacote' | 'caixa' | 'dúzia' | 'pé' | 'frasco' | 'rolo';