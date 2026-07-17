# Structure du Projet AgriMarket

## Arborescence Complète

```
agrimarket/
├── README.md                          # Documentation principale
├── STRUCTURE.md                       # Ce fichier
│
├── backend/                           # Backend Java Spring Boot
│   ├── pom.xml                        # Configuration Maven
│   ├── .gitignore
│   ├── README.md
│   └── src/
│       └── main/
│           ├── java/com/agrimarket/
│           │   ├── AgriMarketApplication.java
│           │   ├── config/
│           │   │   └── CorsConfig.java
│           │   ├── controller/
│           │   │   ├── ProduitController.java
│           │   │   ├── CategorieController.java
│           │   │   ├── AgriculteurController.java
│           │   │   ├── ClientController.java
│           │   │   ├── CommandeController.java
│           │   │   ├── SaisonController.java
│           │   │   └── StockController.java
│           │   ├── model/
│           │   │   ├── Produit.java
│           │   │   ├── Categorie.java
│           │   │   ├── Agriculteur.java
│           │   │   ├── Client.java
│           │   │   ├── Commande.java
│           │   │   ├── LigneCommande.java
│           │   │   ├── Saison.java
│           │   │   └── Stock.java
│           │   └── repository/
│           │       ├── ProduitRepository.java
│           │       ├── CategorieRepository.java
│           │       ├── AgriculteurRepository.java
│           │       ├── ClientRepository.java
│           │       ├── CommandeRepository.java
│           │       ├── SaisonRepository.java
│           │       └── StockRepository.java
│           └── resources/
│               └── application.properties
│
└── frontend/                          # Frontend React + Tailwind
    ├── package.json
    ├── vite.config.ts
    ├── .gitignore
    ├── index.html
    └── src/
        ├── main.tsx                   # Point d'entrée
        ├── app/
        │   └── App.tsx                # Application client
        ├── dashboard/
        │   └── Dashboard.tsx          # Dashboard admin
        ├── components/
        │   └── Panier.tsx             # Composant panier
        ├── services/
        │   └── api.ts                 # Services API
        └── styles/
            └── index.css              # Styles globaux
```

## Fichiers Clés

### Backend

| Fichier | Description |
|---------|-------------|
| `AgriMarketApplication.java` | Point d'entrée Spring Boot |
| `CorsConfig.java` | Configuration CORS pour le frontend |
| `*Controller.java` | Contrôleurs REST avec endpoints API |
| `*.java` (model) | Entités JPA mappées à la BDD |
| `*Repository.java` | Interfaces Spring Data JPA |
| `application.properties` | Configuration application |

### Frontend

| Fichier | Description |
|---------|-------------|
| `main.tsx` | Point d'entrée React avec routing |
| `App.tsx` | Application client avec catalogue produits |
| `Dashboard.tsx` | Interface admin complète |
| `Panier.tsx` | Gestion du panier d'achat |
| `api.ts` | Services pour appels API backend |
| `index.css` | Styles Tailwind CSS |

## Flux de Données

```
Frontend (React)
    ↓
api.ts (Axios)
    ↓
Backend API REST (Spring Boot)
    ↓
JPA Repositories
    ↓
PostgreSQL Database
```

## Modules et Responsabilités

### Backend - Controllers
- Gestion des requêtes HTTP
- Validation des données
- Transformation des réponses

### Backend - Models
- Entités JPA
- Annotations de validation
- Relations entre tables

### Backend - Repositories
- Accès aux données
- Requêtes personnalisées
- Gestion transactions

### Frontend - App
- Interface utilisateur client
- Catalogue de produits
- Panier d'achat

### Frontend - Dashboard
- Interface administrateur
- CRUD complet
- Gestion des stocks

### Frontend - Services
- Appels API
- Gestion des erreurs
- Centralisation des endpoints
