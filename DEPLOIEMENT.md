# Guide de déploiement Vercel + Render

## Frontend (Vercel)

### 1. Créer un compte Vercel
- Allez sur https://vercel.com
- Inscrivez-vous avec GitHub

### 2. Connecter votre repo GitHub
- Forcer votre projet sur GitHub (si pas déjà fait)
- Importez le repo sur Vercel
- Choisissez la branche `main` ou `master`

### 3. Configurer les variables d'environnement
Dans Vercel → Settings → Environment Variables :
- `VITE_API_BASE_URL` = `https://agrimarket-backend.onrender.com/api` (changez avec votre URL Render)

### 4. Configurer le build
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Output Directory: `dist`

### 5. Déployer
- Cliquez sur "Deploy" → Vercel va compiler et déployer automatiquement

---

## Backend + Database (Render)

### 1. Créer un compte Render
- Allez sur https://render.com
- Inscrivez-vous avec GitHub

### 2. Créer un nouveau service
- Dashboard → "New +" → "Blueprint"
- Connectez votre repo GitHub
- Choisissez votre branche

### 3. Déployer avec render.yaml
Render va automatiquement :
- Créer une base PostgreSQL gratuite
- Builder et déployer le backend Spring Boot
- Configurer les variables d'environnement

**Attendre ~5-10 minutes** pour que tout soit déployé

### 4. Récupérer l'URL du backend
Après déploiement :
- Allez dans le service web "agrimarket-backend"
- Copiez l'URL (ex: `https://agrimarket-backend.onrender.com`)

### 5. Mettre à jour Vercel
- Allez dans Vercel → Settings → Environment Variables
- Changez `VITE_API_BASE_URL` = `https://agrimarket-backend.onrender.com/api`
- Cliquez "Redeploy"

---

## Checklist avant de déployer

- [ ] GitHub repo configuré et pushé avec tous les fichiers
- [ ] `backend/application-prod.properties` créé ✅
- [ ] `backend/Dockerfile` créé ✅
- [ ] `render.yaml` à la racine ✅
- [ ] `frontend/vercel.json` créé ✅
- [ ] Backend compile en local : `mvn clean package -DskipTests`
- [ ] Frontend compile en local : `npm run build`

---

## Résumé des URLs après déploiement

- **Frontend** : https://YOUR-VERCEL-APP.vercel.app
- **Backend** : https://agrimarket-backend.onrender.com/api
- **Database** : PostgreSQL managée par Render (connexion automatique)

---

## Troubleshooting

### Backend démarre mais en sleep ?
Normal sur Render free tier. Première requête prend 30-50s.

### Erreur CORS ?
Vérifiez dans `application-prod.properties` :
```
spring.web.cors.allowed-origins=*
```

### Pas d'accès à la base de données ?
Render configure automatiquement. Vérifiez les logs :
- Render Dashboard → agrimarket-backend → Logs
