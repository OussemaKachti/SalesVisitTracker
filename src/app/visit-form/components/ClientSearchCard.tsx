import { useState } from 'react';
import Icon from '../../../components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  image: string;
  alt: string;
  lastVisit: string;
  totalVisits: number;
}

interface ClientSearchCardProps {
  onClientSelect: (client: Client) => void;
  selectedClient: Client | null;
}

const ClientSearchCard = ({ onClientSelect, selectedClient }: ClientSearchCardProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const mockClients: Client[] = [
  {
    id: 1,
    name: 'Sophie Dubois',
    company: 'TechVision France',
    email: 'sophie.dubois@techvision.fr',
    phone: '+33 1 42 86 82 00',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ffde516e-1763293580273.png",
    alt: 'Professional woman with brown hair in navy blazer smiling at camera in modern office',
    lastVisit: '15/12/2025',
    totalVisits: 12
  },
  {
    id: 2,
    name: 'Marc Lefebvre',
    company: 'Innovation Solutions',
    email: 'marc.lefebvre@innovation.fr',
    phone: '+33 1 45 67 89 12',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ba34aa03-1763294059493.png",
    alt: 'Business professional man with short dark hair in gray suit against white background',
    lastVisit: '20/12/2025',
    totalVisits: 8
  },
  {
    id: 3,
    name: 'Claire Martin',
    company: 'Digital Dynamics',
    email: 'claire.martin@digitaldynamics.fr',
    phone: '+33 1 56 78 90 23',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_15e720b9e-1763300944705.png",
    alt: 'Young professional woman with blonde hair in white blouse smiling in bright office',
    lastVisit: '18/12/2025',
    totalVisits: 15
  },
  {
    id: 4,
    name: 'Thomas Bernard',
    company: 'Enterprise Systems',
    email: 'thomas.bernard@enterprise.fr',
    phone: '+33 1 67 89 01 34',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_167e1c7b3-1763294189580.png",
    alt: 'Confident businessman with glasses in dark suit standing in corporate environment',
    lastVisit: '22/12/2025',
    totalVisits: 10
  }];


  const filteredClients = mockClients.filter(
    (client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 300);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon
            name="MagnifyingGlassIcon"
            size={20}
            className={`transition-colors duration-300 ${
            isSearching ? 'text-accent' : 'text-muted-foreground'}`
            } />

        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Rechercher un client par nom, entreprise ou email..."
          className="w-full pl-12 pr-4 py-4 bg-card border-2 border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all duration-300 font-body" />

        {searchQuery &&
        <button
          onClick={() => handleSearch('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors">

            <Icon name="XMarkIcon" size={20} />
          </button>
        }
      </div>

      {/* Selected Client Display */}
      {selectedClient &&
      <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <Icon name="CheckCircleIcon" size={24} className="text-primary" />
              Client Sélectionné
            </h3>
            <button
            onClick={() => onClientSelect(null as any)}
            className="text-sm font-cta font-medium text-error hover:text-error/80 transition-colors">

              Changer
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary/30">
              <AppImage
              src={selectedClient.image}
              alt={selectedClient.alt}
              className="w-full h-full object-cover" />

            </div>
            <div className="flex-1">
              <h4 className="text-lg font-display font-bold text-foreground">
                {selectedClient.name}
              </h4>
              <p className="text-sm text-muted-foreground font-body">{selectedClient.company}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">
                {selectedClient.email}
              </p>
            </div>
          </div>
        </div>
      }

      {/* Client List */}
      {!selectedClient &&
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {filteredClients.length > 0 ?
        filteredClients.map((client) =>
        <button
          key={client.id}
          onClick={() => onClientSelect(client)}
          className="w-full p-4 bg-card border-2 border-border rounded-xl hover:border-accent hover:shadow-elevated transition-all duration-300 transform hover:scale-[1.02] group">

                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-accent transition-all duration-300">
                    <AppImage
                src={client.image}
                alt={client.alt}
                className="w-full h-full object-cover" />

                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-base font-display font-bold text-foreground group-hover:text-accent transition-colors">
                      {client.name}
                    </h4>
                    <p className="text-sm text-muted-foreground font-body">{client.company}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                        <Icon name="CalendarIcon" size={14} />
                        Dernière visite: {client.lastVisit}
                      </span>
                      <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                        <Icon name="ChartBarIcon" size={14} />
                        {client.totalVisits} visites
                      </span>
                    </div>
                  </div>
                  <Icon
              name="ChevronRightIcon"
              size={20}
              className="text-muted-foreground group-hover:text-accent transition-colors" />

                </div>
              </button>
        ) :

        <div className="text-center py-12">
              <Icon name="UserGroupIcon" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-body">
                Aucun client trouvé pour "{searchQuery}"
              </p>
            </div>
        }
        </div>
      }
    </div>);

};

export default ClientSearchCard;