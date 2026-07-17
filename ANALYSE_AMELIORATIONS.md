# Analyse et Plan d'Amélioration — AgriMarket

Ce document liste l'ensemble des problèmes identifiés dans le codebase et les correctifs à appliquer, classés par priorité.

---

## 🔴 Priorité 1 — Bugs et sécurité

### 1.1 — Aucune authentification
- **Problème** : Le dashboard admin `/dashboard` est accessible sans aucune protection.
  N'importe qui peut modifier/supprimer des produits, clients, commandes.
- **Impact** : Critique. Données vulnérables.
- **Correction** : Ajouter Spring Security + JWT. Protéger les routes `/api/**`.

### 1.2 — Stock non vérifié/décrémenté à la commande
- **Problème** : `CommandeController.createCommande()` n'affiche pas les quantités commandées
  des stocks. Un client peut commander 1000 unités d'un produit sans limite.
- **Impact** : Élevé. Incohérence commandes/stocks.
- **Correction** : Vérifier `quantiteDisponible` avant création, décrémenter après.

### 1.3 — Validation des DTOs absente
- **Problème** : La dépendance `spring-boot-starter-validation` est dans `pom.xml` mais
  les DTOs n'ont aucune annotation de validation (`@NotNull`, `@NotBlank`, `@Email`, etc.).
  Un `prixUnitaire: null` passe sans erreur et provoque une 500.
- **Impact** : Élevé. Erreurs 500 au lieu de 400, données invalides en BDD.
- **Correction** : Ajouter les annotations dans les DTOs, activer `@Valid` dans les controllers.

### 1.4 — Aucun handler d'erreur global
- **Problème** : Pas de `@ControllerAdvice`. Les `IllegalArgumentException` et autres erreurs
  de validation remontent en stack trace 500 au lieu de réponses 400 propres.
- **Impact** : Moyen. Mauvaise expérience API, informations internes exposées.
- **Correction** : Créer `GlobalExceptionHandler` avec `@ControllerAdvice`.

### 1.5 — Soft delete incohérent
- **Problème** : Produit, Agriculteur, Client, Categorie utilisent `estActif` (soft delete).
  Saison utilise `saisonRepository.delete(saison)` (suppression physique).
- **Impact** : Faible mais incohérence.
- **Correction** : Uniformiser : soft delete sur Saison également.

### 1.6 — StockController retourne entité et DTO
- **Problème** : `GET /api/stocks` retourne `StockResponseDto`, mais
  `PUT /api/stocks/{id}/reapprovisionner` et `PUT /api/stocks/{id}` retournent l'entité `Stock` brute.
- **Impact** : Faible. Risque d'exposer des données LAZY non chargées.
- **Correction** : Retourner `StockResponseDto` partout.

---

## 🟠 Priorité 2 — Architecture et qualité

### 2.1 — Services inutilisés
- **Problème** : `ProduitService.java` et `CategorieService.java` existent mais ne sont
  pas appelés. Les controllers font tout via les repositories directement.
- **Impact** : La couche métier (service) est vide, la logique est dans les controllers.
- **Correction** : Brancher les services dans les controllers, déplacer la logique.

### 2.2 — Field injection ( @Autowired )
- **Problème** : Tous les controllers utilisent `@Autowired` sur des champs.
- **Impact** : Impossible de tester avec des mocks facilement (sans réflexion).
- **Correction** : Remplacer par constructor injection.

### 2.3 — Double fichier api.ts
- **Problème** : `frontend/src/services/api.ts` (référence) ET
  `frontend/src/app/services/api.ts` (copie ?) coexistent.
- **Impact** : Confusion, risque d'importer le mauvais fichier.
- **Correction** : Vérifier quel fichier est importé, supprimer l'autre.

### 2.4 — Dashboard monolithique (~700 lignes)
- **Problème** : `Dashboard.tsx` gère 7 sections + 2 modales + formulaires en un seul fichier.
- **Impact** : Difficile à maintenir, tester, faire évoluer.
- **Correction** : Découper en composants : `ProduitsSection`, `CommandesSection`, etc.

### 2.5 — Type `any` dans le Dashboard
- **Problème** : Les props de `FormModal` et `DetailsModal` sont `any`.
  Les callbacks `handleSave` reçoivent `any`.
- **Impact** : Perte du typage TypeScript, erreurs potentielles.
- **Correction** : Remplacer `any` par les types explicites.

### 2.6 — CommandeResponseDto manquant
- **Problème** : `createCommande` et `getAllCommandes` retournent l'entité `Commande` brute.
- **Impact** : Boucle JSON possible (Commande → LigneCommande → Commande).
- **Correction** : Créer `CommandeResponseDto`.

---

## 🟡 Priorité 3 — Frontend UX/robustesse

### 3.1 — Fichiers CSS redondants
- **Problème** : `index.css` importe Tailwind mais `tailwind.css` aussi.
  `theme.css` + `globals.css` + `fonts.css` sont inutilisés ou redondants.
- **Impact** : Confusion, poids inutile.
- **Correction** : Conserver un seul point d'entrée CSS propre.

### 3.2 — Fallback API URL trompeur
- **Problème** : Dans `api.ts`, `VITE_API_BASE_URL` default à `http://localhost:8080/api`
  mais le backend tourne sur le port `8282`.
- **Impact** : Sans `.env.local`, les appels API échouent en silence.
- **Correction** : Mettre la bonne valeur par défaut ou documenter dans le README.

### 3.3 — Images sans fallback visuel
- **Problème** : `onError` cache l'image (`display: none`) sans placeholder.
- **Impact** : Les produits sans image ont des carrés vides laids.
- **Correction** : Afficher une icône/emoji de remplacement.

### 3.4 — Pas de feedback utilisateur (toast)
- **Problème** : Les erreurs sont soit `alert()` soit `console.error()`.
  L'utilisateur ne voit pas les notifications de succès.
- **Impact** : Mauvaise UX.
- **Correction** : Utiliser `sonner` (déjà dans les dépendances) ou un système simple.

### 3.5 — Pagination manquante
- **Problème** : Toutes les listes sont chargées en une seule requête.
- **Impact** : Impossible avec 1000+ produits.
- **Correction** : Ajouter pagination côté serveur (Spring Data Page) + frontend.

---

## 🔵 Priorité 4 — Dette technique

### 4.1 — 50+ dépendances inutilisées
- **Problème** : Le `package.json` racine a MUI, Radix UI, Recharts, Leaflet, react-dnd,
  react-hook-form, date-fns, etc. — AUCUNE n'est importée dans le code.
- **Impact** : `node_modules` gonflé, `pnpm install` lent.
- **Correction** : Supprimer les dépendances inutiles du `package.json`.

### 4.2 — Aucun test
- **Problème** : Zero test unitaire (JUnit, Jest, Vitest). Zéro test d'intégration.
- **Impact** : Risque de régression à chaque modification.
- **Correction** : Ajouter des tests sur les services et les controllers principaux.

### 4.3 — Configuration dupliquée (Vite)
- **Problème** : `vite.config.ts` à la racine (avec figmaAssetResolver) ET
  `frontend/vite.config.ts` (propre). Le projet semble lancé depuis `frontend/`.
- **Impact** : Le fichier racine est probablement mort.
- **Correction** : Supprimer `vite.config.ts` racine si inutilisé.

### 4.4 — postcss.config.mjs vs Tailwind Vite
- **Problème** : `postcss.config.mjs` + plugin `@tailwindcss/vite`. Tailwind CSS 4
  avec Vite n'a pas besoin de PostCSS. L'un des deux est mort.
- **Impact** : Build potentiellement lent ou cassé.
- **Correction** : Supprimer le fichier PostCSS si le plugin Vite est utilisé.

---

## 🟢 Priorité 5 — Améliorations fonctionnelles

### 5.1 — Upload d'images
- `imageUrl` est un champ texte → sans upload, l'utilisateur ne peut pas mettre d'image.
- Ajouter MultipartFile + stockage local/S3.

### 5.2 — Paiement en ligne
- Pas de système de paiement (Stripe, PayPal).

### 5.3 — Notifications email
- Pas d'envoi d'email lors de la confirmation de commande.

### 5.4 — Statistiques dashboard
- Aucun graphique/chiffre clé (CA, nb commandes, produits populaires).

### 5.5 — Avis clients
- Les étoiles et `nbAvis` sont en lecture seule → pas de système d'avis.

### 5.6 — Export CSV/PDF
- Pas d'export depuis le dashboard.

---

## Résumé des correctifs immédiats

Les sections suivantes implémentent automatiquement les correctifs listés ci-dessous :

1. ✅ DTOs : ajout des annotations de validation
2. ✅ ControllerAdvice global pour les erreurs
3. ✅ Constructor injection dans tous les controllers
4. ✅ Brancher les services dans les controllers
5. ✅ Soft delete pour Saison
6. ✅ Vérification/décrémentation stock à la commande
7. ✅ Uniformiser StockController en DTO
8. ✅ Suppression du fichier api.ts dupliqué
9. ✅ Nettoyage CSS (un seul fichier d'import)
10. ✅ Placeholder images dans App.tsx et ProduitDetail.tsx
11. ✅ Correction du fallback API URL
12. ✅ Sonner pour notifications toast
13. ✅ Nettoyage dépendances inutilisées (package.json racine)
