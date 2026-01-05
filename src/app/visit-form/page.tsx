import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import VisitFormInteractive from './components/VisitFormInteractive';

export const metadata: Metadata = {
  title: 'Créer une Visite - SalesTracker Pro',
  description:
    'Créez et documentez vos visites clients avec notre système de suivi avancé. Interface multi-étapes avec recherche intelligente de clients, téléchargement de médias et validation en temps réel.',
};

export default function VisitFormPage() {
  return (
    <>
      <Header />
      <VisitFormInteractive />
    </>
  );
}