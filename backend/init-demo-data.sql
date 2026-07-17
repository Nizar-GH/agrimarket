-- Script d'initialisation avec données de démonstration pour AgriMarket
-- À exécuter après la création des tables

-- Insertion de saisons
INSERT INTO saison (nom_saison, date_debut, date_fin, description, icone, created_at, updated_at) VALUES
('Printemps', '2026-03-21', '2026-06-20', 'Saison des semis et des premières récoltes', '🌸', NOW(), NOW()),
('Été', '2026-06-21', '2026-09-22', 'Saison des fruits et légumes du soleil', '☀️', NOW(), NOW()),
('Automne', '2026-09-23', '2026-12-20', 'Saison des récoltes et des conserves', '🍂', NOW(), NOW()),
('Hiver', '2025-12-21', '2026-03-20', 'Saison des légumes racines et agrumes', '❄️', NOW(), NOW());

-- Insertion de catégories
INSERT INTO categorie (libelle, description, ordre_affichage, est_active, created_at, updated_at) VALUES
('Légumes', 'Légumes frais de saison cultivés localement', 1, true, NOW(), NOW()),
('Fruits', 'Fruits frais et de saison', 2, true, NOW(), NOW()),
('Herbes aromatiques', 'Herbes fraîches pour la cuisine', 3, true, NOW(), NOW()),
('Produits transformés', 'Confitures, conserves, jus artisanaux', 4, true, NOW(), NOW()),
('Oeufs et produits laitiers', 'Produits de la ferme', 5, true, NOW(), NOW());

-- Insertion d'agriculteurs
INSERT INTO agriculteur (nom, prenom, nom_exploitation, email, telephone, adresse, code_postal, ville, siret, description, est_verifie, est_actif, note_moyenne, date_inscription, created_at, updated_at) VALUES
('Dupont', 'Marie', 'Ferme des Collines', 'marie.dupont@ferme.fr', '+33 6 12 34 56 78', '12 Route des Champs', '14000', 'Caen', '12345678901234', 'Productrice bio depuis 15 ans, spécialisée dans les légumes racines.', true, true, 4.90, NOW(), NOW(), NOW()),
('Martin', 'Pierre', 'Les Jardins du Soleil', 'pierre.martin@jardins.fr', '+33 6 98 76 54 32', '45 Chemin de Provence', '13100', 'Aix-en-Provence', '98765432109876', 'Maraîcher passionné, fruits et légumes méditerranéens.', true, true, 4.80, NOW(), NOW(), NOW()),
('Bernard', 'Sophie', 'Potager de Sophie', 'sophie.bernard@potager.fr', '+33 6 11 22 33 44', '78 Rue de la Mer', '35000', 'Rennes', '11223344556677', 'Spécialiste des légumes anciens et oubliés.', true, true, 5.00, NOW(), NOW(), NOW()),
('Lefevre', 'Jean', 'Verger du Val', 'jean.lefevre@verger.fr', '+33 6 22 33 44 55', '5 Chemin des Pommiers', '76000', 'Rouen', '22334455667788', 'Production de fruits bio, spécialité pommes et poires.', true, true, 4.70, NOW(), NOW(), NOW());

-- Insertion de clients
INSERT INTO client (nom, prenom, email, telephone, adresse_livraison, code_postal, ville, est_actif, date_inscription, created_at, updated_at) VALUES
('Leroy', 'Jean', 'jean.leroy@email.fr', '+33 6 55 44 33 22', '15 Avenue des Fleurs', '75001', 'Paris', true, NOW(), NOW(), NOW()),
('Richard', 'Anne', 'anne.richard@email.fr', '+33 6 77 88 99 00', '28 Rue du Commerce', '69001', 'Lyon', true, NOW(), NOW(), NOW()),
('Moreau', 'Lucas', 'lucas.moreau@email.fr', '+33 6 33 22 11 00', '5 Place de la Mairie', '33000', 'Bordeaux', true, NOW(), NOW(), NOW()),
('Petit', 'Emma', 'emma.petit@email.fr', '+33 6 44 55 66 77', '12 Boulevard Victor Hugo', '31000', 'Toulouse', true, NOW(), NOW(), NOW());

-- Insertion de produits
INSERT INTO produit (nom_produit, description_produit, variete, prix_unitaire, unite_mesure, id_agriculteur, id_categorie, id_saison, est_bio, est_local, est_actif, est_nouveau, created_at, updated_at) VALUES
('Carottes Bio', 'Carottes fraîches cultivées sans pesticides, croquantes et sucrées', 'Nantaise', 2.50, 'kg', 1, 1, 4, true, true, true, false, NOW(), NOW()),
('Tomates Cœur de Bœuf', 'Tomates juteuses et savoureuses, parfaites pour les salades', 'Cœur de Bœuf', 4.90, 'kg', 2, 1, 2, true, true, true, true, NOW(), NOW()),
('Salade Batavia', 'Salade croquante et fraîche du jour', 'Batavia', 1.80, 'pièce', 3, 1, 1, true, true, true, false, NOW(), NOW()),
('Pommes Gala', 'Pommes sucrées et croquantes, idéales pour croquer', 'Gala', 3.20, 'kg', 4, 2, 3, false, true, true, false, NOW(), NOW()),
('Courgettes', 'Courgettes tendres du jardin, parfaites pour griller', 'Verte', 2.80, 'kg', 1, 1, 2, true, true, true, false, NOW(), NOW()),
('Fraises', 'Fraises parfumées de plein champ, récoltées à maturité', 'Gariguette', 6.50, 'barquette', 3, 2, 1, true, true, true, true, NOW(), NOW()),
('Poivrons', 'Poivrons colorés et croquants', 'Mix Rouge/Vert', 3.50, 'kg', 2, 1, 2, true, true, true, false, NOW(), NOW()),
('Basilic', 'Basilic frais en pot, parfumé', 'Grand Vert', 2.20, 'pot', 3, 3, 2, true, true, true, false, NOW(), NOW()),
('Ail Violet', 'Ail violet de Cadours, AOC', 'Violet de Cadours', 6.20, 'kg', 2, 1, 3, false, true, true, false, NOW(), NOW()),
('Poires', 'Poires fondantes et sucrées', 'Williams', 3.80, 'kg', 4, 2, 3, true, true, true, false, NOW(), NOW());

-- Insertion de stocks
INSERT INTO stock (id_produit, quantite_disponible, seuil_alerte, date_mise_a_jour) VALUES
(1, 120, 20, NOW()),
(2, 45, 15, NOW()),
(3, 30, 10, NOW()),
(4, 89, 25, NOW()),
(5, 67, 15, NOW()),
(6, 5, 10, NOW()),  -- Stock faible
(7, 55, 20, NOW()),
(8, 40, 10, NOW()),
(9, 25, 15, NOW()),
(10, 70, 20, NOW());

-- Insertion de commandes de démonstration
INSERT INTO commande (numero_commande, id_client, date_commande, statut, total, adresse_livraison, notes, created_at, updated_at) VALUES
('CMD-20260424-00001', 1, NOW() - INTERVAL '2 days', 'LIVREE', 25.40, '15 Avenue des Fleurs, 75001 Paris', 'Livraison matinale svp', NOW(), NOW()),
('CMD-20260424-00002', 2, NOW() - INTERVAL '1 day', 'EN_PREPARATION', 18.60, '28 Rue du Commerce, 69001 Lyon', NULL, NOW(), NOW()),
('CMD-20260424-00003', 3, NOW(), 'EN_ATTENTE', 32.50, '5 Place de la Mairie, 33000 Bordeaux', 'Sonner au portail', NOW(), NOW()),
('CMD-20260424-00004', 4, NOW(), 'CONFIRMEE', 15.20, '12 Boulevard Victor Hugo, 31000 Toulouse', NULL, NOW(), NOW());

-- Insertion de lignes de commande
INSERT INTO ligne_commande (id_commande, id_produit, quantite, prix_unitaire_snapshot, created_at) VALUES
-- Commande 1
(1, 1, 2, 2.50, NOW()),
(1, 2, 3, 4.90, NOW()),
(1, 3, 2, 1.80, NOW()),
-- Commande 2
(2, 5, 2, 2.80, NOW()),
(2, 6, 2, 6.50, NOW()),
-- Commande 3
(3, 2, 5, 4.90, NOW()),
(3, 4, 2, 3.20, NOW()),
-- Commande 4
(4, 1, 3, 2.50, NOW()),
(4, 7, 2, 3.50, NOW());

-- Afficher le résumé
SELECT 'Données de démonstration insérées avec succès!' as message;
SELECT 'Saisons: ' || COUNT(*) as count FROM saison;
SELECT 'Catégories: ' || COUNT(*) as count FROM categorie;
SELECT 'Agriculteurs: ' || COUNT(*) as count FROM agriculteur;
SELECT 'Clients: ' || COUNT(*) as count FROM client;
SELECT 'Produits: ' || COUNT(*) as count FROM produit;
SELECT 'Commandes: ' || COUNT(*) as count FROM commande;
SELECT 'Stocks: ' || COUNT(*) as count FROM stock;
