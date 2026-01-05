import type { Metadata } from 'next';
import LoginInteractive from './components/LoginInteractive';

export const metadata: Metadata = {
  title: 'Connexion - SalesTracker Pro',
  description: 'Connectez-vous à SalesTracker Pro pour accéder à votre plateforme de gestion des visites commerciales avec des analyses avancées et un suivi en temps réel.',
};

export default function LoginPage() {
  return <LoginInteractive />;
}