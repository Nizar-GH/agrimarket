# Plan d'action — AgriMarket

## 🔴 Priorité 1 — Bugs bloquants

### 1. `updateStatut` backend ne lit pas le query param ✅
Le frontend envoie `?statut=CONFIRMEE` mais le controller lisait `@RequestBody String statut`.  
**Fix appliqué** : `@RequestBody` → `@RequestParam` dans `CommandeController.java`.  
**Fichier modifié** : `backend/src/main/java/com/agrimarket/controller/CommandeController.java`
```java
// Avant
public ResponseEntity<Commande> updateCommandeStatut(@PathVariable Long id, @RequestBody String statut)
// Après
public ResponseEntity<Commande> updateCommandeStatut(@PathVariable Long id, @RequestParam String statut)
```

### 2. `createCommande` frontend envoie un mauvais format ✅
Le panier envoyait `{ lignesCommande, total }` mais le backend attendait une entité `Commande` avec un `client` obligatoire.  
**Fix appliqué** : création de `CommandeCreateDto.java` (accepte `clientNom/Email` ou `clientId` + lignes), adaptation de `CommandeController.createCommande` pour résoudre/créer le client à la volée, ajout d'une étape formulaire client dans `Panier.tsx`.  
**Fichiers modifiés** : `CommandeController.java`, nouveau `CommandeCreateDto.java`, `frontend/src/components/Panier.tsx`

### 3. Duplication de fichiers ✅
- `frontend/src/app/components/` (Dashboard.tsx, Panier.tsx, ui/, figma/) → **supprimé**
- `frontend/src/app/services/` (api.ts, mockData.ts) → **supprimé**
- `src/` à la racine (copie morte de frontend/src/) → **supprimé**

**Fichiers de référence conservés** : `frontend/src/components/`, `frontend/src/services/`, `frontend/src/dashboard/`

---

## 🟠 Priorité 2 — Fonctionnalités manquantes critiques

### 4. Commande sans client
Aucun formulaire pour saisir les infos du client avant de commander.  
**Fix** : ajouter une étape dans le panier — nom, prénom, email, adresse de livraison.

### 5. Quantité dans le panier non modifiable ✅
Le panier permettait seulement de supprimer un item, pas d'ajuster la quantité.  
**Fix appliqué** : ajout de `modifierQuantite(id, quantite)` dans `PanierProvider`, boutons `+`/`-` par ligne dans le modal panier. Si quantité ≤ 0, l'item est supprimé automatiquement.  
**Fichiers modifiés** : `frontend/src/components/Panier.tsx`

### 6. Boutons de navigation bas de page non fonctionnels
Search, Favorites, Profile dans la navbar sont des boutons vides sans action.  
**Fix** : implémenter les routes ou les comportements correspondants.

### 7. Dashboard — stocks sans DTO ✅
`StockController` retournait l'entité brute avec `produit` en LAZY → risque de `LazyInitializationException`.  
**Fix appliqué** : création de `StockResponseDto.java` avec `ProduitInfo` imbriqué (id, nomProduit, uniteMesure, imageUrl), endpoints GET adaptés pour retourner le DTO.  
**Fichiers modifiés** : `StockController.java`, nouveau `StockResponseDto.java`

---

## 🟡 Priorité 3 — Qualité & robustesse

### 8. Gestion d'erreurs API absente
Aucun toast/notification d'erreur dans l'app client. Les `alert()` dans le dashboard sont à remplacer.  
**Fix** : ajouter des messages d'erreur inline ou un système de notifications.

### 9. `PanierProvider` dupliqué ✅
`App.tsx` et `ProduitDetail.tsx` créaient chacun leur propre `PanierProvider` → le panier était isolé entre les deux pages.  
**Fix appliqué** : `PanierProvider` remonté dans `main.tsx` pour englober toutes les routes, retiré de `App.tsx` et `ProduitDetail.tsx`.  
**Fichiers modifiés** : `frontend/src/main.tsx`, `frontend/src/app/App.tsx`, `frontend/src/app/ProduitDetail.tsx`

### 10. `any` partout dans le TypeScript ✅
`produit: any`, `item: any`, `formData: any` — aucun typage fort.  
**Fix appliqué** : création de `frontend/src/services/types.ts` avec les interfaces `Produit`, `Categorie`, `Saison`, `Agriculteur`, `Client`, `Commande`, `LigneCommande`, `Stock`, `PanierItem`. Importé dans `App.tsx`, `ProduitDetail.tsx`, `Panier.tsx`, `Dashboard.tsx`.  
**Fichiers modifiés** : nouveau `types.ts`, `App.tsx`, `ProduitDetail.tsx`, `Panier.tsx`, `Dashboard.tsx`

### 11. `ICONES_CATEGORIES` dupliqué ✅
Défini dans `App.tsx` ET `ProduitDetail.tsx`.  
**Fix appliqué** : extrait dans `frontend/src/services/constants.ts`, importé dans `App.tsx` et `ProduitDetail.tsx`. Correction du null check sur `produit` dans `handleAjouter`.  
**Fichiers modifiés** : nouveau `constants.ts`, `App.tsx`, `ProduitDetail.tsx`

---

## 🟢 Priorité 4 — Améliorations UX

### 12. Page 404 manquante ✅
La route `*` redirigait vers `/` sans message.  
**Fix appliqué** : création de `NotFound.tsx` avec emoji, message et bouton retour accueil. Route `*` branchée sur ce composant dans `main.tsx`.  
**Fichiers modifiés** : nouveau `frontend/src/app/NotFound.tsx`, `main.tsx`

### 13. État de chargement produits ✅
Aucun skeleton/spinner pendant le chargement des produits sur l'accueil.  
**Fix appliqué** : ajout d'un state `loading`, skeleton animé (`animate-pulse`) sur 4 cartes pendant le chargement, `setLoading(false)` dans le `finally` de `loadProduits`.  
**Fichiers modifiés** : `frontend/src/app/App.tsx`

### 14. Panier persistant ✅
Le panier se vidait au refresh.  
**Fix appliqué** : `PanierProvider` initialise son state depuis `localStorage` et synchronise à chaque changement via `useEffect`.  
**Fichiers modifiés** : `frontend/src/components/Panier.tsx`

### 15. Dashboard — recherche/filtres ✅
Le dashboard n'avait pas de barre de recherche pour filtrer les listes.  
**Fix appliqué** : ajout d'un state `search`, calcul de `dateFiltree` filtrant sur tous les champs texte pertinents par section, barre de recherche dans le header du dashboard, reset du search au changement de section.  
**Fichiers modifiés** : `frontend/src/dashboard/Dashboard.tsx`

---

## Ordre d'exécution recommandé

| Étape | Action | Fichier(s) concerné(s) |
|-------|--------|------------------------|
| 1 | ✅ Fix `@RequestParam` dans `updateStatut` | `CommandeController.java` |
| 2 | ✅ Fix `PanierProvider` partagé | `main.tsx` |
| 3 | ✅ Formulaire client dans le panier + `CommandeCreateDto` | `Panier.tsx`, `CommandeController.java` |
| 4 | ✅ Supprimer les fichiers dupliqués | `frontend/src/app/`, `src/` racine |
| 5 | ✅ Ajouter `StockResponseDto` | `StockController.java`, nouveau DTO |
| 6 | ✅ Typer les interfaces TypeScript | nouveau `types.ts` |
| 7 | ✅ Extraire `ICONES_CATEGORIES` | nouveau `constants.ts` |
| 9 | ✅ Page 404 | `NotFound.tsx`, `main.tsx` |
| 10 | ✅ Skeleton loading produits | `App.tsx` |
| 11 | ✅ Recherche dashboard | `Dashboard.tsx` |
