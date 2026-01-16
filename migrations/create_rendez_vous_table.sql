-- Migration: Création de la table rendez_vous
-- Date: 2026-01-16
-- Description: Système de planification de rendez-vous

-- Créer le type enum pour le statut des RDV
CREATE TYPE statut_rdv AS ENUM ('planifie', 'confirme', 'reporte', 'annule', 'termine');

-- Créer la table rendez_vous
CREATE TABLE IF NOT EXISTS rendez_vous (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relation avec l'utilisateur (commercial)
  commercial_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informations du client
  entreprise TEXT NOT NULL,
  personne_contact TEXT NOT NULL,
  telephone TEXT,
  email TEXT,
  
  -- Localisation
  ville TEXT,
  zone TEXT,
  adresse TEXT,
  
  -- Informations du RDV
  date_rdv TIMESTAMPTZ NOT NULL,
  duree_estimee INTEGER DEFAULT 60, -- durée en minutes
  objet TEXT NOT NULL,
  description TEXT,
  
  -- Statut et suivi
  statut statut_rdv NOT NULL DEFAULT 'planifie',
  priorite TEXT CHECK (priorite IN ('basse', 'normale', 'haute', 'urgente')) DEFAULT 'normale',
  
  -- Rappel
  rappel_envoye BOOLEAN DEFAULT FALSE,
  rappel_date TIMESTAMPTZ,
  
  -- Résultat (après le RDV)
  compte_rendu TEXT,
  visite_id UUID REFERENCES visites(id) ON DELETE SET NULL, -- Lien vers la visite créée après le RDV
  
  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT date_rdv_future CHECK (date_rdv > created_at)
);

-- Index pour améliorer les performances
CREATE INDEX idx_rdv_commercial ON rendez_vous(commercial_id);
CREATE INDEX idx_rdv_date ON rendez_vous(date_rdv);
CREATE INDEX idx_rdv_statut ON rendez_vous(statut);
CREATE INDEX idx_rdv_entreprise ON rendez_vous(entreprise);
CREATE INDEX idx_rdv_ville_zone ON rendez_vous(ville, zone);

-- Index composite pour les requêtes courantes
CREATE INDEX idx_rdv_commercial_date ON rendez_vous(commercial_id, date_rdv);
CREATE INDEX idx_rdv_commercial_statut ON rendez_vous(commercial_id, statut);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_rendez_vous_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER trigger_update_rendez_vous_timestamp
  BEFORE UPDATE ON rendez_vous
  FOR EACH ROW
  EXECUTE FUNCTION update_rendez_vous_updated_at();

-- Politiques RLS (Row Level Security)
ALTER TABLE rendez_vous ENABLE ROW LEVEL SECURITY;

-- Les commerciaux peuvent voir leurs propres RDV
CREATE POLICY "Commerciaux peuvent voir leurs RDV"
  ON rendez_vous FOR SELECT
  USING (auth.uid() = commercial_id);

-- Les commerciaux peuvent créer leurs propres RDV
CREATE POLICY "Commerciaux peuvent créer des RDV"
  ON rendez_vous FOR INSERT
  WITH CHECK (auth.uid() = commercial_id);

-- Les commerciaux peuvent modifier leurs propres RDV
CREATE POLICY "Commerciaux peuvent modifier leurs RDV"
  ON rendez_vous FOR UPDATE
  USING (auth.uid() = commercial_id);

-- Les commerciaux peuvent supprimer leurs propres RDV
CREATE POLICY "Commerciaux peuvent supprimer leurs RDV"
  ON rendez_vous FOR DELETE
  USING (auth.uid() = commercial_id);

-- Les admins peuvent tout voir
CREATE POLICY "Admins peuvent tout voir"
  ON rendez_vous FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Les admins peuvent tout modifier
CREATE POLICY "Admins peuvent tout modifier"
  ON rendez_vous FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Commentaires pour documenter la table
COMMENT ON TABLE rendez_vous IS 'Table de gestion des rendez-vous commerciaux';
COMMENT ON COLUMN rendez_vous.duree_estimee IS 'Durée estimée du RDV en minutes';
COMMENT ON COLUMN rendez_vous.priorite IS 'Niveau de priorité du rendez-vous';
COMMENT ON COLUMN rendez_vous.rappel_envoye IS 'Indique si un rappel a été envoyé';
COMMENT ON COLUMN rendez_vous.compte_rendu IS 'Compte rendu après le RDV';
COMMENT ON COLUMN rendez_vous.visite_id IS 'Lien vers la visite créée suite au RDV';
