
import { Unit } from './types';

interface PredefinedItem {
  name: string;
  unit: Unit;
  icon: string;
  iconClassName?: string;
}

export interface PredefinedCategory {
  categoryName: string;
  items: PredefinedItem[];
}

export const PREDEFINED_CATEGORIES: PredefinedCategory[] = [
  {
    categoryName: '🍚 Alimentos básicos',
    items: [
      // Grãos e Farinhas
      { name: 'Arroz', unit: 'kg', icon: '🍚' },
      { name: 'Feijão', unit: 'kg', icon: '🫘' },
      { name: 'Macarrão', unit: 'pacote', icon: '🍝' },
      { name: 'Farinha de Trigo', unit: 'kg', icon: '🌾' },
      { name: 'Farinha de Mandioca', unit: 'kg', icon: 'https://i.ibb.co/bj7SmD0j/50862c4c-24d3-4df0-bab1-4dd0fb51e272rafael-alves-removebg-preview.png' },
      // Temperos e Condimentos
      { name: 'Açúcar', unit: 'kg', icon: '🍬' },
      { name: 'Sal', unit: 'kg', icon: '🧂' },
      { name: 'Óleo de Soja', unit: 'litro', icon: 'https://i.ibb.co/QFcNSxBy/32333b94-a29c-4621-aa52-b3d384051969rafael-alves-removebg-preview.png' },
      { name: 'Azeite', unit: 'frasco', icon: 'https://cdn-icons-png.flaticon.com/512/6192/6192980.png' },
      { name: 'Vinagre', unit: 'frasco', icon: 'https://static.vecteezy.com/ti/vetor-gratis/p1/26114399-maca-vinagre-organico-desenho-animado-ilustracao-vetor.jpg' },
      { name: 'Temperos diversos', unit: 'unidade', icon: '🌿' },
       // Enlatados e Conservas
      { name: 'Molho de Tomate', unit: 'unidade', icon: '🥫' },
      { name: 'Enlatados: Milho', unit: 'unidade', icon: '🌽' },
      { name: 'Enlatados: Ervilha', unit: 'unidade', icon: '🫛' },
      { name: 'Azeitonas', unit: 'unidade', icon: '🫒' },
      // Laticínios e Derivados
      { name: 'Leite', unit: 'litro', icon: '🥛' },
      { name: 'Creme de Leite', unit: 'caixa', icon: 'https://i.ibb.co/whkbW1dq/Chat-GPT-Image-27-de-jul-de-2025-15-03-05-Copia-removebg-preview.png' },
      { name: 'Leite condensado', unit: 'caixa', icon: 'https://i.ibb.co/PzjFHMtd/Chat-GPT-Image-27-de-jul-de-2025-15-03-05-removebg-preview.png'},
      { name: 'Iogurte', unit: 'unidade', icon: 'https://i.ibb.co/nMBXsT8T/images-2-removebg-preview.png' },
      { name: 'Ovos', unit: 'dúzia', icon: '🥚' },
      { name: 'Margarina', unit: 'unidade', icon: '🧈' },
       // Café, Pães e Biscoitos
      { name: 'Café', unit: 'pacote', icon: '☕' },
      { name: 'Achocolatado em Pó', unit: 'unidade', icon: 'https://i.ibb.co/bj9kC2N3/fbfd19c5-189b-4f79-b4b9-edfa08f1d527rafael-alves-removebg-preview.png' },
      { name: 'Pão de Forma', unit: 'unidade', icon: '🍞' },
      { name: 'Pão Francês', unit: 'unidade', icon: '🥖' },
      { name: 'Biscoito', unit: 'pacote', icon: '🍪' },
    ],
  },
  {
    categoryName: '🍖 Carnes e proteínas',
    items: [
      { name: 'Carne Bovina', unit: 'kg', icon: '🥩' },
      { name: 'Frango', unit: 'kg', icon: '🍗' },
      { name: 'Linguiça', unit: 'kg', icon: 'https://i.ibb.co/HD5SWyCC/Captura-de-tela-2025-07-17-092233-removebg-preview.png', iconClassName: 'scale-125' },
      { name: 'Sardinha Enlatada', unit: 'unidade', icon: 'https://i.ibb.co/m5XR1dz4/Captura-de-tela-2025-07-17-120654-removebg-preview.png' },
      { name: 'Queijo', unit: 'kg', icon: '🧀' },
      { name: 'Presunto', unit: 'kg', icon: '🥓' },
    ],
  },
  {
    categoryName: '🥬 Hortifruti',
    items: [
      // Legumes e Verduras
      { name: 'Alface', unit: 'unidade', icon: '🥬' },
      { name: 'Batata', unit: 'kg', icon: '🥔' },
      { name: 'Beringela', unit: 'kg', icon: '🍆' },
      { name: 'Beterraba', unit: 'kg', icon: 'https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/1fadc.svg' },
      { name: 'Cebola', unit: 'kg', icon: '🧅' },
      { name: 'Cenoura', unit: 'kg', icon: '🥕' },
      { name: 'Tomate', unit: 'kg', icon: '🍅' },
      // Frutas
      { name: 'Banana', unit: 'kg', icon: '🍌' },
      { name: 'Laranja', unit: 'kg', icon: '🍊' },
      { name: 'Limão', unit: 'kg', icon: '🍋' },
      { name: 'Maçã', unit: 'kg', icon: '🍎' },
      { name: 'Uva', unit: 'kg', icon: '🍇' },
    ],
  },
  {
    categoryName: '🧼 Produtos de limpeza',
    items: [
      { name: 'Água Sanitária', unit: 'litro', icon: '🧴' },
      { name: 'Álcool', unit: 'litro', icon: '🧴' },
      { name: 'Amaciante para Roupas', unit: 'litro', icon: 'https://i.ibb.co/wh7LD8Kd/Gemini-Generated-Image-j8gvixj8gvixj8gv-removebg-preview.png' },
      { name: 'Desinfetante', unit: 'litro', icon: '🧴' },
      { name: 'Detergente', unit: 'unidade', icon: '🧴' },
      { name: 'Esponja de Lavar Louça', unit: 'unidade', icon: '🧽' },
      { name: 'Saco de lixo', unit: 'rolo', icon: '🗑️' },
      { name: 'Sabão em Barra', unit: 'unidade', icon: '🧼' },
      { name: 'Sabão em Pó', unit: 'pacote', icon: 'https://i.ibb.co/Hfp9pzzP/5312475e-326a-4a3f-936f-61f1b755ee5drafael-alves-removebg-preview.png' },
    ],
  },
  {
    categoryName: '🧴 Higiene pessoal',
    items: [
      { name: 'Absorventes', unit: 'pacote', icon: 'https://i.ibb.co/LXJKVQ5n/2586869-sexual-health-sanitary-pad-line-fill-blue-icon-gratis-vetor-removebg-preview.png' },
      { name: 'Algodão', unit: 'pacote', icon: '☁️' },
      { name: 'Aparelho de barbear', unit: 'unidade', icon: '🪒' },
      { name: 'Condicionador', unit: 'unidade', icon: '🧴' },
      { name: 'Desodorante', unit: 'unidade', icon: 'https://i.ibb.co/jPNHF10n/4116424c-f430-4cd7-9727-17a2280e91d2rafael-alves-removebg-preview.png' },
      { name: 'Papel Higiênico', unit: 'unidade', icon: '🧻' },
      { name: 'Pasta de Dente', unit: 'unidade', icon: 'https://i.ibb.co/KxkfRS8N/4c14e10f-4e56-4247-9fe5-e8f0678c3d9brafael-alves-removebg-preview.png' },
      { name: 'Sabonete', unit: 'unidade', icon: '🧼' },
      { name: 'Shampoo', unit: 'unidade', icon: '🧴' },
    ],
  },
];
