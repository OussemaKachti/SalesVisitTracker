'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import EmptyState from './EmptyState';
import ProductModal from './ProductModal';
import AdvancedFilterPanel from './AdvancedFilterPanel';
import Icon from '@/components/ui/AppIcon';
import { Product, Category, Family } from '../types';
import { fetchProducts, fetchFamilies, fetchCategories } from '../utils/api';
import { useAuth } from '@/hooks/useAuth';

const ITEMS_PER_PAGE = 12;

interface FilterState {
  families: string[];
  categories: string[];
  priceRange: [number, number];
  inStock: boolean | null;
  searchQuery: string;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'newest';
}

export default function ProductCatalogInteractive() {
  const { isAdmin } = useAuth();
  
  const [isHydrated, setIsHydrated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allFamilies, setAllFamilies] = useState<Family[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    families: [],
    categories: [],
    priceRange: [0, 10000],
    inStock: null,
    searchQuery: '',
    sortBy: 'name',
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Fetch products and categories from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch families and categories in parallel
        const [families, categories, products] = await Promise.all([
          fetchFamilies(),
          fetchCategories(),
          fetchProducts(),
        ]);
        
        console.log('📦 Familles chargées:', families);
        console.log('📁 Catégories chargées:', categories);
        console.log('🛒 Produits chargés:', products.length);
        
        setAllFamilies(families);
        setAllCategories(categories);
        setProducts(products);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setProducts([]);
        setAllFamilies([]);
        setAllCategories([]);
      } finally {
        setLoading(false);
        setIsHydrated(true);
      }
    };

    loadData();
  }, []);

  // Get category name from ID
  const getCategoryNameFromId = (id: string): string => {
    const category = allCategories.find(cat => cat.id === id);
    return category?.nom || id;
  };

  // Handle product save (create or update)
  const handleSaveProduct = async (formData: any) => {
    try {
      const url = editingProduct ? `/api/catalogue/produits/${editingProduct.id}` : '/api/catalogue/produits';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la sauvegarde');
      }

      // Refresh products
      const data = await fetchProducts();
      setProducts(data);
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error: any) {
      throw error;
    }
  };

  // Handle product delete
  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}"?`)) return;

    try {
      const response = await fetch(`/api/catalogue/produits/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      // Refresh products
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // 1. Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.reference.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // 2. Filter by families
    if (filters.families.length > 0) {
      filtered = filtered.filter((product) =>
        filters.families.some((familyId) => {
          // Product.family peut être un nom (SERRURES, READER, ETIQUETTES)
          // On doit le comparer avec le nom de la famille
          const family = allFamilies.find((f) => f.id === familyId);
          if (!family) return false;
          
          // Comparer le nom de la famille avec product.family
          const productFamilyName = product.family.toUpperCase();
          const familyName = family.nom.toUpperCase();
          
          return productFamilyName === familyName || 
                 productFamilyName.includes(familyName) || 
                 familyName.includes(productFamilyName);
        })
      );
    }

    // 3. Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.some((categoryId) => {
          // Product.category contient l'UUID de la catégorie (categorie_id)
          // On compare directement avec l'ID sélectionné
          return product.category === categoryId;
        })
      );
    }

    // 4. Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.priceTTC >= filters.priceRange[0] &&
        product.priceTTC <= filters.priceRange[1]
    );

    // 5. Filter by stock status
    if (filters.inStock !== null) {
      filtered = filtered.filter((product) => product.inStock === filters.inStock);
    }

    // 6. Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.priceTTC - b.priceTTC;
        case 'price-desc':
          return b.priceTTC - a.priceTTC;
        case 'newest':
          // Assuming products with 'Nouveau' badge or more recent are first
          if (a.badge === 'Nouveau' && b.badge !== 'Nouveau') return -1;
          if (a.badge !== 'Nouveau' && b.badge === 'Nouveau') return 1;
          return 0;
        case 'name':
        default:
          return a.name.localeCompare(b.name, 'fr');
      }
    });

    return filtered;
  }, [products, filters, allFamilies, allCategories]);

  // Pagination with filtered products
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filteredAndSortedProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    
    // Double-check for duplicates before rendering
    const seen = new Set<string>();
    return paginated.filter(product => {
      if (seen.has(product.id)) {
        return false;
      }
      seen.add(product.id);
      return true;
    });
  }, [filteredAndSortedProducts, currentPage]);

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="relative">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-accent/10 via-primary/5 to-warning/10 border-b border-border py-6 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground flex-1">
              Catalogue Produits
            </h1>
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <button
                onClick={() => setIsFilterPanelOpen(true)}
                className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-cta text-sm font-semibold transition-all duration-200 shadow-lg whitespace-nowrap group"
              >
                <Icon name="AdjustmentsHorizontalIcon" size={18} />
                <span>Filtres</span>
                {(filters.families.length > 0 ||
                  filters.categories.length > 0 ||
                  filters.searchQuery ||
                  filters.priceRange[0] !== 0 ||
                  filters.priceRange[1] !== 10000 ||
                  filters.inStock !== null) && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                    {filters.families.length +
                      filters.categories.length +
                      (filters.searchQuery ? 1 : 0) +
                      (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000 ? 1 : 0) +
                      (filters.inStock !== null ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-cta text-sm font-semibold transition-all duration-200 shadow-lg whitespace-nowrap"
              >
                <Icon name="PlusIcon" size={18} />
                Ajouter
              </button>
            )}
          </div>
        </div>

        <main className="px-4 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            {paginatedProducts?.length > 0 ? (
              <>
                <ProductGrid 
                  products={paginatedProducts}
                  isAdmin={isAdmin}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />

                {/* Beautiful Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 flex flex-col items-center gap-6">
                    {/* Page Navigation - Classic Style */}
                    <div className="flex items-center justify-center gap-2">
                      {/* Previous Button */}
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 rounded-lg text-sm font-cta transition-all duration-200 ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        ← Préc
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => {
                          const pageNum = i + 1;
                          const isCurrentPage = pageNum === currentPage;
                          const isVisible = Math.abs(pageNum - currentPage) <= 1 || pageNum === 1 || pageNum === totalPages;
                          
                          if (!isVisible) {
                            if (pageNum === currentPage - 2) {
                              return <span key="ellipsis-1" className="px-1 text-gray-400 text-sm">...</span>;
                            }
                            if (pageNum === currentPage + 2) {
                              return <span key="ellipsis-2" className="px-1 text-gray-400 text-sm">...</span>;
                            }
                            return null;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-7 h-7 rounded-md text-sm font-cta transition-all duration-200 ${
                                isCurrentPage
                                  ? 'bg-gray-800 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1.5 rounded-lg text-sm font-cta transition-all duration-200 ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Suiv →
                      </button>
                    </div>

                    {/* Results Summary - Subtle */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Affichage <span className="font-semibold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>-<span className="font-semibold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedProducts.length)}</span> sur <span className="font-semibold text-gray-700">{filteredAndSortedProducts.length}</span>
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptyState searchQuery={filters.searchQuery} />
            )}
          </div>
        </main>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        product={editingProduct || undefined}
        families={allFamilies}
        categories={allCategories}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />

      {/* Advanced Filter Panel */}
      <AdvancedFilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        families={allFamilies}
        categories={allCategories}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}