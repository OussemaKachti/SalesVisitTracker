export type ProductFamily = 'SERRURES' | 'READER' | 'ETIQUETTES';

export interface Product {
  id: string;
  name: string;
  reference: string;
  description: string;
  family: ProductFamily;
  category: string;
  frequency: string;
  priceTTC: number;
  priceHT: number;
  oldPrice?: number;
  image: string;
  alt: string;
  badge?: 'Nouveau' | 'Populaire';
  inStock: boolean;
}