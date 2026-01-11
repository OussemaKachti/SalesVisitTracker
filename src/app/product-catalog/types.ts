export type ProductFamily = 'SERRURES' | 'READER' | 'ETIQUETTES';

export interface Family {
  id: string;
  nom: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  nom: string;
  famille_id: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

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