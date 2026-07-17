# AgriMarket Backend - API REST Java Spring Boot

Backend API REST pour l'application AgriMarket.

## Démarrage rapide

### 1. Configuration de la base de données

Éditez `src/main/resources/application.properties` :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/agrimarket
spring.datasource.username=votre_username
spring.datasource.password=votre_password
```

### 2. Compilation et exécution

```bash
mvn clean install
mvn spring-boot:run
```

L'API démarre sur http://localhost:8080

## Structure du projet

```
src/main/java/com/agrimarket/
├── AgriMarketApplication.java    # Point d'entrée
├── config/
│   └── CorsConfig.java           # Configuration CORS
├── controller/                   # Contrôleurs REST
│   ├── ProduitController.java
│   ├── CategorieController.java
│   ├── AgriculteurController.java
│   ├── ClientController.java
│   ├── CommandeController.java
│   ├── SaisonController.java
│   └── StockController.java
├── model/                        # Entités JPA
│   ├── Produit.java
│   ├── Categorie.java
│   ├── Agriculteur.java
│   ├── Client.java
│   ├── Commande.java
│   ├── LigneCommande.java
│   ├── Saison.java
│   └── Stock.java
└── repository/                   # Repositories Spring Data
    ├── ProduitRepository.java
    ├── CategorieRepository.java
    ├── AgriculteurRepository.java
    ├── ClientRepository.java
    ├── CommandeRepository.java
    ├── SaisonRepository.java
    └── StockRepository.java
```

## Endpoints disponibles

Tous les endpoints sont préfixés par `/api`

### Santé de l'API
- `GET /actuator/health` - Statut de l'application

### Documentation
Pour une documentation complète des endpoints, consultez le README principal.

## Dépendances principales

- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- PostgreSQL Driver
- Lombok
- Spring Boot Starter Validation

## Configuration

### Port du serveur
```properties
server.port=8080
```

### Hibernate
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## Tests

```bash
mvn test
```

## Build de production

```bash
mvn clean package
java -jar target/agrimarket-backend-1.0.0.jar
```
