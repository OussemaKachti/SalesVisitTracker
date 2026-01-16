-- Migration: Ajout du champ ZONE à la table visites
-- Date: 2026-01-16
-- Description: Ajoute une colonne 'zone' pour préciser la localisation géographique

-- Ajouter la colonne zone
ALTER TABLE visites 
ADD COLUMN IF NOT EXISTS zone TEXT;

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN visites.zone IS 'Zone géographique précise (ex: Douar Hicher, Centre-ville, etc.)';

-- Créer un index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_visites_zone ON visites(zone);

-- Créer un index composite pour les recherches ville + zone
CREATE INDEX IF NOT EXISTS idx_visites_ville_zone ON visites(ville, zone);
