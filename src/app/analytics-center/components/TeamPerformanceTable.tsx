'use client';


import AppImage from '@/components/ui/AppImage';

interface TeamMember {
  id: number;
  name: string;
  image: string;
  alt: string;
  visits: number;
  conversions: number;
  revenue: number;
  performance: number;
}

interface TeamPerformanceTableProps {
  data: TeamMember[];
}

export default function TeamPerformanceTable({ data }: TeamPerformanceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 px-4 text-sm font-cta font-semibold text-muted-foreground">
              Membre de l'équipe
            </th>
            <th className="text-center py-4 px-4 text-sm font-cta font-semibold text-muted-foreground">
              Visites
            </th>
            <th className="text-center py-4 px-4 text-sm font-cta font-semibold text-muted-foreground">
              Conversions
            </th>
            <th className="text-center py-4 px-4 text-sm font-cta font-semibold text-muted-foreground">
              Chiffre d'affaires
            </th>
            <th className="text-center py-4 px-4 text-sm font-cta font-semibold text-muted-foreground">
              Performance
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((member) => (
            <tr key={member.id} className="border-b border-border hover:bg-muted/50 transition-smooth">
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <AppImage
                      src={member.image}
                      alt={member.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-body font-medium text-foreground">{member.name}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-sm font-body text-foreground">{member.visits}</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-sm font-body text-foreground">{member.conversions}</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-sm font-body font-semibold text-foreground">{member.revenue}k€</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        member.performance >= 80
                          ? 'bg-success'
                          : member.performance >= 60
                          ? 'bg-warning' :'bg-error'
                      }`}
                      style={{ width: `${member.performance}%` }}
                    />
                  </div>
                  <span className="text-sm font-cta font-semibold text-foreground">{member.performance}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}