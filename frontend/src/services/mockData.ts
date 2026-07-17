// Données mockées pour la démo sans backend

export const mockProduits = [
  {
    id: 1, categorieId: 1,
    nomProduit: 'Tomates Cœur de Bœuf',
    descriptionProduit: 'Tomates juteuses et savoureuses, récoltées à maturité dans nos serres locales. Idéales pour salades, sauces et gratins.',
    prixUnitaire: 4.50, uniteMesure: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80',
    estBio: true, estLocal: true, estActif: true, estNouveau: true,
    note: 4.8, nbAvis: 124,
  },
  {
    id: 2, categorieId: 1,
    nomProduit: 'Carottes Bio',
    descriptionProduit: 'Carottes fraîches cultivées sans pesticides. Croquantes et sucrées, parfaites crues ou cuites.',
    prixUnitaire: 2.90, uniteMesure: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
    estBio: true, estLocal: true, estActif: true, estNouveau: false,
    note: 4.5, nbAvis: 89,
  },
  {
    id: 3, categorieId: 1,
    nomProduit: 'Salade Batavia',
    descriptionProduit: 'Salade croquante et fraîche, cueillie le matin même. Feuilles larges et tendres, légèrement sucrées.',
    prixUnitaire: 1.80, uniteMesure: 'pièce',
    imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&q=80',
    estBio: true, estLocal: true, estActif: true, estNouveau: false,
    note: 4.3, nbAvis: 56,
  },
  {
    id: 4, categorieId: 1,
    nomProduit: 'Ail Violet de Cadours',
    descriptionProduit: 'Ail violet AOC de qualité supérieure, cultivé dans la région de Cadours. Saveur intense et persistante.',
    prixUnitaire: 6.20, uniteMesure: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=400&q=80',
    estBio: false, estLocal: true, estActif: true, estNouveau: false,
    note: 4.7, nbAvis: 43,
  },
  {
    id: 5, categorieId: 1,
    nomProduit: 'Courgettes',
    descriptionProduit: 'Courgettes tendres du jardin, récoltées jeunes pour une texture fondante. Idéales poêlées, farcies ou en gratin.',
    prixUnitaire: 2.80, uniteMesure: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
    estBio: true, estLocal: true, estActif: true, estNouveau: false,
    note: 4.4, nbAvis: 67,
  },
  {
    id: 6, categorieId: 2,
    nomProduit: 'Fraises Gariguette',
    descriptionProduit: 'Fraises parfumées de plein champ, variété Gariguette reconnue pour son arôme exceptionnel et sa chair fondante.',
    prixUnitaire: 6.50, uniteMesure: 'barquette',
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80',
    estBio: true, estLocal: true, estActif: true, estNouveau: true,
    note: 4.9, nbAvis: 201,
  },
  {
    id: 7, categorieId: 1,
    nomProduit: 'Poivrons Mix',
    descriptionProduit: 'Assortiment de poivrons colorés — rouge, jaune, orange — croquants et sucrés, riches en vitamine C.',
    prixUnitaire: 3.50, uniteMesure: 'kg',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
    estBio: true, estLocal: true, estActif: true, estNouveau: false,
    note: 4.2, nbAvis: 38,
  },
  {
    id: 8, categorieId: 3,
    nomProduit: 'Basilic Grand Vert',
    descriptionProduit: 'Basilic frais en pot, variété Grand Vert. Feuilles larges et très parfumées, idéal pour le pesto et les salades.',
    prixUnitaire: 2.20, uniteMesure: 'pot',
    imageUrl: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&q=80',
    estBio: true, estLocal: true, estActif: true, estNouveau: false,
    note: 4.6, nbAvis: 52,
  },
];

export const mockCategories = [
  { id: 1, libelle: 'Légumes', description: 'Légumes frais de saison', estActive: true, icone: '🥦' },
  { id: 2, libelle: 'Fruits', description: 'Fruits frais et de saison', estActive: true, icone: '🍓' },
  { id: 3, libelle: 'Herbes', description: 'Herbes aromatiques fraîches', estActive: true, icone: '🌿' },
  { id: 4, libelle: 'Bio', description: 'Produits bio certifiés', estActive: true, icone: '🌱' },
];

export const mockAgriculteurs = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Marie',
    nomExploitation: 'Ferme des Collines',
    email: 'marie.dupont@ferme.fr',
    telephone: '+33 6 12 34 56 78',
    ville: 'Caen',
    estActif: true,
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Pierre',
    nomExploitation: 'Les Jardins du Soleil',
    email: 'pierre.martin@jardins.fr',
    telephone: '+33 6 98 76 54 32',
    ville: 'Aix-en-Provence',
    estActif: true,
  },
  {
    id: 3,
    nom: 'Bernard',
    prenom: 'Sophie',
    nomExploitation: 'Potager de Sophie',
    email: 'sophie.bernard@potager.fr',
    telephone: '+33 6 11 22 33 44',
    ville: 'Rennes',
    estActif: true,
  },
];

export const mockClients = [
  {
    id: 1,
    nom: 'Leroy',
    prenom: 'Jean',
    email: 'jean.leroy@email.fr',
    telephone: '+33 6 55 44 33 22',
    ville: 'Paris',
    estActif: true,
  },
  {
    id: 2,
    nom: 'Richard',
    prenom: 'Anne',
    email: 'anne.richard@email.fr',
    telephone: '+33 6 77 88 99 00',
    ville: 'Lyon',
    estActif: true,
  },
  {
    id: 3,
    nom: 'Moreau',
    prenom: 'Lucas',
    email: 'lucas.moreau@email.fr',
    telephone: '+33 6 33 22 11 00',
    ville: 'Bordeaux',
    estActif: true,
  },
];

export const mockCommandes = [
  {
    id: 1,
    numeroCommande: 'CMD-20260504-00001',
    dateCommande: new Date().toISOString(),
    statut: 'EN_ATTENTE',
    total: 25.40,
    adresseLivraison: '15 Avenue des Fleurs, 75001 Paris',
    notes: 'Livraison matinale svp',
  },
  {
    id: 2,
    numeroCommande: 'CMD-20260504-00002',
    dateCommande: new Date(Date.now() - 86400000).toISOString(),
    statut: 'CONFIRMEE',
    total: 18.60,
    adresseLivraison: '28 Rue du Commerce, 69001 Lyon',
    notes: '',
  },
  {
    id: 3,
    numeroCommande: 'CMD-20260504-00003',
    dateCommande: new Date(Date.now() - 172800000).toISOString(),
    statut: 'LIVREE',
    total: 32.50,
    adresseLivraison: '5 Place de la Mairie, 33000 Bordeaux',
    notes: 'Sonner au portail',
  },
];

export const mockSaisons = [
  {
    id: 1,
    nomSaison: 'Printemps',
    dateDebut: '2026-03-21',
    dateFin: '2026-06-20',
    description: 'Saison des semis et premières récoltes',
    icone: '🌸',
  },
  {
    id: 2,
    nomSaison: 'Été',
    dateDebut: '2026-06-21',
    dateFin: '2026-09-22',
    description: 'Saison des fruits et légumes du soleil',
    icone: '☀️',
  },
  {
    id: 3,
    nomSaison: 'Automne',
    dateDebut: '2026-09-23',
    dateFin: '2026-12-20',
    description: 'Saison des récoltes',
    icone: '🍂',
  },
  {
    id: 4,
    nomSaison: 'Hiver',
    dateDebut: '2025-12-21',
    dateFin: '2026-03-20',
    description: 'Saison des légumes racines',
    icone: '❄️',
  },
];

export const mockStocks = [
  { id: 1, produit: { nomProduit: 'Tomates Cœur de Bœuf' }, quantiteDisponible: 45, seuilAlerte: 15 },
  { id: 2, produit: { nomProduit: 'Carottes Bio' }, quantiteDisponible: 120, seuilAlerte: 20 },
  { id: 3, produit: { nomProduit: 'Salade Batavia' }, quantiteDisponible: 30, seuilAlerte: 10 },
  { id: 4, produit: { nomProduit: 'Fraises Gariguette' }, quantiteDisponible: 5, seuilAlerte: 10 },
  { id: 5, produit: { nomProduit: 'Courgettes' }, quantiteDisponible: 67, seuilAlerte: 15 },
];

export const mockFrontendSettings = [
  {
    id: 1,
    section: 'special-offer',
    title: 'Offre Spéciale',
    highlightText: '-30% sur les Tomates',
    description: 'Récoltées ce matin dans nos serres locales.',
    linkUrl: '/?search=Tomates',
    buttonLabel: 'Voir les tomates',
    gradientFrom: '#993d49',
    gradientTo: '#992027',
    estActif: true,
  },
];

// Simuler un délai réseau
export const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));
