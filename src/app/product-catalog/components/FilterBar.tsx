'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { ProductFamily } from '../types';

interface FilterBarProps {
  selectedFamily: ProductFamily | 'ALL';
  selectedCategory: string;
  searchQuery: string;
  priceRange: [number, number];
  availableCategories: Array<{ nom: string; id: string; count: number }>;
  resultCount: number;
  onFamilyChange: (family: ProductFamily | 'ALL') => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  onPriceChange: (range: [number, number]) => void;
}

export default function FilterBar({
  selectedFamily,
  selectedCategory,
  searchQuery,
  priceRange,
  availableCategories,
  resultCount,
  onFamilyChange,
  onCategoryChange,
  onSearchChange,
  onPriceChange,
}: FilterBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const families: Array<{ value: ProductFamily | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'Tous' },
    { value: 'SERRURES', label: 'Serrures' },
    { value: 'READER', label: 'Lecteurs' },
    { value: 'ETIQUETTES', label: 'Étiquettes' },
  ];

  const activeFiltersCount = [
    selectedFamily !== 'ALL' ? 1 : 0,
    selectedCategory !== 'ALL' ? 1 : 0,
    priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0,
    searchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleReset = () => {
    onFamilyChange('ALL');
    onCategoryChange('ALL');
    onSearchChange('');
    onPriceChange([0, 10000]);
    setIsFilterOpen(false);
  };

  return (
    <>
      {/* Search Bar - Fixed at top */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 font-cta text-sm transition-all duration-200"
            >
              <Icon name="AdjustmentsHorizontalIcon" size={18} />
              <span>Filtres</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-700 text-white text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Search Input */}
            <div className="flex-1 relative">
              <Icon
                name="MagnifyingGlassIcon"
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-background border border-border text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
              />
            </div>

            {/* Results Count */}
            <div className="text-right px-3">
              <div className="text-sm font-cta font-bold text-foreground">
                {resultCount}
              </div>
              <div className="text-xs text-muted-foreground">résultats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal Overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-screen max-w-sm rounded-2xl shadow-2xl border border-gray-300 z-50 p-6 animate-in fade-in slide-in-from-top-2 duration-200 bg-white" >
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h3 className="text-lg font-display font-bold text-gray-900">
                Filtres
              </h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            {/* Famille */}
            <div className="space-y-2">
              <label className="block text-xs font-cta font-semibold text-gray-900">
                Famille
              </label>
              <div className="space-y-2">
                {families.map((family) => (
                  <button
                    key={family.value}
                    onClick={() => {
                      onFamilyChange(family.value);
                      onCategoryChange('ALL');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg font-body text-sm transition-all duration-300 ${
                      selectedFamily === family.value
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {family.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <label className="block text-xs font-cta font-semibold text-gray-900">
                Catégorie
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => onCategoryChange('ALL')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-body text-sm transition-all duration-300 ${
                    selectedCategory === 'ALL'
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Toutes
                </button>
                {availableCategories.length > 0 ? (
                  availableCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onCategoryChange(category.nom)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg font-body text-sm transition-all duration-300 flex justify-between items-center ${
                        selectedCategory === category.nom
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      <span>{category.nom}</span>
                      <span className={`text-xs font-semibold ${
                        selectedCategory === category.nom ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        ({category.count})
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-3 text-gray-500 text-sm">
                    Aucune catégorie disponible
                  </div>
                )}
              </div>
            </div>

            {/* Prix */}
            <div className="space-y-2">
              <label className="block text-xs font-cta font-semibold text-gray-900">
                Prix (DT)
              </label>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-600">Min</span>
                    <span className="text-sm font-bold text-gray-900">{priceRange[0]} DT</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      if (newMin <= priceRange[1]) {
                        onPriceChange([newMin, priceRange[1]]);
                      }
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-600">Max</span>
                    <span className="text-sm font-bold text-gray-900">{priceRange[1]} DT</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      if (newMax >= priceRange[0]) {
                        onPriceChange([priceRange[0], newMax]);
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-cta text-sm transition-colors"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-cta text-sm transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}