'use client';

import Icon from '@/components/ui/AppIcon';

interface EmptyStateProps {
  searchQuery: string;
}

export default function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-6 animate-pulse">
        <Icon name="MagnifyingGlassIcon" size={48} className="text-muted-foreground" />
      </div>
      
      <h3 className="text-2xl font-display font-bold text-foreground mb-3">
        Aucun produit trouvé
      </h3>
      
      <p className="text-muted-foreground font-body text-center max-w-md mb-6">
        {searchQuery 
          ? `Aucun résultat pour "${searchQuery}". Essayez avec d'autres mots-clés ou modifiez vos filtres.`
          : 'Aucun produit ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-success text-white font-cta font-semibold hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Réinitialiser les filtres
        </button>
        <button className="px-6 py-3 rounded-xl border-2 border-secondary text-secondary font-cta font-semibold hover:bg-secondary hover:text-white transition-all duration-300">
          Voir tous les produits
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="mt-12 grid grid-cols-3 gap-4 max-w-md w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-muted/30 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
        ))}
      </div>
    </div>
  );
}