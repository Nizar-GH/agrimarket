-- AgriMarket local PostgreSQL init script
-- Compatible with the Spring Boot backend models in this repository.

DROP TABLE IF EXISTS paiement CASCADE;
DROP TABLE IF EXISTS livraison CASCADE;
DROP TABLE IF EXISTS ligne_commande CASCADE;
DROP TABLE IF EXISTS commande CASCADE;
DROP TABLE IF EXISTS stock CASCADE;
DROP TABLE IF EXISTS produit CASCADE;
DROP TABLE IF EXISTS client CASCADE;
DROP TABLE IF EXISTS agriculteur CASCADE;
DROP TABLE IF EXISTS categorie CASCADE;
DROP TABLE IF EXISTS saison CASCADE;

DROP FUNCTION IF EXISTS generate_numero_commande() CASCADE;
DROP FUNCTION IF EXISTS update_commande_total() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;

CREATE TABLE saison (
  id SERIAL PRIMARY KEY,
  nom_saison VARCHAR(50) NOT NULL UNIQUE,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  description TEXT,
  icone VARCHAR(50),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_dates_saison CHECK (date_fin > date_debut)
);

CREATE TABLE categorie (
  id SERIAL PRIMARY KEY,
  libelle VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  ordre_affichage INTEGER DEFAULT 0,
  est_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE agriculteur (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  prenom VARCHAR(150) NOT NULL,
  nom_exploitation VARCHAR(200),
  email VARCHAR(255) NOT NULL UNIQUE,
  telephone VARCHAR(30),
  adresse TEXT,
  code_postal VARCHAR(10),
  ville VARCHAR(100),
  siret VARCHAR(14) UNIQUE,
  description TEXT,
  photo_url TEXT,
  note_moyenne DECIMAL(3,2) DEFAULT 0,
  est_verifie BOOLEAN DEFAULT FALSE,
  est_actif BOOLEAN DEFAULT TRUE,
  date_inscription TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_siret CHECK (siret IS NULL OR LENGTH(siret) = 14),
  CONSTRAINT chk_note CHECK (note_moyenne >= 0 AND note_moyenne <= 5)
);

CREATE TABLE client (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  prenom VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telephone VARCHAR(30),
  adresse_livraison TEXT,
  code_postal VARCHAR(10),
  ville VARCHAR(100),
  date_inscription TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  est_actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE produit (
  id SERIAL PRIMARY KEY,
  nom_produit VARCHAR(200) NOT NULL,
  description_produit TEXT,
  variete VARCHAR(100),
  prix_unitaire DECIMAL(10,2) NOT NULL,
  unite_mesure VARCHAR(20) DEFAULT 'kg',
  image_url TEXT,
  id_agriculteur INTEGER NOT NULL REFERENCES agriculteur(id) ON DELETE CASCADE,
  id_categorie INTEGER REFERENCES categorie(id) ON DELETE SET NULL,
  id_saison INTEGER REFERENCES saison(id) ON DELETE SET NULL,
  est_bio BOOLEAN DEFAULT FALSE,
  est_local BOOLEAN DEFAULT TRUE,
  est_actif BOOLEAN DEFAULT TRUE,
  est_nouveau BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_prix_positif CHECK (prix_unitaire > 0)
);

CREATE TABLE stock (
  id SERIAL PRIMARY KEY,
  id_produit INTEGER NOT NULL UNIQUE REFERENCES produit(id) ON DELETE CASCADE,
  quantite_disponible INTEGER NOT NULL DEFAULT 0,
  seuil_alerte INTEGER DEFAULT 10,
  date_mise_a_jour TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_quantite_positive CHECK (quantite_disponible >= 0)
);

CREATE TABLE commande (
  id SERIAL PRIMARY KEY,
  numero_commande VARCHAR(20) NOT NULL UNIQUE,
  id_client INTEGER NOT NULL REFERENCES client(id) ON DELETE CASCADE,
  date_commande TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  statut VARCHAR(50) DEFAULT 'EN_ATTENTE',
  total DECIMAL(10,2) DEFAULT 0,
  adresse_livraison TEXT,
  notes TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE ligne_commande (
  id SERIAL PRIMARY KEY,
  id_commande INTEGER NOT NULL REFERENCES commande(id) ON DELETE CASCADE,
  id_produit INTEGER NOT NULL REFERENCES produit(id) ON DELETE RESTRICT,
  quantite INTEGER NOT NULL,
  prix_unitaire_snapshot DECIMAL(10,2) NOT NULL,
  prix_ligne DECIMAL(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire_snapshot) STORED,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_quantite_ligne CHECK (quantite > 0),
  CONSTRAINT uq_commande_produit UNIQUE (id_commande, id_produit)
);

CREATE TABLE livraison (
  id SERIAL PRIMARY KEY,
  id_commande INTEGER NOT NULL REFERENCES commande(id) ON DELETE CASCADE,
  date_prevue DATE,
  date_livraison DATE,
  adresse_livraison TEXT,
  statut VARCHAR(50) DEFAULT 'EN_PREPARATION',
  numero_suivi VARCHAR(50),
  transporteur VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE paiement (
  id SERIAL PRIMARY KEY,
  id_commande INTEGER NOT NULL REFERENCES commande(id) ON DELETE CASCADE,
  montant DECIMAL(10,2) NOT NULL,
  date_paiement TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  mode_paiement VARCHAR(50) NOT NULL,
  statut VARCHAR(50) DEFAULT 'EN_ATTENTE',
  reference_transaction VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_montant_positif CHECK (montant > 0)
);

CREATE INDEX idx_saison_dates ON saison(date_debut, date_fin);
CREATE INDEX idx_categorie_active ON categorie(est_active) WHERE est_active = TRUE;
CREATE INDEX idx_agriculteur_email ON agriculteur(email);
CREATE INDEX idx_agriculteur_actif ON agriculteur(est_actif) WHERE est_actif = TRUE;
CREATE INDEX idx_produit_agriculteur ON produit(id_agriculteur);
CREATE INDEX idx_produit_categorie ON produit(id_categorie);
CREATE INDEX idx_produit_saison ON produit(id_saison);
CREATE INDEX idx_produit_actif ON produit(est_actif) WHERE est_actif = TRUE;
CREATE INDEX idx_stock_produit ON stock(id_produit);
CREATE INDEX idx_stock_alerte ON stock(quantite_disponible) WHERE quantite_disponible <= 10;
CREATE INDEX idx_commande_client ON commande(id_client);
CREATE INDEX idx_commande_date ON commande(date_commande DESC);
CREATE INDEX idx_commande_statut ON commande(statut);
CREATE INDEX idx_commande_numero ON commande(numero_commande);
CREATE INDEX idx_ligne_commande ON ligne_commande(id_commande);
CREATE INDEX idx_ligne_produit ON ligne_commande(id_produit);
CREATE INDEX idx_livraison_commande ON livraison(id_commande);
CREATE INDEX idx_livraison_statut ON livraison(statut);
CREATE INDEX idx_livraison_date ON livraison(date_prevue);
CREATE INDEX idx_paiement_commande ON paiement(id_commande);
CREATE INDEX idx_paiement_statut ON paiement(statut);
CREATE INDEX idx_paiement_date ON paiement(date_paiement DESC);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_numero_commande()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_commande IS NULL OR NEW.numero_commande = '' THEN
    NEW.numero_commande := 'CMD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_commande_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE commande
  SET total = (
    SELECT COALESCE(SUM(prix_ligne), 0)
    FROM ligne_commande
    WHERE id_commande = COALESCE(NEW.id_commande, OLD.id_commande)
  ),
  updated_at = NOW()
  WHERE id = COALESCE(NEW.id_commande, OLD.id_commande);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_saison BEFORE UPDATE ON saison FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_categorie BEFORE UPDATE ON categorie FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_agriculteur BEFORE UPDATE ON agriculteur FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_client BEFORE UPDATE ON client FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_produit BEFORE UPDATE ON produit FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_commande BEFORE UPDATE ON commande FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_livraison BEFORE UPDATE ON livraison FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_paiement BEFORE UPDATE ON paiement FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_generate_numero_commande
  BEFORE INSERT ON commande
  FOR EACH ROW
  WHEN (NEW.numero_commande IS NULL)
  EXECUTE FUNCTION generate_numero_commande();

CREATE TRIGGER trg_update_total_insert
  AFTER INSERT ON ligne_commande
  FOR EACH ROW
  EXECUTE FUNCTION update_commande_total();

CREATE TRIGGER trg_update_total_update
  AFTER UPDATE ON ligne_commande
  FOR EACH ROW
  EXECUTE FUNCTION update_commande_total();

CREATE TRIGGER trg_update_total_delete
  AFTER DELETE ON ligne_commande
  FOR EACH ROW
  EXECUTE FUNCTION update_commande_total();

INSERT INTO saison (nom_saison, date_debut, date_fin, description, icone) VALUES
('Printemps', '2026-03-21', '2026-06-20', 'Saison des semis et des premieres recoltes', '🌸'),
('Été', '2026-06-21', '2026-09-22', 'Saison des fruits et legumes du soleil', '☀️'),
('Automne', '2026-09-23', '2026-12-20', 'Saison des recoltes et des conserves', '🍂'),
('Hiver', '2025-12-21', '2026-03-20', 'Saison des legumes racines et agrumes', '❄️');

INSERT INTO categorie (libelle, description, ordre_affichage, est_active) VALUES
('Légumes', 'Légumes frais de saison cultivés localement', 1, TRUE),
('Fruits', 'Fruits frais et de saison', 2, TRUE),
('Herbes aromatiques', 'Herbes fraîches pour la cuisine', 3, TRUE),
('Produits transformés', 'Confitures, conserves, jus artisanaux', 4, TRUE),
('Oeufs et produits laitiers', 'Produits de la ferme', 5, TRUE);

INSERT INTO agriculteur (nom, prenom, nom_exploitation, email, telephone, adresse, code_postal, ville, siret, description, est_verifie, est_actif, note_moyenne, date_inscription) VALUES
('Dupont', 'Marie', 'Ferme des Collines', 'marie.dupont@ferme.fr', '+33 6 12 34 56 78', '12 Route des Champs', '14000', 'Caen', '12345678901234', 'Productrice bio depuis 15 ans, specialisee dans les legumes racines.', TRUE, TRUE, 4.90, NOW()),
('Martin', 'Pierre', 'Les Jardins du Soleil', 'pierre.martin@jardins.fr', '+33 6 98 76 54 32', '45 Chemin de Provence', '13100', 'Aix-en-Provence', '98765432109876', 'Maraicher passionne, fruits et legumes mediterraneens.', TRUE, TRUE, 4.80, NOW()),
('Bernard', 'Sophie', 'Potager de Sophie', 'sophie.bernard@potager.fr', '+33 6 11 22 33 44', '78 Rue de la Mer', '35000', 'Rennes', '11223344556677', 'Specialiste des legumes anciens et oublies.', TRUE, TRUE, 5.00, NOW()),
('Lefevre', 'Jean', 'Verger du Val', 'jean.lefevre@verger.fr', '+33 6 22 33 44 55', '5 Chemin des Pommiers', '76000', 'Rouen', '22334455667788', 'Production de fruits bio, specialite pommes et poires.', TRUE, TRUE, 4.70, NOW());

INSERT INTO client (nom, prenom, email, telephone, adresse_livraison, code_postal, ville, est_actif, date_inscription) VALUES
('Leroy', 'Jean', 'jean.leroy@email.fr', '+33 6 55 44 33 22', '15 Avenue des Fleurs', '75001', 'Paris', TRUE, NOW()),
('Richard', 'Anne', 'anne.richard@email.fr', '+33 6 77 88 99 00', '28 Rue du Commerce', '69001', 'Lyon', TRUE, NOW()),
('Moreau', 'Lucas', 'lucas.moreau@email.fr', '+33 6 33 22 11 00', '5 Place de la Mairie', '33000', 'Bordeaux', TRUE, NOW()),
('Petit', 'Emma', 'emma.petit@email.fr', '+33 6 44 55 66 77', '12 Boulevard Victor Hugo', '31000', 'Toulouse', TRUE, NOW());

INSERT INTO produit (nom_produit, description_produit, variete, prix_unitaire, unite_mesure, id_agriculteur, id_categorie, id_saison, est_bio, est_local, est_actif, est_nouveau) VALUES
('Carottes Bio', 'Carottes fraiches cultivees sans pesticides, croquantes et sucrees', 'Nantaise', 2.50, 'kg', 1, 1, 4, TRUE, TRUE, TRUE, FALSE),
('Tomates Coeur de Boeuf', 'Tomates juteuses et savoureuses, parfaites pour les salades', 'Coeur de Boeuf', 4.90, 'kg', 2, 1, 2, TRUE, TRUE, TRUE, TRUE),
('Salade Batavia', 'Salade croquante et fraiche du jour', 'Batavia', 1.80, 'piece', 3, 1, 1, TRUE, TRUE, TRUE, FALSE),
('Pommes Gala', 'Pommes sucrees et croquantes, ideales pour croquer', 'Gala', 3.20, 'kg', 4, 2, 3, FALSE, TRUE, TRUE, FALSE),
('Courgettes', 'Courgettes tendres du jardin, parfaites pour griller', 'Verte', 2.80, 'kg', 1, 1, 2, TRUE, TRUE, TRUE, FALSE),
('Fraises', 'Fraises parfumees de plein champ, recoltees a maturite', 'Gariguette', 6.50, 'barquette', 3, 2, 1, TRUE, TRUE, TRUE, TRUE),
('Poivrons', 'Poivrons colores et croquants', 'Mix Rouge/Vert', 3.50, 'kg', 2, 1, 2, TRUE, TRUE, TRUE, FALSE),
('Basilic', 'Basilic frais en pot, parfume', 'Grand Vert', 2.20, 'pot', 3, 3, 2, TRUE, TRUE, TRUE, FALSE),
('Ail Violet', 'Ail violet de Cadours, AOC', 'Violet de Cadours', 6.20, 'kg', 2, 1, 3, FALSE, TRUE, TRUE, FALSE),
('Poires', 'Poires fondantes et sucrees', 'Williams', 3.80, 'kg', 4, 2, 3, TRUE, TRUE, TRUE, FALSE);

INSERT INTO stock (id_produit, quantite_disponible, seuil_alerte) VALUES
(1, 120, 20),
(2, 45, 15),
(3, 30, 10),
(4, 89, 25),
(5, 67, 15),
(6, 5, 10),
(7, 55, 20),
(8, 40, 10),
(9, 25, 15),
(10, 70, 20);

INSERT INTO commande (numero_commande, id_client, date_commande, statut, total, adresse_livraison, notes) VALUES
('CMD-20260424-00001', 1, NOW() - INTERVAL '2 days', 'LIVREE', 25.40, '15 Avenue des Fleurs, 75001 Paris', 'Livraison matinale svp'),
('CMD-20260424-00002', 2, NOW() - INTERVAL '1 day', 'EN_PREPARATION', 18.60, '28 Rue du Commerce, 69001 Lyon', NULL),
('CMD-20260424-00003', 3, NOW(), 'EN_ATTENTE', 32.50, '5 Place de la Mairie, 33000 Bordeaux', 'Sonner au portail'),
('CMD-20260424-00004', 4, NOW(), 'CONFIRMEE', 15.20, '12 Boulevard Victor Hugo, 31000 Toulouse', NULL);

INSERT INTO ligne_commande (id_commande, id_produit, quantite, prix_unitaire_snapshot) VALUES
(1, 1, 2, 2.50),
(1, 2, 3, 4.90),
(1, 3, 2, 1.80),
(2, 5, 2, 2.80),
(2, 6, 2, 6.50),
(3, 2, 5, 4.90),
(3, 4, 2, 3.20),
(4, 1, 3, 2.50),
(4, 7, 2, 3.50);

INSERT INTO livraison (id_commande, date_prevue, adresse_livraison, statut, numero_suivi, transporteur, notes) VALUES
(1, CURRENT_DATE + 1, '15 Avenue des Fleurs, 75001 Paris', 'EN_COURS_LIVRAISON', 'FR-AGR-0001', 'ChronoFrais', 'Livraison matinale'),
(2, CURRENT_DATE + 2, '28 Rue du Commerce, 69001 Lyon', 'EN_PREPARATION', 'FR-AGR-0002', 'ChronoFrais', 'Preparation en cours');

INSERT INTO paiement (id_commande, montant, mode_paiement, statut, reference_transaction, notes) VALUES
(1, 25.40, 'carte_bancaire', 'CONFIRME', 'TX-0001', 'Paiement valide'),
(2, 18.60, 'paypal', 'EN_ATTENTE', 'TX-0002', 'En attente de validation');

SELECT 'Schema and demo data imported successfully' AS message;
SELECT 'Saisons: ' || COUNT(*) FROM saison;
SELECT 'Categories: ' || COUNT(*) FROM categorie;
SELECT 'Agriculteurs: ' || COUNT(*) FROM agriculteur;
SELECT 'Clients: ' || COUNT(*) FROM client;
SELECT 'Produits: ' || COUNT(*) FROM produit;
SELECT 'Commandes: ' || COUNT(*) FROM commande;
SELECT 'Stocks: ' || COUNT(*) FROM stock;