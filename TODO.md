# TODO - Connexion Dashboard -> Base de données (Ajout produits)

- [ ] Étendre le backend avec un endpoint DTO pour créer un Produit à partir de `agriculteurId`, `categorieId`, `saisonId`.
- [ ] Mettre à jour le backend pour accepter aussi la mise à jour (optionnel mais recommandé).
- [ ] Mettre à jour `frontend/src/app/services/api.ts` pour appeler le nouvel endpoint.
- [ ] Mettre à jour `frontend/src/dashboard/Dashboard.tsx` (modal Ajouter/Modifier produits) avec sélecteurs pour agriculteur/catégorie/saison et mapper le payload DTO.
- [ ] Tester manuellement : démarrer backend + frontend, ajouter un produit, vérifier persistance en DB.

