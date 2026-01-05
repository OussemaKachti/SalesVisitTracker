import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import DashboardInteractive from './components/DashboardInteractive';

export const metadata: Metadata = {
  title: 'Tableau de Bord - SalesTracker Pro',
  description: 'Centre d\'analyse complet avec graphiques 3D interactifs, cartes KPI en temps réel, cartographie géographique et disposition de widgets personnalisables pour la gestion des visites commerciales.',
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <DashboardInteractive />
    </>
  );
}