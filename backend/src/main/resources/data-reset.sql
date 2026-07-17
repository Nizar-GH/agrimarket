-- Supprimer les anciennes données pour forcer le rechargement avec les images
DELETE FROM produit WHERE image_url IS NULL;
DELETE FROM commande;
DELETE FROM ligne_commande;
DELETE FROM stock;
