export interface Categorie {
  id: number;
  libelle: string;
  description?: string;
  estActive: boolean;
  icone?: string;
}

export interface Saison {
  id: number;
  nomSaison: string;
  dateDebut: string;
  dateFin: string;
  description?: string;
  icone?: string;
}

export interface Agriculteur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  codePostal?: string;
  nomExploitation?: string;
  ville?: string;
  description?: string;
  photoUrl?: string;
  estVerifie?: boolean;
  estActif: boolean;
}

export interface Produit {
  id: number;
  nomProduit: string;
  descriptionProduit?: string;
  variete?: string;
  prixUnitaire: number;
  uniteMesure: string;
  imageUrl?: string;
  estBio: boolean;
  estLocal: boolean;
  estActif: boolean;
  estNouveau: boolean;
  note?: number;
  nbAvis?: number;
  categorie?: Categorie;
  agriculteur?: Agriculteur;
  saison?: Saison;
  // champs mock uniquement
  categorieId?: number;
}

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  genre?: string;
  email: string;
  telephone?: string;
  adresseLivraison?: string;
  codePostal?: string;
  ville?: string;
  imageProfil?: string;
  estActif: boolean;
}

export interface LigneCommande {
  id?: number;
  produitId?: number;
  produit?: Produit;
  quantite: number;
  prixUnitaire?: number;
  prixUnitaireSnapshot?: number;
  prixLigne?: number;
}

export interface Commande {
  id: number;
  numeroCommande: string;
  dateCommande: string;
  statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'EN_PREPARATION' | 'EXPEDIEE' | 'LIVREE' | 'ANNULEE';
  total: number;
  adresseLivraison?: string;
  notes?: string;
  client?: Client;
  lignesCommande?: LigneCommande[];
}

export interface Stock {
  id: number;
  quantiteDisponible: number;
  seuilAlerte: number;
  dateMiseAJour?: string;
  produit?: {
    id: number;
    nomProduit: string;
    uniteMesure: string;
    imageUrl?: string;
  };
}

export interface PanierItem {
  id: number;
  nomProduit: string;
  prixUnitaire: number;
  quantite: number;
  imageUrl?: string;
  uniteMesure: string;
}

export interface FrontendSetting {
  id: number;
  section: string;
  title: string;
  highlightText: string;
  description: string;
  linkUrl?: string;
  buttonLabel?: string;
  gradientFrom: string;
  gradientTo: string;
  estActif?: boolean;
}
