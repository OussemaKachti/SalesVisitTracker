export type Role = 'commercial' | 'admin' | 'consultant'
export type StatutVisite = 'a_faire' | 'en_cours' | 'termine'
export type StatutAction = 'en_attente' | 'accepte' | 'refuse'

export interface Profile {
  id: string
  email: string
  nom: string
  prenom: string
  role: Role
  telephone: string | null
  created_at: string
  updated_at: string
}

export interface Visite {
  id: string
  commercial_id: string
  commercial_name?: string
  
  // Client
  entreprise: string
  personne_rencontree: string
  fonction_poste: string | null
  ville: string | null
  zone: string | null
  adresse: string | null
  tel_fixe: string | null
  mobile: string | null
  email: string | null
  
  // Visite
  date_visite: string
  objet_visite: string
  provenance_contact: string | null
  interet_client: string | null
  actions_a_entreprendre: string | null
  montant: number | null
  date_prochaine_action: string | null
  remarques: string | null
  probabilite: number | null
  
  // Statuts
  statut_visite: StatutVisite
  statut_action: StatutAction
  
  // Système
  created_at: string
  updated_at: string
  
  // Relations
  commercial?: Profile
}

export interface VisiteFormData {
  entreprise: string
  personne_rencontree: string
  fonction_poste?: string
  ville?: string
  zone?: string
  adresse?: string
  tel_fixe?: string
  mobile?: string
  email?: string
  date_visite: string
  objet_visite: string
  provenance_contact?: string
  interet_client?: string
  actions_a_entreprendre?: string
  montant?: number
  date_prochaine_action?: string
  remarques?: string
  probabilite?: number
  statut_visite: StatutVisite
  statut_action?: StatutAction
}

export interface DoublonCheck {
  existe: boolean
  derniere_visite_id: string | null
  derniere_date: string | null
  commercial_nom: string | null
  jours_depuis_visite: number | null
}

export interface StatsVisites {
  total_visites: number
  visites_a_faire: number
  visites_en_cours: number
  visites_terminees: number
  visites_acceptees: number
  visites_refusees: number
  montant_total: number
  probabilite_moyenne: number
}

export interface EquipeMember extends Profile {
  total_visites: number
  visites_semaine?: number
  visites_mois?: number
}

// Types pour le catalogue produits
export interface FamilleProduire {
  id: string;
  nom: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface CategorieProduire {
  id: string;
  nom: string;
  famille_id: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Produit {
  id: string;
  designation: string;
  reference: string;
  famille_id: string;
  categorie_id: string;
  frequence?: string;
  prix_ht: number;
  prix_ttc: number;
  tva_pct?: number;
  description?: string;
  stock?: number;
  image_url?: string;
  images_urls?: string[];
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface VisiteProduit {
  id: string;
  visite_id: string;
  produit_id: string;
  quantite: number;
  prix_unitaire_ht?: number;
  interet_client?: 'faible' | 'moyen' | 'fort';
  created_at: string;
}

// Types pour les rendez-vous
export type StatutRdv = 'planifie' | 'confirme' | 'reporte' | 'annule' | 'termine'
export type PrioriteRdv = 'basse' | 'normale' | 'haute' | 'urgente'

export interface RendezVous {
  id: string
  commercial_id: string
  commercial_name?: string
  
  // Client
  entreprise: string
  personne_contact: string
  telephone: string | null
  email: string | null
  
  // Localisation
  ville: string | null
  zone: string | null
  adresse: string | null
  
  // RDV
  date_rdv: string
  duree_estimee: number
  objet: string
  description: string | null
  
  // Statut
  statut: StatutRdv
  priorite: PrioriteRdv
  
  // Rappel
  rappel_envoye: boolean
  rappel_date: string | null
  
  // Résultat
  compte_rendu: string | null
  visite_id: string | null
  
  // Système
  created_at: string
  updated_at: string
  
  // Relations
  commercial?: Profile
  visite?: Visite
}

export interface RendezVousFormData {
  entreprise: string
  personne_contact: string
  fonction_contact?: string
  tel_contact?: string
  email_contact?: string
  date_rdv: string
  heure_debut: string
  heure_fin?: string
  lieu?: string
  objet?: string
  description?: string
  statut_rdv?: StatutRdv
  priorite?: PrioriteRdv
  rappel_avant?: number | null
  visite_id?: string
}

