# AgriMarket - Application de Vente de Produits Agricoles

Application complète de vente de produits agricoles saisonniers avec dashboard administrateur.

## Architecture

```
agrimarket/
├── backend/          # API REST Java Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/agrimarket/
│   │   │   │   ├── controller/    # Contrôleurs REST
│   │   │   │   ├── model/         # Entités JPA
│   │   │   │   ├── repository/    # Repositories
│   │   │   │   ├── service/       # Services métier
│   │   │   │   └── config/        # Configuration
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── pom.xml
│   └── README.md
└── frontend/         # Application React + Tailwind
    ├── src/
    │   ├── app/           # Application client
    │   ├── dashboard/     # Dashboard admin
    │   ├── components/    # Composants partagés
    │   ├── services/      # Services API
    │   └── styles/        # Styles globaux
    ├── package.json
    └── vite.config.ts
```

## Fonctionnalités

### Application Client
- ✅ Catalogue de produits avec filtres par catégorie
- ✅ Recherche de produits
- ✅ Panier d'achat fonctionnel
- ✅ Interface moderne basée sur le design Figma
- ✅ Navigation responsive

### Dashboard Administrateur
- ✅ Gestion des produits (ajouter, modifier, supprimer)
- ✅ Gestion des producteurs/agriculteurs (ajouter, modifier, supprimer)
- ✅ Gestion des clients (ajouter, modifier, supprimer)
- ✅ Gestion des commandes (voir détails, confirmer)
- ✅ Gestion des catégories (ajouter, modifier, supprimer)
- ✅ Gestion des saisons (ajouter, modifier, supprimer)
- ✅ Gestion des stocks (visualiser, réapprovisionner)

### Backend API REST
- ✅ API complète avec endpoints pour toutes les entités
- ✅ CRUD complet pour : produits, agriculteurs, clients, commandes, catégories, saisons, stocks
- ✅ Validation des données
- ✅ CORS configuré pour le frontend
- ✅ Base de données PostgreSQL

## Prérequis

### Backend
- Java 17 ou supérieur
- Maven 3.6+
- PostgreSQL 12+

### Frontend
- Node.js 18+
- pnpm (ou npm)

## Installation et Démarrage

### 1. Base de données PostgreSQL

Créez une base de données PostgreSQL :

```bash
psql -U postgres
CREATE DATABASE agrimarket;
\q
```

Exécutez le script SQL fourni dans `src/imports/pasted_text/agrimarket-db.txt` pour créer les tables.

### 2. Backend Java

```bash
cd backend

# Configurez la connexion à la base de données
# Éditez src/main/resources/application.properties si nécessaire

# Compilez et lancez le backend
mvn clean install
mvn spring-boot:run
```

Le backend démarre sur `http://localhost:8080`

### 3. Frontend React

```bash
cd frontend

# Installez les dépendances
pnpm install

# Démarrez le serveur de développement
pnpm dev
```

Le frontend démarre sur `http://localhost:5173`

## Accès aux Applications

- **Application Client** : http://localhost:5173/
- **Dashboard Admin** : http://localhost:5173/dashboard
- **API Backend** : http://localhost:8080/api

## Endpoints API

### Produits
- `GET /api/produits` - Liste des produits actifs
- `GET /api/produits/{id}` - Détails d'un produit
- `POST /api/produits` - Créer un produit
- `PUT /api/produits/{id}` - Modifier un produit
- `DELETE /api/produits/{id}` - Supprimer un produit (soft delete)

### Catégories
- `GET /api/categories` - Liste des catégories actives
- `GET /api/categories/{id}` - Détails d'une catégorie
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/{id}` - Modifier une catégorie
- `DELETE /api/categories/{id}` - Supprimer une catégorie

### Agriculteurs (Producteurs)
- `GET /api/agriculteurs` - Liste des agriculteurs actifs
- `GET /api/agriculteurs/{id}` - Détails d'un agriculteur
- `POST /api/agriculteurs` - Créer un agriculteur
- `PUT /api/agriculteurs/{id}` - Modifier un agriculteur
- `DELETE /api/agriculteurs/{id}` - Supprimer un agriculteur

### Clients
- `GET /api/clients` - Liste des clients actifs
- `GET /api/clients/{id}` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/{id}` - Modifier un client
- `DELETE /api/clients/{id}` - Supprimer un client

### Commandes
- `GET /api/commandes` - Liste des commandes
- `GET /api/commandes/{id}` - Détails d'une commande
- `POST /api/commandes` - Créer une commande
- `PUT /api/commandes/{id}/statut` - Mettre à jour le statut
- `DELETE /api/commandes/{id}` - Supprimer une commande

### Saisons
- `GET /api/saisons` - Liste des saisons
- `GET /api/saisons/{id}` - Détails d'une saison
- `POST /api/saisons` - Créer une saison
- `PUT /api/saisons/{id}` - Modifier une saison
- `DELETE /api/saisons/{id}` - Supprimer une saison

### Stocks
- `GET /api/stocks` - Liste des stocks
- `GET /api/stocks/produit/{produitId}` - Stock d'un produit
- `PUT /api/stocks/{id}/reapprovisionner?quantite=X` - Réapprovisionner
- `PUT /api/stocks/{id}` - Modifier le stock

## Utilisation du Dashboard Admin

1. Accédez à http://localhost:5173/dashboard
2. Sélectionnez une section dans le menu latéral
3. Utilisez les boutons d'action :
   - **Ajouter** : Créer un nouvel élément
   - **Modifier** (icône crayon) : Éditer un élément existant
   - **Supprimer** (icône poubelle) : Supprimer un élément
   - **Voir** (icône œil) : Voir les détails (commandes)
   - **Confirmer** (icône check) : Confirmer une commande
   - **Réapprovisionner** : Ajouter du stock

## Utilisation de l'Application Client

1. Accédez à http://localhost:5173/
2. Parcourez les produits par catégorie
3. Recherchez des produits spécifiques
4. Cliquez sur **+** pour ajouter au panier
5. Cliquez sur l'icône panier pour voir votre commande
6. Validez votre commande

## Technologies Utilisées

### Backend
- Java 17
- Spring Boot 3.2.4
- Spring Data JPA
- PostgreSQL
- Lombok
- Maven

### Frontend
- React 18.3.1
- TypeScript
- Vite 6.3.5
- Tailwind CSS 4.1.12
- React Router 7.13.0
- Axios
- Lucide React (icônes)

## Modèle de Données

Le schéma de base de données comprend :
- **Saison** : Saisons agricoles
- **Categorie** : Catégories de produits
- **Agriculteur** : Producteurs partenaires
- **Client** : Clients/consommateurs
- **Produit** : Catalogue de produits
- **Stock** : Gestion des stocks
- **Commande** : Commandes clients
- **LigneCommande** : Détails des produits commandés
- **Livraison** : Suivi des livraisons (à implémenter)
- **Paiement** : Gestion des paiements (à implémenter)

## Améliorations Futures

- [ ] Authentification et autorisation (JWT)
- [ ] Upload d'images pour les produits
- [ ] Système de paiement en ligne
- [ ] Suivi de livraison en temps réel
- [ ] Notifications email
- [ ] Statistiques et rapports dans le dashboard
- [ ] Export de données (PDF, Excel)
- [ ] Filtres avancés et tri
- [ ] Gestion des promotions
- [ ] Avis et notes clients

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub.

## Licence

MIT License - Voir le fichier LICENSE pour plus de détails.
