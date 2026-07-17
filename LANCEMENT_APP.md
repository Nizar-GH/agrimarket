# 🚀 Comment Lancer l'Application AgriMarket

## 📋 Environnement Actuel (Figma Make)

Vous êtes actuellement dans un environnement **Figma Make** optimisé pour les applications React/Frontend.

**Limitations :**
- ❌ Pas de Java/Maven (backend ne peut pas tourner ici)
- ❌ Pas de PostgreSQL
- ✅ Node.js et pnpm disponibles (frontend uniquement)

## 🎯 Solutions Disponibles

### Option A : Demo Frontend avec Mock Data (ICI)

Pour tester l'interface immédiatement dans cet environnement :

**Je peux adapter le code pour :**
- Utiliser des données mockées côté frontend
- Simuler les appels API
- Vous permettre de voir l'UI et le panier fonctionner

**Commande :**
Demandez-moi de "créer une version frontend avec mock data"

---

### Option B : Application Complète (SUR VOTRE MACHINE)

Pour exécuter l'application complète avec backend Java :

#### 1. Prérequis
```bash
# Vérifiez que vous avez :
java -version    # Java 17+
mvn -version     # Maven 3.6+
node -version    # Node 18+
psql --version   # PostgreSQL 12+
```

#### 2. Clone et Configuration
```bash
# Clonez ou copiez le projet sur votre machine
cd agrimarket

# Créez la base de données
psql -U postgres
CREATE DATABASE agrimarket;
\q

# Exécutez les scripts SQL
psql -U postgres -d agrimarket -f src/imports/pasted_text/agrimarket-db.txt
psql -U postgres -d agrimarket -f backend/init-demo-data.sql
```

#### 3. Lancement Backend (Terminal 1)
```bash
cd backend

# Configurez application.properties si besoin
# spring.datasource.password=votre_mot_de_passe

# Démarrez le backend
mvn spring-boot:run

# Backend disponible sur http://localhost:8080
```

#### 4. Lancement Frontend (Terminal 2)
```bash
cd frontend

# Installez les dépendances
pnpm install

# Démarrez le frontend
pnpm dev

# Frontend disponible sur http://localhost:5173
```

#### 5. Accès
- **App Client** : http://localhost:5173/
- **Dashboard Admin** : http://localhost:5173/dashboard
- **API Backend** : http://localhost:8080/api

---

## 🔧 Dépannage

### Backend ne démarre pas
```bash
# Vérifiez PostgreSQL
sudo systemctl status postgresql  # Linux
brew services list                 # Mac

# Testez la connexion
psql -U postgres -d agrimarket -c "SELECT COUNT(*) FROM produit;"
```

### Port déjà utilisé
```bash
# Backend (8080)
lsof -i :8080
kill -9 <PID>

# Frontend (5173)
lsof -i :5173
kill -9 <PID>
```

### Erreur CORS
Vérifiez que `backend/src/main/java/com/agrimarket/config/CorsConfig.java` contient :
```java
config.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
```

---

## 📦 Export du Projet

Pour travailler localement :

```bash
# Téléchargez tous les fichiers de ce projet
# Créez une archive
zip -r agrimarket.zip backend/ frontend/ README.md GUIDE_DEMARRAGE.md

# Ou utilisez git
git init
git add .
git commit -m "Initial commit - AgriMarket"
```

---

**Quelle option souhaitez-vous utiliser ?**
