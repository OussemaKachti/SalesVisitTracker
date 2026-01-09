'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Stagger animation: show products with delay
    setVisibleProducts([]);
    products.forEach((product, index) => {
      setTimeout(() => {
        setVisibleProducts((prev) => [...prev, product]);
      }, index * 50); // 50ms stagger delay
    });
  }, [products]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {visibleProducts.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}