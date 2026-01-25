export type Urgence = 'basse' | 'normale' | 'haute';
export type StatutNote = 'à faire' | 'en cours' | 'terminé';

export interface VisiteNote {
  id: string;
  visite_id: string;
  user_id: string;
  content: string;
  urgence: Urgence;
  statut: StatutNote;
  created_at: string;
  updated_at: string;
}
