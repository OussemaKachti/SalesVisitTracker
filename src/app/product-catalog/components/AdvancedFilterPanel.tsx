'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { Family, Category } from '../types';

interface FilterState {
  families: string[];
  categories: string[];
  priceRange: [number, number];
  inStock: boolean | null;
  searchQuery: string;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'newest';
}

interface AdvancedFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  families: Family[];
  categories: Category[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const SORT_OPTIONS = [
  { value: 'name', label: 'Nom (A-Z)' },
  { value: 'price-asc', label: 'Prix (Croissant)' },
  { value: 'price-desc', label: 'Prix (Décroissant)' },
  { value: 'newest', label: 'Plus récent' },
];

export default function AdvancedFilterPanel({
  isOpen,
  onClose,
  families,
  categories,
  filters,
  onFiltersChange,
}: AdvancedFilterPanelProps) {
  console.log('🎨 FilterPanel - Familles reçues:', families);
  console.log('🎨 FilterPanel - Catégories reçues:', categories);
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['families', 'categories', 'price', 'stock', 'sort'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleFamilyToggle = (familyId: string) => {
    const newFamilies = filters.families.includes(familyId)
      ? filters.families.filter(id => id !== familyId)
      : [...filters.families, familyId];
    onFiltersChange({ ...filters, families: newFamilies });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleReset = () => {
    onFiltersChange({
      families: [],
      categories: [],
      priceRange: [0, 10000],
      inStock: null,
      searchQuery: '',
      sortBy: 'name',
    });
  };

  const activeFiltersCount =
    filters.families.length +
    filters.categories.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000 ? 1 : 0) +
    (filters.inStock !== null ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Filter Panel - Slide in from right */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Icon name="AdjustmentsHorizontalIcon" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-gray-900">Filtres</h2>
              {activeFiltersCount > 0 && (
                <p className="text-xs text-gray-500">{activeFiltersCount} filtre(s) actif(s)</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white transition-colors"
          >
            <Icon name="XMarkIcon" size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-cta font-semibold text-gray-900 mb-3">
              Recherche
            </label>
            <div className="relative">
              <Icon
                name="MagnifyingGlassIcon"
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) =>
                  onFiltersChange({ ...filters, searchQuery: e.target.value })
                }
                placeholder="Rechercher..."
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Families Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('families')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-cta font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="TagIcon" size={16} />
                Familles ({families.length})
              </span>
              <Icon
                name="ChevronDownIcon"
                size={16}
                className={`text-gray-600 transition-transform ${
                  expandedSections.has('families') ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.has('families') && (
              <div className="p-4 space-y-2 bg-white border-t border-gray-200">
                {families.length > 0 ? (
                  families.map((family) => (
                    <label
                      key={family.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.families.includes(family.id)}
                        onChange={() => handleFamilyToggle(family.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        {family.nom}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-2">Aucune famille disponible</p>
                )}
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-cta font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="FolderIcon" size={16} />
                Catégories ({categories.length})
              </span>
              <Icon
                name="ChevronDownIcon"
                size={16}
                className={`text-gray-600 transition-transform ${
                  expandedSections.has('categories') ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.has('categories') && (
              <div className="p-4 space-y-2 bg-white border-t border-gray-200 max-h-48 overflow-y-auto">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        {category.nom}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-2">Aucune catégorie disponible</p>
                )}
              </div>
            )}
          </div>

          {/* Price Range Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-cta font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="BanknotesIcon" size={16} />
                Prix
              </span>
              <Icon
                name="ChevronDownIcon"
                size={16}
                className={`text-gray-600 transition-transform ${
                  expandedSections.has('price') ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.has('price') && (
              <div className="p-4 space-y-4 bg-white border-t border-gray-200">
                {/* Price Range Display */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-cta font-semibold text-gray-600">PLAGE DE PRIX</span>
                    <span className="text-sm font-bold text-gray-900">
                      {filters.priceRange[0]} DT - {filters.priceRange[1]} DT
                    </span>
                  </div>
                </div>

                {/* Min Price */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-cta font-semibold text-gray-900">
                      Prix minimum
                    </label>
                    <span className="text-sm font-bold text-blue-600">
                      {filters.priceRange[0]} DT
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="50"
                    value={filters.priceRange[0]}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      if (newMin <= filters.priceRange[1]) {
                        onFiltersChange({
                          ...filters,
                          priceRange: [newMin, filters.priceRange[1]],
                        });
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-cta font-semibold text-gray-900">
                      Prix maximum
                    </label>
                    <span className="text-sm font-bold text-blue-600">
                      {filters.priceRange[1]} DT
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="50"
                    value={filters.priceRange[1]}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value);
                      if (newMax >= filters.priceRange[0]) {
                        onFiltersChange({
                          ...filters,
                          priceRange: [filters.priceRange[0], newMax],
                        });
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stock Status Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('stock')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-cta font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="CheckCircleIcon" size={16} />
                Disponibilité
              </span>
              <Icon
                name="ChevronDownIcon"
                size={16}
                className={`text-gray-600 transition-transform ${
                  expandedSections.has('stock') ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.has('stock') && (
              <div className="p-4 space-y-2 bg-white border-t border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="stock"
                    checked={filters.inStock === null}
                    onChange={() => onFiltersChange({ ...filters, inStock: null })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    Tous
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="stock"
                    checked={filters.inStock === true}
                    onChange={() => onFiltersChange({ ...filters, inStock: true })}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    En stock
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="stock"
                    checked={filters.inStock === false}
                    onChange={() => onFiltersChange({ ...filters, inStock: false })}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Rupture de stock
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Sort Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('sort')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-cta font-semibold text-gray-900 flex items-center gap-2">
                <Icon name="ArrowsUpDownIcon" size={16} />
                Tri
              </span>
              <Icon
                name="ChevronDownIcon"
                size={16}
                className={`text-gray-600 transition-transform ${
                  expandedSections.has('sort') ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSections.has('sort') && (
              <div className="p-4 space-y-2 bg-white border-t border-gray-200">
                {SORT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="sort"
                      checked={filters.sortBy === option.value}
                      onChange={() =>
                        onFiltersChange({
                          ...filters,
                          sortBy: option.value as any,
                        })
                      }
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 to-transparent border-t border-gray-200 p-6 space-y-3">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-cta text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Icon name="ArrowPathIcon" size={16} />
            Réinitialiser tous les filtres
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-cta text-sm font-semibold transition-all duration-200 shadow-lg"
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </>
  );
}
