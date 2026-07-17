# Guide de Démarrage Rapide - AgriMarket

Ce guide vous accompagne pas à pas pour lancer l'application AgriMarket.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- ✅ **Java 17+** - [Télécharger](https://adoptium.net/)
- ✅ **Maven 3.6+** - [Télécharger](https://maven.apache.org/download.cgi)
- ✅ **PostgreSQL 12+** - [Télécharger](https://www.postgresql.org/download/)
- ✅ **Node.js 18+** - [Télécharger](https://nodejs.org/)
- ✅ **pnpm** - Installer avec `npm install -g pnpm`

## 🚀 Installation en 5 étapes

### Étape 1 : Cloner le projet

```bash
git clone <votre-repo>
cd agrimarket
```

### Étape 2 : Configurer PostgreSQL

```bash
# Connectez-vous à PostgreSQL
psql -U postgres

# Créez la base de données
CREATE DATABASE agrimarket;

# Quittez
\q
```

Exécutez le script SQL principal (fourni dans le fichier texte) :

```bash
psql -U postgres -d agrimarket -f src/imports/pasted_text/agrimarket-db.txt
```

Puis insérez les données de démonstration :

```bash
psql -U postgres -d agrimarket -f backend/init-demo-data.sql
```

### Étape 3 : Configurer le Backend

Éditez `backend/src/main/resources/application.properties` si nécessaire :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/agrimarket
spring.datasource.username=postgres
spring.datasource.password=votre_mot_de_passe
```

### Étape 4 : Démarrer le Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

✅ Le backend démarre sur **http://localhost:8080**

Vérifiez qu'il fonctionne :
```bash
curl http://localhost:8080/api/produits
```

### Étape 5 : Démarrer le Frontend

Ouvrez un nouveau terminal :

```bash
cd frontend
pnpm install
pnpm dev
```

✅ Le frontend démarre sur **http://localhost:5173**

## 🎯 Utilisation

### Application Client
1. Ouvrez http://localhost:5173/
2. Parcourez les produits
3. Ajoutez des produits au panier avec le bouton **+**
4. Cliquez sur l'icône panier pour voir votre commande
5. Validez votre commande

### Dashboard Admin
1. Ouvrez http://localhost:5173/dashboard
2. Gérez vos données :
   - **Produits** : Ajouter, modifier, supprimer
   - **Producteurs** : Gérer les agriculteurs
   - **Clients** : Gérer les utilisateurs
   - **Commandes** : Voir détails et confirmer
   - **Catégories** : Organiser les produits
   - **Saisons** : Gérer la saisonnalité
   - **Stocks** : Réapprovisionner

## 🔧 Résolution de problèmes

### Le backend ne démarre pas

**Problème** : Erreur de connexion à PostgreSQL
```
Solution:
1. Vérifiez que PostgreSQL est démarré
2. Vérifiez les identifiants dans application.properties
3. Assurez-vous que la base agrimarket existe
```

**Problème** : Port 8080 déjà utilisé
```
Solution: Changez le port dans application.properties
server.port=8081
```

### Le frontend ne se connecte pas au backend

**Problème** : Erreur CORS ou 404
```
Solution:
1. Vérifiez que le backend est démarré
2. Vérifiez l'URL dans frontend/src/services/api.ts
3. Vérifiez la configuration CORS dans CorsConfig.java
```

### Les données ne s'affichent pas

**Problème** : Pas de données dans l'application
```
Solution:
1. Exécutez le script init-demo-data.sql
2. Vérifiez avec: psql -d agrimarket -c "SELECT COUNT(*) FROM produit;"
3. Rechargez la page
```

## 📊 Données de Test

Après avoir exécuté `init-demo-data.sql`, vous disposerez de :

- 🌱 **4 saisons** (Printemps, Été, Automne, Hiver)
- 📦 **5 catégories** (Légumes, Fruits, Herbes, etc.)
- 👨‍🌾 **4 agriculteurs** avec exploitations
- 👥 **4 clients** de test
- 🥕 **10 produits** variés avec prix
- 📦 **10 stocks** avec alertes
- 🛒 **4 commandes** avec différents statuts

## 🌐 URLs importantes

| Service | URL | Description |
|---------|-----|-------------|
| App Client | http://localhost:5173/ | Interface utilisateur |
| Dashboard Admin | http://localhost:5173/dashboard | Interface admin |
| API Backend | http://localhost:8080/api | API REST |
| API Produits | http://localhost:8080/api/produits | Liste produits |
| API Commandes | http://localhost:8080/api/commandes | Liste commandes |

## 📖 Documentation

- [README.md](README.md) - Documentation complète
- [STRUCTURE.md](STRUCTURE.md) - Architecture du projet
- [backend/README.md](backend/README.md) - Documentation backend

## 🆘 Support

En cas de problème :
1. Consultez la section "Résolution de problèmes" ci-dessus
2. Vérifiez les logs du backend
3. Vérifiez la console du navigateur (F12)
4. Ouvrez une issue sur GitHub

## ✅ Checklist de vérification

Avant de commencer à utiliser l'application :

- [ ] PostgreSQL est installé et démarré
- [ ] La base de données `agrimarket` existe
- [ ] Les tables sont créées (script SQL principal)
- [ ] Les données de démo sont insérées
- [ ] Le backend démarre sans erreur (port 8080)
- [ ] Le frontend démarre sans erreur (port 5173)
- [ ] L'API répond : `curl http://localhost:8080/api/produits`
- [ ] L'application client s'affiche correctement
- [ ] Le dashboard admin est accessible

Bon développement ! 🚀
