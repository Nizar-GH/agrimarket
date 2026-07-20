import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, Home, Heart, User, MapPin, Calendar, ArrowRight, X, Star, Plus, Shield } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import { produitsApi, categoriesApi, agriculteursApi, frontendApi, stocksApi, clientsApi, commandesApi } from '../services/api';
import { usePanier } from '../components/Panier';
import { useReCaptcha } from '../components/ReCaptchaWrapper';
import PanierModal from '../components/Panier';
import type { Produit, Categorie, Agriculteur, FrontendSetting, Stock, Commande } from '../services/types';
import { ICONES_CATEGORIES } from '../services/constants';

const INTERNATIONAL_CALLING_CODES = [
  { label: 'France', value: '+33' },
  { label: 'Belgique', value: '+32' },
  { label: 'Suisse', value: '+41' },
  { label: 'Luxembourg', value: '+352' },
  { label: 'Algérie', value: '+213' },
  { label: 'Maroc', value: '+212' },
  { label: 'Tunisie', value: '+216' },
  { label: 'Côte d’Ivoire', value: '+225' },
  { label: 'Sénégal', value: '+221' },
  { label: 'Cameroun', value: '+237' },
  { label: 'Mali', value: '+223' },
  { label: 'Niger', value: '+227' },
  { label: 'Burkina Faso', value: '+226' },
  { label: 'Togo', value: '+228' },
  { label: 'Bénin', value: '+229' },
];

const FRANCE_CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  paris: { lat: 48.8566, lon: 2.3522 },
  lyon: { lat: 45.764, lon: 4.8357 },
  marseille: { lat: 43.2965, lon: 5.3698 },
  toulouse: { lat: 43.6047, lon: 1.4442 },
  bordeaux: { lat: 44.8378, lon: -0.5792 },
  nantes: { lat: 47.2184, lon: -1.5536 },
  lille: { lat: 50.6292, lon: 3.0573 },
  strasbourg: { lat: 48.5734, lon: 7.7521 },
  rennes: { lat: 48.1173, lon: -1.6778 },
  montpellier: { lat: 43.611, lon: 3.8767 },
  nice: { lat: 43.7102, lon: 7.262 },
  dijon: { lat: 47.322, lon: 5.0415 },
  grenoble: { lat: 45.1885, lon: 5.7245 },
  orleans: { lat: 47.9029, lon: 1.9093 },
  tours: { lat: 47.3941, lon: 0.6848 },
  limoges: { lat: 45.8336, lon: 1.2611 },
  clermontferrand: { lat: 45.7772, lon: 3.087 },
  caen: { lat: 49.1829, lon: -0.3707 },
  rouen: { lat: 49.4431, lon: 1.0993 },
  amiens: { lat: 49.8941, lon: 2.2958 },
  reims: { lat: 49.2583, lon: 4.0317 },
  metz: { lat: 49.1193, lon: 6.1757 },
  angers: { lat: 47.4784, lon: -0.5632 },
  poitiers: { lat: 46.5802, lon: 0.3404 },
  perigueux: { lat: 45.184, lon: 0.7213 },
  larochelle: { lat: 46.1603, lon: -1.1511 },
  bayonne: { lat: 43.4929, lon: -1.4748 },
  biarritz: { lat: 43.4832, lon: -1.5586 },
  pau: { lat: 43.2951, lon: -0.3708 },
  perpignan: { lat: 42.6887, lon: 2.8948 },
  toulon: { lat: 43.1242, lon: 5.928 },
  avignon: { lat: 43.9493, lon: 4.8055 },
  ajaccio: { lat: 41.9192, lon: 8.7386 },
  bastia: { lat: 42.6973, lon: 9.4509 },
};

const normalizeCityName = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

const getCityCoordinates = (city?: string | null) => {
  if (!city) {
    return null;
  }

  return FRANCE_CITY_COORDINATES[normalizeCityName(city)] || null;
};

function AppContent() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [agriculteurs, setAgriculteurs] = useState<Agriculteur[]>([]);
  const [villesDisponibles, setVillesDisponibles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [panierOpen, setPanierOpen] = useState(false);
  const { ajouterAuPanier, items } = usePanier();
  const { getRecaptchaToken } = useReCaptcha();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [categorieActive, setCategorieActive] = useState<number | null>(null);
  const [bioFilter, setBioFilter] = useState<'all' | 'bio' | 'nonbio'>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openVilles, setOpenVilles] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [hasAccount, setHasAccount] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [openHistoryOnModal, setOpenHistoryOnModal] = useState(false);
  const [showProfileHistory, setShowProfileHistory] = useState(false);
  const [connectedProfileImage, setConnectedProfileImage] = useState('');
  const [connectedUserName, setConnectedUserName] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileMode, setProfileMode] = useState<'login' | 'register' | 'edit'>('login');
  const [profileForm, setProfileForm] = useState({
    nom: '',
    prenom: '',
    genre: '',
    indicatif: '+33',
    email: '',
    telephone: '',
    adressePostale: '',
    codePostal: '',
    ville: '',
    imageProfil: '',
    password: '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileOrders, setProfileOrders] = useState<Commande[]>([]);
  const [profileOrdersLoading, setProfileOrdersLoading] = useState(false);
  const profileHistoryRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const [frontendOffer, setFrontendOffer] = useState<FrontendSetting | null>(null);
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
  const [selectedProduitStock, setSelectedProduitStock] = useState<Stock | null>(null);
  const [selectedProduitStockLoading, setSelectedProduitStockLoading] = useState(false);
  const [carteOpen, setCarteOpen] = useState(false);

  const clearCitySelection = () => {
    setSelectedCity(null);
  };

  const clearSearchQuery = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleVoirTomatesClick = () => {
    setSearchQuery('Tomates');
    setCategorieActive(null);
    setOpenVilles(false);
    setShowSuggestions(false);
  };

  const handleVoirToutCategoriesClick = () => {
    setCategorieActive(null);
    setSelectedCity(null);
    setSearchQuery('');
    setOpenVilles(false);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (!selectedProduit) {
      setSelectedProduitStock(null);
      setSelectedProduitStockLoading(false);
      return;
    }

    let cancelled = false;
    const loadStock = async () => {
      setSelectedProduitStockLoading(true);
      try {
        const response = await stocksApi.getByProduitId(selectedProduit.id);
        if (!cancelled) {
          setSelectedProduitStock(response.data || null);
        }
      } catch (error) {
        if (!cancelled) {
          setSelectedProduitStock(null);
        }
      } finally {
        if (!cancelled) {
          setSelectedProduitStockLoading(false);
        }
      }
    };

    loadStock();

    return () => {
      cancelled = true;
    };
  }, [selectedProduit]);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const storedUserRaw = localStorage.getItem('user');
    const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
    setHasAccount(!!authToken);
    setConnectedProfileImage(storedUser?.imageProfil || '');
    setConnectedUserName([storedUser?.prenom, storedUser?.nom].filter(Boolean).join(' ').trim());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
      setShowSuggestions(false);
    }
  }, [location.search]);

  const profileButtonLabel = hasAccount ? (connectedUserName || 'Mon profil') : 'Profil';

  useEffect(() => {
    if (!profileMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current) {
        return;
      }

      if (!profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const splitPhoneNumber = (telephone: string) => {
    const cleanPhone = (telephone || '').trim();
    const foundCode = INTERNATIONAL_CALLING_CODES.find((code) => cleanPhone.startsWith(code.value));
    if (!foundCode) {
      return { indicatif: '+33', numero: cleanPhone };
    }

    const numero = cleanPhone.slice(foundCode.value.length).trim();
    return { indicatif: foundCode.value, numero };
  };

  const getPostalCodeValidationMessage = (postalCode: string, indicatif: string) => {
    const value = postalCode.trim();

    if (!value) {
      return 'Champ manquant: Code postal.';
    }

    if (indicatif === '+33' && !/^\d{5}$/.test(value)) {
      return 'Code postal invalide: 5 chiffres requis pour la France.';
    }

    return '';
  };

  const buildFormFromUser = (storedUser: any) => {
    const phoneParts = splitPhoneNumber(storedUser?.telephone || '');
    return {
      nom: storedUser?.nom || '',
      prenom: storedUser?.prenom || '',
      genre: storedUser?.genre || '',
      indicatif: phoneParts.indicatif,
      email: storedUser?.email || '',
      telephone: phoneParts.numero,
      adressePostale: storedUser?.adressePostale || storedUser?.adresseLivraison || '',
      codePostal: storedUser?.codePostal || '',
      ville: storedUser?.ville || '',
      imageProfil: storedUser?.imageProfil || '',
      password: '',
    };
  };

  const handleProfileClick = () => {
    if (hasAccount) {
      setProfileMenuOpen((current: boolean) => !current);
      return;
    }

    const authToken = localStorage.getItem('authToken');
    const storedUserRaw = localStorage.getItem('user');
    const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

    setHasAccount(!!authToken);
    setProfileMessage('');

    if (authToken && storedUser) {
      setConnectedProfileImage(storedUser?.imageProfil || '');
      setConnectedUserName([storedUser?.prenom, storedUser?.nom].filter(Boolean).join(' ').trim());
      setProfileForm(buildFormFromUser(storedUser));
      setProfileMode('edit');
      setShowProfileHistory(false);
      loadProfileOrders(storedUser);
    } else {
      setProfileMode(storedUser ? 'login' : 'register');
      setShowProfileHistory(false);
      setProfileOrders([]);
      if (storedUser?.email) {
        setProfileForm((current: typeof profileForm) => ({ ...current, email: storedUser.email, password: '' }));
      }
    }

    setProfileModalOpen(true);
  };

  const openProfileEditFromMenu = (openHistory: boolean) => {
    const authToken = localStorage.getItem('authToken');
    const storedUserRaw = localStorage.getItem('user');
    const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

    setProfileMenuOpen(false);

    if (!authToken || !storedUser) {
      handleProfileClick();
      return;
    }

    setProfileMessage('');
    setConnectedProfileImage(storedUser?.imageProfil || '');
    setConnectedUserName([storedUser?.prenom, storedUser?.nom].filter(Boolean).join(' ').trim());
    setProfileForm(buildFormFromUser(storedUser));
    setProfileMode('edit');
    setShowProfileHistory(openHistory);
    setOpenHistoryOnModal(openHistory);
    loadProfileOrders(storedUser);
    setProfileModalOpen(true);
  };

  const handleLogout = () => {
    setProfileMenuOpen(false);
    localStorage.removeItem('authToken');
    setHasAccount(false);
    setConnectedProfileImage('');
    setConnectedUserName('');
    setProfileMode('login');
    setProfileMessage('Déconnecté.');
    window.location.reload();
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
    setProfileMessage('');
    setProfileOrdersLoading(false);
    setOpenHistoryOnModal(false);
    setShowProfileHistory(false);
  };

  const loadProfileOrders = async (storedUser: any) => {
    const clientId = Number(storedUser?.id || 0);
    const email = String(storedUser?.email || '').trim().toLowerCase();

    if (!clientId && !email) {
      setProfileOrders([]);
      return;
    }

    setProfileOrdersLoading(true);
    try {
      const response = await commandesApi.getAll();
      const orders = Array.isArray(response?.data) ? response.data : [];
      const filtered = orders
        .filter((commande: any) => {
          const orderClientId = Number(commande?.client?.id || 0);
          const orderEmail = String(commande?.client?.email || '').trim().toLowerCase();
          return (clientId > 0 && orderClientId === clientId) || (email && orderEmail === email);
        })
        .sort((a: any, b: any) => new Date(b?.dateCommande || 0).getTime() - new Date(a?.dateCommande || 0).getTime());
      setProfileOrders(filtered);
    } catch (error) {
      setProfileOrders([]);
    } finally {
      setProfileOrdersLoading(false);
    }
  };

  useEffect(() => {
    const handleCommandeCreated = () => {
      if (!profileModalOpen || profileMode !== 'edit') {
        return;
      }
      const storedUserRaw = localStorage.getItem('user');
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
      if (storedUser) {
        loadProfileOrders(storedUser);
      }
    };

    window.addEventListener('agrimarket:commande-created', handleCommandeCreated);
    return () => window.removeEventListener('agrimarket:commande-created', handleCommandeCreated);
  }, [profileModalOpen, profileMode]);

  useEffect(() => {
    if (!profileModalOpen || profileMode !== 'edit' || !openHistoryOnModal) {
      return;
    }

    const timer = window.setTimeout(() => {
      profileHistoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setOpenHistoryOnModal(false);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [profileModalOpen, profileMode, openHistoryOnModal, profileOrdersLoading]);

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setProfileMessage('Fichier invalide. Choisis une image.');
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setProfileMessage('Image trop lourde (max 2 Mo).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageProfil = typeof reader.result === 'string' ? reader.result : '';
      setProfileForm((current: typeof profileForm) => ({ ...current, imageProfil }));
      setProfileMessage('Image sélectionnée. Enregistre ton profil pour la sauvegarder.');
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (profileMode === 'edit') {
      const storedUserRaw = localStorage.getItem('user');
      if (!storedUserRaw) {
        setProfileMessage('Profil introuvable. Reconnecte-toi.');
        return;
      }

      const storedUser = JSON.parse(storedUserRaw) as { id?: number };
      if (!storedUser.id) {
        setProfileMessage('Impossible de modifier ce profil local. Recrée un compte.');
        return;
      }

      const phoneNumber = profileForm.telephone.trim();
      const emailValue = profileForm.email.trim().toLowerCase();
      const isEmailValid = /^\S+@\S+\.\S+$/.test(emailValue);

      const requiredFields = [
        { label: 'Nom', value: profileForm.nom.trim() },
        { label: 'Prénom', value: profileForm.prenom.trim() },
        { label: 'Genre', value: profileForm.genre.trim() },
        { label: 'Email', value: emailValue },
        { label: 'Numéro de téléphone', value: phoneNumber },
        { label: 'Adresse postale', value: profileForm.adressePostale.trim() },
        { label: 'Code postal', value: profileForm.codePostal.trim() },
        { label: 'Ville', value: profileForm.ville.trim() },
      ];

      const missingField = requiredFields.find((field) => !field.value);
      if (missingField) {
        setProfileMessage(`Champ manquant: ${missingField.label}.`);
        return;
      }

      if (!isEmailValid) {
        setProfileMessage('Email invalide. Vérifie l’adresse saisie.');
        return;
      }

      const postalCodeValidationMessage = getPostalCodeValidationMessage(profileForm.codePostal, profileForm.indicatif);
      if (postalCodeValidationMessage) {
        setProfileMessage(postalCodeValidationMessage);
        return;
      }

      if (profileForm.password.trim() && profileForm.password.trim().length < 8) {
        setProfileMessage('Le mot de passe doit contenir au moins 8 caractères.');
        return;
      }

      try {
        const response = await clientsApi.update(storedUser.id, {
          nom: profileForm.nom.trim(),
          prenom: profileForm.prenom.trim(),
          genre: profileForm.genre.trim(),
          email: emailValue,
          telephone: `${profileForm.indicatif.trim()} ${phoneNumber}`.trim(),
          adresseLivraison: profileForm.adressePostale.trim(),
          codePostal: profileForm.codePostal.trim(),
          ville: profileForm.ville.trim(),
          imageProfil: profileForm.imageProfil || null,
          estActif: true,
        });

        const updatedClient = response?.data || {};
        localStorage.setItem('user', JSON.stringify({
          ...updatedClient,
          id: updatedClient.id ?? storedUser.id,
          nom: updatedClient.nom ?? profileForm.nom.trim(),
          prenom: updatedClient.prenom ?? profileForm.prenom.trim(),
          genre: updatedClient.genre ?? profileForm.genre.trim(),
          email: updatedClient.email ?? emailValue,
          telephone: updatedClient.telephone ?? `${profileForm.indicatif.trim()} ${phoneNumber}`.trim(),
          adresseLivraison: updatedClient.adresseLivraison ?? profileForm.adressePostale.trim(),
          adressePostale: updatedClient.adresseLivraison ?? profileForm.adressePostale.trim(),
          codePostal: updatedClient.codePostal ?? profileForm.codePostal.trim(),
          ville: updatedClient.ville ?? profileForm.ville.trim(),
          imageProfil: updatedClient.imageProfil ?? profileForm.imageProfil,
        }));

        localStorage.setItem('authToken', btoa(`${emailValue}:${profileForm.password.trim() || 'session'}`));
        setConnectedProfileImage(updatedClient.imageProfil ?? profileForm.imageProfil);
        setConnectedUserName([updatedClient.prenom ?? profileForm.prenom.trim(), updatedClient.nom ?? profileForm.nom.trim()].filter(Boolean).join(' ').trim());
        window.dispatchEvent(new CustomEvent('agrimarket:client-registered', {
          detail: { email: updatedClient.email ?? emailValue, id: updatedClient.id ?? storedUser.id }
        }));
        setHasAccount(true);
        setProfileMessage('Profil mis à jour avec succès.');
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 409 || status === 400) {
          setProfileMessage('Email déjà utilisé. Choisis une autre adresse.');
          return;
        }
        setProfileMessage('Erreur lors de la mise à jour du profil.');
      }
      return;
    }

    if (profileMode === 'register') {
      const phoneNumber = profileForm.telephone.trim();
      const emailValue = profileForm.email.trim().toLowerCase();
      const isEmailValid = /^\S+@\S+\.\S+$/.test(emailValue);
      const requiredFields = [
        { key: 'nom', label: 'Nom', value: profileForm.nom.trim() },
        { key: 'prenom', label: 'Prénom', value: profileForm.prenom.trim() },
        { key: 'genre', label: 'Genre', value: profileForm.genre.trim() },
        { key: 'indicatif', label: 'Indicatif téléphonique', value: profileForm.indicatif.trim() },
        { key: 'email', label: 'Email', value: emailValue },
        { key: 'adressePostale', label: 'Adresse postale', value: profileForm.adressePostale.trim() },
        { key: 'codePostal', label: 'Code postal', value: profileForm.codePostal.trim() },
        { key: 'ville', label: 'Ville', value: profileForm.ville.trim() },
        { key: 'password', label: 'Mot de passe', value: profileForm.password.trim() },
      ] as const;

      if (!phoneNumber) {
        setProfileMessage('Champ manquant: Numéro de téléphone.');
        return;
      }

      if (!isEmailValid) {
        setProfileMessage('Email invalide. Vérifie l’adresse saisie.');
        return;
      }

      const postalCodeValidationMessage = getPostalCodeValidationMessage(profileForm.codePostal, profileForm.indicatif);
      if (postalCodeValidationMessage) {
        setProfileMessage(postalCodeValidationMessage);
        return;
      }

      if (profileForm.password.trim().length < 8) {
        setProfileMessage('Le mot de passe doit contenir au moins 8 caractères.');
        return;
      }

      const missingField = requiredFields.find((field) => !field.value);
      if (missingField) {
        setProfileMessage(`Champ manquant: ${missingField.label}.`);
        return;
      }

      const newUser = {
        nom: profileForm.nom.trim(),
        prenom: profileForm.prenom.trim(),
        genre: profileForm.genre.trim(),
        indicatif: profileForm.indicatif.trim(),
        email: emailValue,
        telephone: `${profileForm.indicatif.trim()} ${phoneNumber}`.trim(),
        adressePostale: profileForm.adressePostale.trim(),
        codePostal: profileForm.codePostal.trim(),
        ville: profileForm.ville.trim(),
        imageProfil: profileForm.imageProfil || '',
      };

      try {
        // Obtenir le token reCAPTCHA pour la validation
        const recaptchaToken = await getRecaptchaToken('signup');
        if (!recaptchaToken) {
          setProfileMessage('Erreur de validation reCAPTCHA. Réessaie.');
          return;
        }

        const createdClientResponse = await clientsApi.create({
          nom: newUser.nom,
          prenom: newUser.prenom,
          genre: newUser.genre,
          email: newUser.email,
          telephone: newUser.telephone,
          adresseLivraison: newUser.adressePostale,
          codePostal: newUser.codePostal,
          ville: newUser.ville,
          imageProfil: newUser.imageProfil,
          estActif: true,
          recaptchaToken: recaptchaToken,
        });

        const createdClient = createdClientResponse?.data;
        localStorage.setItem('user', JSON.stringify({
          ...newUser,
          id: createdClient?.id,
          adresseLivraison: createdClient?.adresseLivraison,
          codePostal: createdClient?.codePostal ?? newUser.codePostal,
          imageProfil: createdClient?.imageProfil ?? newUser.imageProfil,
        }));
        setConnectedProfileImage(createdClient?.imageProfil ?? newUser.imageProfil);
        setConnectedUserName([createdClient?.prenom ?? newUser.prenom, createdClient?.nom ?? newUser.nom].filter(Boolean).join(' ').trim());
      } catch (error: any) {
        const status = error?.response?.status;
        const apiData = error?.response?.data;
        const apiMessage = typeof apiData === 'string'
          ? apiData
          : apiData?.message || '';

        if (status === 409) {
          setProfileMessage('Cet email existe déjà. Connecte-toi avec ce compte.');
          return;
        }
        if (status === 400) {
          setProfileMessage(
            apiMessage
              ? String(apiMessage)
              : 'Données invalides. Vérifie le formulaire et réessaie.'
          );
          return;
        }
        if (status === 403) {
          setProfileMessage('La validation reCAPTCHA a échoué. Tu sembles être un robot. Réessaie.');
          return;
        }
        setProfileMessage('Erreur lors de la création du compte. Réessaie.');
        return;
      }

      localStorage.setItem('authToken', btoa(`${newUser.email}:${profileForm.password}`));
      window.dispatchEvent(new CustomEvent('agrimarket:client-registered', {
        detail: { email: newUser.email }
      }));
      setHasAccount(true);
      setProfileMessage('Compte créé. Tu peux maintenant te connecter.');
      setProfileMode('login');
      setProfileForm({
        nom: '',
        prenom: '',
        genre: '',
        indicatif: '+33',
        email: newUser.email,
        telephone: '',
        adressePostale: '',
        codePostal: '',
        ville: '',
        password: ''
      });
      return;
    }

    const storedUserRaw = localStorage.getItem('user');
    if (!storedUserRaw) {
      setProfileMessage('Aucun compte trouvé. Inscris-toi d’abord.');
      setProfileMode('register');
      return;
    }

    const storedUser = JSON.parse(storedUserRaw) as { email?: string; nom?: string; prenom?: string };
    if (storedUser.email?.toLowerCase() !== profileForm.email.trim().toLowerCase()) {
      setProfileMessage('Email incorrect. Vérifie ou crée un compte.');
      return;
    }

    if (!profileForm.password.trim()) {
      setProfileMessage('Entre ton mot de passe.');
      return;
    }

    localStorage.setItem('authToken', btoa(`${profileForm.email.trim().toLowerCase()}:${profileForm.password}`));
    setConnectedUserName([storedUser?.prenom, storedUser?.nom].filter(Boolean).join(' ').trim());
    setHasAccount(true);
    setProfileMessage('Connexion réussie.');
    closeProfileModal();
  };

  const produitsFiltres = produits.filter(p => {
    const matchSearch = p.nomProduit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategorie = categorieActive === null || p.categorie?.id === categorieActive;
    const matchCity = selectedCity === null || p.agriculteur?.ville === selectedCity;
    const matchBio = bioFilter === 'all'
      || (bioFilter === 'bio' && p.estBio)
      || (bioFilter === 'nonbio' && !p.estBio);
    return matchSearch && matchCategorie && matchCity && matchBio;
  });

  const selectedProduitCategorie = selectedProduit?.categorie;
  const selectedProduitIcone = selectedProduitCategorie
    ? (ICONES_CATEGORIES[selectedProduitCategorie.libelle] ?? '🌱')
    : '🌱';

  const producerMarkersByCity = agriculteurs.reduce((acc: Record<string, { ville: string; lat: number; lon: number; producteurs: Agriculteur[] }>, agriculteur: Agriculteur) => {
    const ville = agriculteur.ville?.trim();
    const coords = getCityCoordinates(ville);

    if (!ville || !coords) {
      return acc;
    }

    const key = normalizeCityName(ville);
    if (!acc[key]) {
      acc[key] = {
        ville,
        lat: coords.lat,
        lon: coords.lon,
        producteurs: [],
      };
    }

    acc[key].producteurs.push(agriculteur);
    return acc;
  }, {});

  const producerMarkers = Object.values(producerMarkersByCity) as Array<{
    ville: string;
    lat: number;
    lon: number;
    producteurs: Agriculteur[];
  }>;

  const productsCountByAgriculteurId = produits.reduce((acc: Record<number, number>, produit: Produit) => {
    const agriculteurId = Number(produit?.agriculteur?.id || 0);
    if (!agriculteurId) {
      return acc;
    }

    acc[agriculteurId] = (acc[agriculteurId] || 0) + 1;
    return acc;
  }, {});

  const producteursSansPosition = agriculteurs.filter((agriculteur: Agriculteur) => {
    const ville = agriculteur.ville?.trim();
    return !ville || !getCityCoordinates(ville);
  });

  useEffect(() => {
    loadProduits();
    loadCategories();
    loadAgriculteurs();
    loadFrontendOffer();
  }, []);

  const loadProduits = async () => {
    try {
      const response = await produitsApi.getAll();
      setProduits(response.data || []);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      setProduits([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      setCategories([]);
    }
  };

  const loadAgriculteurs = async () => {
    try {
      const response = await agriculteursApi.getAll();
      const data: Agriculteur[] = response.data || [];
      setAgriculteurs(data);
      setVillesDisponibles(Array.from(new Set(data.map(a => a.ville).filter(Boolean) as string[])));
    } catch (error) {
      console.error('Erreur chargement agriculteurs:', error);
      setAgriculteurs([]);
      setVillesDisponibles([]);
    }
  };

  const loadFrontendOffer = async () => {
    try {
      const response = await frontendApi.getBySection('special-offer');
      setFrontendOffer(response.data || null);
    } catch (error) {
      console.error('Erreur chargement offre spéciale:', error);
      setFrontendOffer(null);
    }
  };

  return (
    <div className="bg-[#d6fff5] min-h-screen">
      <header className="fixed top-0 left-0 right-0 backdrop-blur-[12px] bg-[rgba(236,253,245,0.7)] shadow-lg z-40">
        <div className="max-w-[672px] mx-auto px-6 py-1 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="AgriMarket"
              className="h-28 w-auto object-contain"
            />
          </div>
          <button onClick={() => setPanierOpen(true)} className="relative p-2">
            <ShoppingCart className="w-6 h-6 text-[#065F46]" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-[672px] mx-auto px-6 pt-32 pb-32">
        <div className="mb-8">
          <div className="relative">
            <div className="grid grid-cols-[1.8fr_1.3fr] gap-2 rounded-[40px] bg-white shadow-xl border border-[#d8f3e4] overflow-hidden pr-14">
              <div className="flex flex-col justify-center px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#065F46]">Quoi</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Que recherchez-vous ?"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full border-0 bg-transparent p-0 pt-2 text-sm font-semibold text-[#064e3b] placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearchQuery}
                      className="text-[10px] text-[#047857] font-semibold uppercase tracking-[0.1em]"
                    >
                      Effacer
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenVilles(!openVilles)}
                className="flex items-center gap-3 px-4 py-3 border-l border-[#d8f3e4] bg-transparent"
              >
                <div className="grid h-10 w-10 place-items-center rounded-[24px] bg-[#d1fae5] text-[#047857] shadow-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[#065F46]">Où</div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#064e3b]">
                    <span>{selectedCity ?? (villesDisponibles.length > 0 ? `${villesDisponibles.length} villes disponibles` : 'Chargement...')}</span>
                    {selectedCity && (
                      <span
                        onClick={(e) => { e.stopPropagation(); clearCitySelection(); }}
                        className="text-[10px] text-[#047857] font-semibold uppercase tracking-[0.1em] cursor-pointer"
                      >
                        Effacer
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </div>

            <button
              type="button"
              aria-label="Lancer la recherche"
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-[#0f766e] text-white shadow-lg hover:bg-[#115e59] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            {openVilles && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-60 overflow-y-auto">
                {villesDisponibles.length > 0 ? (
                  villesDisponibles.map((ville) => (
                    <button
                      key={ville}
                      type="button"
                      onClick={() => {
                        setSelectedCity(ville);
                        setOpenVilles(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-[#064e3b] border-b last:border-b-0 hover:bg-[#d6fff5] transition-colors"
                    >
                      {ville}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">Aucune ville disponible</div>
                )}
              </div>
            )}
            {showSuggestions && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-60 overflow-y-auto">
                {produits
                  .filter(p => p.nomProduit.toLowerCase().startsWith(searchQuery.toLowerCase()))
                  .slice(0, 6)
                  .map(p => (
                    <button
                      key={p.id}
                      onMouseDown={() => { setSearchQuery(p.nomProduit); setShowSuggestions(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#d6fff5] transition-colors text-left"
                    >
                      <span className="text-sm text-gray-400">{p.categorie?.libelle ? '🥦' : '🌱'}</span>
                      <span className="font-medium text-[#00362e]">{p.nomProduit}</span>
                      <span className="ml-auto text-sm font-semibold text-[#006851]">{p.prixUnitaire?.toFixed(2)}€</span>
                    </button>
                  ))}
                {produits.filter(p => p.nomProduit.toLowerCase().startsWith(searchQuery.toLowerCase())).length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">Aucun produit trouvé</div>
                )}
              </div>
            )}
          </div>
        </div>

        {frontendOffer?.estActif !== false && frontendOffer && (
          <div
            className="mb-8 min-h-[220px] rounded-[48px] px-8 pt-8 pb-10 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${frontendOffer.gradientFrom ?? '#006851'} 0%, ${frontendOffer.gradientTo ?? '#2bb673'} 100%)`,
            }}
          >
            <div className="relative z-10">
              <div className="inline-block backdrop-blur-[6px] bg-[rgba(255,255,255,0.18)] px-3 py-1 rounded-full mb-2 border border-white/15">
                <span className="text-white text-xs font-bold uppercase tracking-wider">{frontendOffer.title || 'Offre Spéciale'}</span>
              </div>
              <h2 className="text-[30px] font-extrabold text-white leading-tight mb-2">
                {frontendOffer.highlightText || '-30% sur les Tomates'}
              </h2>
              <p className="text-[#e9fff6] text-sm">
                {frontendOffer.description || 'Récoltées ce matin dans nos serres locales.'}
              </p>
              <button
                type="button"
                onClick={handleVoirTomatesClick}
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#d8f3e4] bg-[#f4fffb] px-5 pt-3 pb-4 text-sm font-extrabold text-[#006851] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
              >
                <span className="whitespace-nowrap">{frontendOffer.buttonLabel || "Voir l'offre"}</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#006851] text-white">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[20px] font-bold text-[#00362e]">Catégories</h3>
            <button
              type="button"
              onClick={handleVoirToutCategoriesClick}
              className={`text-[#006851] font-semibold text-sm underline-offset-4 hover:underline ${categorieActive === null ? 'underline' : ''}`}
            >
              Voir tout
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map(cat => (
              <div
                key={cat.id}
                onClick={() => setCategorieActive(categorieActive === cat.id ? null : cat.id)}
                className="flex flex-col items-center gap-3 min-w-[112px] cursor-pointer"
              >
                <div className={`w-[112px] h-[112px] rounded-[48px] flex items-center justify-center transition-colors ${
                  categorieActive === cat.id ? 'bg-[#006851]' : 'bg-[#a4f1e1]'
                }`}>
                  <span className="text-4xl">{ICONES_CATEGORIES[cat.libelle] ?? cat.icone ?? '🌱'}</span>
                </div>
                <span className={`text-sm font-semibold ${
                  categorieActive === cat.id ? 'text-[#006851]' : 'text-[#2c655b]'
                }`}>{cat.libelle}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[20px] font-bold text-[#00362e]">
              {categorieActive ? categories.find(c => c.id === categorieActive)?.libelle : 'Produits Populaires'}
            </h3>
            <div className="bg-[rgba(0,104,81,0.1)] px-3 py-1 rounded-full">
              <span className="text-[#006851] text-xs font-bold uppercase tracking-wider">Frais</span>
            </div>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setBioFilter('all')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${bioFilter === 'all' ? 'bg-[#006851] text-white' : 'bg-white text-[#006851] border border-[#d6fff5] hover:bg-[#f2fffb]'}`}
            >
              Tous
            </button>
            <button
              type="button"
              onClick={() => setBioFilter('bio')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${bioFilter === 'bio' ? 'bg-green-600 text-white' : 'bg-white text-green-700 border border-green-100 hover:bg-green-50'}`}
            >
              🌿 Bio
            </button>
            <button
              type="button"
              onClick={() => setBioFilter('nonbio')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${bioFilter === 'nonbio' ? 'bg-gray-700 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              Non bio
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-[32px] p-3 shadow-sm animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-[32px] mb-3" />
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))
              : produitsFiltres.length > 0 ? produitsFiltres.map(produit => (
                  <div
                    key={produit.id}
                    className={`bg-white rounded-[32px] p-3 shadow-sm cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${produit.estBio ? 'ring-1 ring-green-100' : 'ring-1 ring-transparent'}`}
                    onClick={() => setSelectedProduit(produit)}
                  >
                    <div className="aspect-square bg-[#aff6e7] rounded-[32px] mb-3 relative overflow-hidden">
                      {produit.estNouveau && (
                        <div className="absolute top-2 left-2 backdrop-blur-[6px] bg-[rgba(255,255,255,0.4)] px-2 py-1 rounded-full z-10">
                          <span className="text-[#006851] text-xs font-bold">-15%</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10 rounded-2xl bg-white/70 p-1.5 shadow-sm backdrop-blur-md">
                        {produit.estBio && (
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700 shadow-sm ring-1 ring-green-200">
                            🌿 Bio
                          </span>
                        )}
                        {produit.saison?.nomSaison && (
                          <span className="rounded-full bg-[#006851] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                            {produit.saison.nomSaison}
                          </span>
                        )}
                      </div>
                      <div className="w-full h-full relative">
                        <img
                          src={produit.imageUrl}
                          alt={produit.nomProduit}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.classList.add('fallback-active'); }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center hidden [&.fallback-active]:flex text-5xl">
                          🌿
                        </div>
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-[#00362e] mb-2 truncate">{produit.nomProduit}</h4>
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {produit.estBio ? (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold text-green-700 ring-1 ring-green-200">🌿 Bio</span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-600 ring-1 ring-gray-200">Non bio</span>
                      )}
                      {produit.saison?.nomSaison && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                          {produit.saison.nomSaison}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[#006851]">
                        {produit.prixUnitaire?.toFixed(2)} € <span className="text-xs text-[#7fb8ac]">/{produit.uniteMesure}</span>
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); ajouterAuPanier(produit); }}
                        className="bg-[#006851] text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#005040]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 rounded-[32px] bg-white p-8 shadow-sm text-center">
                    <h3 className="text-xl font-bold text-[#00362e] mb-2">Produit indisponible</h3>
                    <p className="text-sm text-[#47585a]">
                      Aucun produit ne correspond à votre recherche dans {selectedCity ? `la ville de ${selectedCity}` : 'cette sélection'}.
                    </p>
                  </div>
                )
            }
          </div>
        </div>
      </main>

      {selectedProduit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 px-4 py-4 backdrop-blur-[6px] sm:items-center">
          <div className="w-full max-w-[672px] max-h-[90vh] overflow-hidden rounded-[36px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5f5ef] px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#006851]">Détails produit</p>
                <h2 className="text-lg font-extrabold text-[#00362e]">{selectedProduit.nomProduit}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduit(null)}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#f1fbf7] text-[#006851] transition-colors hover:bg-[#d6fff5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-72px)] overflow-y-auto px-6 pb-6 pt-5">
              <div className="aspect-square overflow-hidden rounded-[32px] bg-[#aff6e7]">
                {selectedProduit.imageUrl ? (
                  <img
                    src={selectedProduit.imageUrl}
                    alt={selectedProduit.nomProduit}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-8xl">
                    {selectedProduitIcone}
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-4 rounded-[28px] bg-[#f8fffc] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {selectedProduitCategorie && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#d6fff5] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#006851]">
                        {selectedProduitIcone} {selectedProduitCategorie.libelle}
                      </span>
                    )}
                    <h3 className="mt-3 text-2xl font-extrabold leading-tight text-[#00362e]">{selectedProduit.nomProduit}</h3>
                    <p className="mt-1 text-sm text-[#2c655b]">{selectedProduit.descriptionProduit || 'Aucune description disponible.'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-[#006851]">{selectedProduit.prixUnitaire?.toFixed(2)} €</p>
                    <p className="text-xs text-[#7fb8ac]">/ {selectedProduit.uniteMesure}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#2c655b]">
                  <div className="flex items-center gap-0.5 text-[#f59e0b]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4" fill={i <= Math.round(selectedProduit.note ?? 4.5) ? '#f59e0b' : 'none'} stroke={i <= Math.round(selectedProduit.note ?? 4.5) ? '#f59e0b' : '#d1d5db'} />
                    ))}
                  </div>
                  <span className="font-bold text-[#00362e]">{(selectedProduit.note ?? 4.5).toFixed(1)}</span>
                  <span>({selectedProduit.nbAvis ?? 0} avis)</span>
                </div>

                {selectedProduit.agriculteur && (
                  <div className="rounded-[24px] bg-white px-4 py-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#7fb8ac]">Producteur</p>
                    <p className="mt-1 text-sm font-semibold text-[#00362e]">
                      {selectedProduit.agriculteur.nom} {selectedProduit.agriculteur.prenom}
                    </p>
                    {selectedProduit.agriculteur.nomExploitation && (
                      <p className="text-sm text-[#2c655b]">{selectedProduit.agriculteur.nomExploitation}</p>
                    )}
                    {selectedProduit.agriculteur.ville && (
                      <p className="text-xs text-[#7fb8ac]">{selectedProduit.agriculteur.ville}</p>
                    )}
                  </div>
                )}

                <div className="rounded-[24px] bg-white px-4 py-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#7fb8ac]">Stock</p>
                  <p className="mt-1 text-sm font-semibold text-[#00362e]">
                    {selectedProduitStockLoading
                      ? 'Chargement du stock...'
                      : selectedProduitStock
                        ? `${selectedProduitStock.quantiteDisponible} ${selectedProduit.uniteMesure} disponibles`
                        : 'Stock non renseigné'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProduit.estBio && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">🌿 Bio</span>}
                  {!selectedProduit.estBio && <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-200">Non bio</span>}
                  {selectedProduit.saison?.nomSaison && <span className="rounded-full bg-[#006851] px-3 py-1 text-xs font-semibold text-white shadow-sm">🗓 {selectedProduit.saison.nomSaison}</span>}
                  {selectedProduit.estLocal && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">📍 Local</span>}
                  {selectedProduit.estNouveau && <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200">✨ Nouveau</span>}
                </div>

                <div className="flex items-center justify-between rounded-[24px] bg-white px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#7fb8ac]">Stock / disponibilité</p>
                    <p className="text-sm font-semibold text-[#00362e]">Disponible pour commande</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      ajouterAuPanier(selectedProduit);
                      setSelectedProduit(null);
                      setPanierOpen(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#006851] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#005040]"
                  >
                    <Plus className="h-4 w-4" /> Ajouter au panier
                  </button>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProduit(null)}
                  className="flex-1 rounded-full border border-[#d8f3e4] bg-white px-5 py-3 font-semibold text-[#006851]"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProduit(null)}
                  className="flex-1 rounded-full bg-[#f1fbf7] px-5 py-3 font-semibold text-[#006851]"
                >
                  Continuer mes achats
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-[20px] bg-[rgba(236,253,245,0.8)] rounded-t-[48px] shadow-lg z-40">
        <div className="max-w-[672px] mx-auto px-4 py-3 flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 p-3 bg-[#059669] rounded-full shadow-lg">
            <Home className="w-5 h-5 text-white" />
            <span className="text-xs font-semibold text-white uppercase tracking-wide">Home</span>
          </button>
          <button
            type="button"
            onClick={() => setCarteOpen(true)}
            className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-[#e8fff7]"
          >
            <MapPin className="w-5 h-5 text-[#047857]" />
            <span className="text-xs font-semibold text-[#047857] uppercase tracking-wide">Carte</span>
          </button>
          <button onClick={() => setPanierOpen(true)} className="flex flex-col items-center gap-1 p-3 opacity-50 relative">
            <ShoppingCart className="w-5 h-5 text-[#065F46]" />
            <span className="text-xs font-semibold text-[#065F46] uppercase tracking-wide">Cart</span>
            {items.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
          <button className="flex flex-col items-center gap-1 p-3 opacity-50">
            <Heart className="w-5 h-5 text-[#065F46]" />
            <span className="text-xs font-semibold text-[#065F46] uppercase tracking-wide">Favorites</span>
          </button>
          <div ref={profileMenuRef} className="relative">
            {hasAccount && profileMenuOpen && (
              <div className="absolute bottom-[calc(100%+0.6rem)] right-0 z-[70] w-[min(22rem,calc(100vw-2rem))] max-w-[22rem] overflow-hidden rounded-3xl border border-[#bfead8] bg-[rgba(255,255,255,0.96)] shadow-[0_18px_45px_rgba(6,95,70,0.22)] backdrop-blur-xl sm:right-1/2 sm:translate-x-1/2">
                <div className="border-b border-[#e0f2e8] bg-gradient-to-r from-[#ecfdf5] to-[#f7fffc] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0f766e]">Compte</p>
                  <p className="mt-1 truncate text-sm font-bold text-[#065f46]">{connectedUserName || 'Utilisateur connecté'}</p>
                </div>

                <div className="p-2">
                <button
                  type="button"
                  onClick={() => openProfileEditFromMenu(false)}
                  className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold text-[#065f46] transition-colors hover:bg-[#f1fbf7]"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#d1fae5] text-[#047857]">
                      <User className="h-4 w-4" />
                    </span>
                    Modifier le profil
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#059669]" />
                </button>
                <button
                  type="button"
                  onClick={() => openProfileEditFromMenu(true)}
                  className="mt-1 flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold text-[#065f46] transition-colors hover:bg-[#f1fbf7]"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#d1fae5] text-[#047857]">
                      <Calendar className="h-4 w-4" />
                    </span>
                    Historique des achats
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#059669]" />
                </button>

                <div className="my-2 h-px bg-[#e0f2e8]" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-red-100 text-red-600">
                      <X className="h-4 w-4" />
                    </span>
                    Déconnexion
                  </span>
                  <ArrowRight className="h-4 w-4 text-red-400" />
                </button>
                </div>
              </div>
            )}

            <button onClick={handleProfileClick} className={`flex flex-col items-center gap-1 p-3 ${hasAccount ? '' : 'opacity-50'}`}>
              {connectedProfileImage && hasAccount ? (
                <img
                  src={connectedProfileImage}
                  alt="Profil"
                  className="h-6 w-6 rounded-full border border-[#047857] object-cover"
                />
              ) : (
                <div className={`grid h-6 w-6 place-items-center rounded-full ${hasAccount ? 'bg-[#059669]' : ''}`}>
                  <User className={`w-4 h-4 ${hasAccount ? 'text-white' : 'text-[#065F46]'}`} />
                </div>
              )}
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${hasAccount ? 'text-[#059669]' : 'text-[#065F46]'}`}>
                {profileButtonLabel}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {profileModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/35 px-4 py-4 backdrop-blur-[6px] sm:items-center">
          <div className="w-full max-w-[520px] rounded-[32px] bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e5f5ef] px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#006851]">Compte</p>
                <h2 className="text-lg font-extrabold text-[#00362e]">
                  {profileMode === 'login'
                    ? 'Connexion au profil'
                    : profileMode === 'edit' && showProfileHistory
                      ? 'Historique des achats'
                      : profileMode === 'edit'
                        ? 'Modifier mon profil'
                        : 'Créer un compte'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeProfileModal}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#f1fbf7] text-[#006851] transition-colors hover:bg-[#d6fff5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 px-6 py-5">
              {!(profileMode === 'edit' && showProfileHistory) && (
                <>
              {profileMode !== 'login' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full border border-[#d8f3e4] bg-[#f1fbf7]">
                      {profileForm.imageProfil ? (
                        <img src={profileForm.imageProfil} alt="Aperçu profil" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#006851]">
                          <User className="h-7 w-7" />
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer rounded-full border border-[#d8f3e4] px-4 py-2 text-sm font-semibold text-[#006851] hover:bg-[#f1fbf7]">
                      Ajouter une photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageUpload}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nom"
                    value={profileForm.nom}
                    required
                    onChange={(e) => setProfileForm({ ...profileForm, nom: e.target.value })}
                    className="w-full rounded-2xl border border-[#d8f3e4] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006851]"
                  />
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={profileForm.prenom}
                    required
                    onChange={(e) => setProfileForm({ ...profileForm, prenom: e.target.value })}
                    className="w-full rounded-2xl border border-[#d8f3e4] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006851]"
                  />
                  </div>

                  <select
                    value={profileForm.genre}
                    required
                    onChange={(e) => setProfileForm({ ...profileForm, genre: e.target.value })}
                    className="w-full rounded-2xl border border-[#d8f3e4] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006851]"
                  >
                    <option value="">Genre</option>
                    <option value="Femme">Femme</option>
                    <option value="Homme">Homme</option>
                    <option value="Autre">Autre</option>
                  </select>

                  <div className="grid grid-cols-[140px_1fr] gap-3">
                    <select
                      value={profileForm.indicatif}
                      required
                      onChange={(e) => setProfileForm({ ...profileForm, indicatif: e.target.value })}
                      className="w-full rounded-2xl border border-[#d8f3e4] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006851]"
                    >
                      {INTERNATIONAL_CALLING_CODES.map((code) => (
                        <option key={code.value} value={code.value}>
                          {code.label} {code.value}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      placeholder="Numéro de téléphone"
                      value={profileForm.telephone}
                      required
                      onChange={(e) => setProfileForm({ ...profileForm, telephone: e.target.value })}
                      className="w-full rounded-2xl border border-[#d8f3e4] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006851]"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Adresse postale"
                    value={profileForm.adressePostale}
                    required
                    onChange={(e) => setProfileForm({ ...profileForm, adressePostale: e.target.value })}
                    className="w-full rounded-2xl border border-[#d8f3e4] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006851]"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder={profileForm.indicatif === '+33' ? 'Code postal (5 chiffres)' : 'Code postal'}
                      value={profileForm.codePostal}
                      inputMode={profileForm.indicatif === '+33' ? 'numeric' : 'text'}
                      maxLength={10}
                      required
                      onChange={(e) => setProfileForm({ ...profileForm, codePostal: e.target.value })}
                      className="w-full rounded-2xl border border-[#d8f3e4] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006851]"
                    />

                    <input
                      type="text"
                      placeholder="Ville"
                      value={profileForm.ville}
                      required
                      onChange={(e) => setProfileForm({ ...profileForm, ville: e.target.value })}
                      className="w-full rounded-2xl border border-[#d8f3e4] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006851]"
                    />
                  </div>
                </div>
              )}

              <input
                type="email"
                placeholder="Login / email"
                value={profileForm.email}
                required
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full rounded-2xl border border-[#d8f3e4] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006851]"
              />

              <input
                type="password"
                placeholder="Mot de passe"
                value={profileForm.password}
                required
                onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                className="w-full rounded-2xl border border-[#d8f3e4] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#006851]"
              />

              {profileMessage && (
                <p className="rounded-2xl bg-[#f1fbf7] px-4 py-3 text-sm text-[#006851]">
                  {profileMessage}
                </p>
              )}

              {profileMode === 'register' && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2 border border-blue-100">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Protégé par reCAPTCHA</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-[#006851] px-5 py-3.5 font-bold text-white transition-colors hover:bg-[#005040]"
              >
                {profileMode === 'login' ? 'Se connecter' : profileMode === 'edit' ? 'Enregistrer les modifications' : 'S’inscrire'}
              </button>

              {profileMode !== 'edit' ? (
                <button
                  type="button"
                  onClick={() => {
                    setProfileMode(profileMode === 'login' ? 'register' : 'login');
                    setProfileMessage('');
                  }}
                  className="w-full rounded-full border border-[#d8f3e4] px-5 py-3 font-semibold text-[#006851]"
                >
                  {profileMode === 'login' ? "Je n’ai pas de compte" : 'J’ai déjà un compte'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-full border border-[#d8f3e4] px-5 py-3 font-semibold text-[#006851]"
                >
                  Se déconnecter
                </button>
              )}
                </>
              )}

              {profileMode === 'edit' && showProfileHistory && (
                <div ref={profileHistoryRef} className="mt-2 rounded-2xl border border-[#d8f3e4] bg-[#f8fffc] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[#006851]">Historique des commandes</h3>
                    <span className="text-xs text-[#2c655b]">{profileOrders.length} commande(s)</span>
                  </div>

                  {profileOrdersLoading ? (
                    <p className="text-sm text-[#2c655b]">Chargement de vos commandes...</p>
                  ) : profileOrders.length === 0 ? (
                    <p className="text-sm text-[#2c655b]">Aucune commande trouvée pour ce profil.</p>
                  ) : (
                    <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                      {profileOrders.map((commande) => (
                        <div key={commande.id} className="rounded-xl border border-[#d8f3e4] bg-white p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[#00362e]">{commande.numeroCommande}</p>
                              <p className="text-xs text-[#2c655b]">
                                {commande.dateCommande ? new Date(commande.dateCommande).toLocaleString() : '-'}
                              </p>
                            </div>
                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                              {commande.statut}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-sm text-[#2c655b]">
                            <span>{commande.lignesCommande?.length || 0} article(s)</span>
                            <span className="font-semibold text-[#006851]">{Number(commande.total || 0).toFixed(2)} €</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {carteOpen && (
        <div className="fixed inset-0 z-[65] flex items-end justify-center bg-black/35 px-4 py-4 backdrop-blur-[6px] sm:items-center">
          <div className="w-full max-w-[560px] overflow-hidden rounded-[32px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5f5ef] px-6 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#006851]">Producteurs</p>
                <h2 className="text-lg font-extrabold text-[#00362e]">Carte de France</h2>
              </div>
              <button
                type="button"
                onClick={() => setCarteOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#f1fbf7] text-[#006851] transition-colors hover:bg-[#d6fff5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="overflow-hidden rounded-3xl border border-[#d8f3e4]">
                <MapContainer
                  center={[46.6, 2.2]}
                  zoom={5.5}
                  minZoom={5}
                  maxZoom={11}
                  maxBounds={[
                    [41.0, -6.0],
                    [51.8, 10.2],
                  ]}
                  className="h-[46vh] min-h-[280px] w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {producerMarkers.map((marker) => (
                    <CircleMarker
                      key={marker.ville}
                      center={[marker.lat, marker.lon]}
                      radius={Math.min(16, 7 + marker.producteurs.length)}
                      pathOptions={{
                        color: '#065f46',
                        fillColor: '#10b981',
                        fillOpacity: 0.8,
                        weight: 2,
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -4]}>
                        <div className="text-xs font-semibold text-[#065f46]">
                          {marker.ville} • {marker.producteurs.length} producteur(s)
                        </div>
                      </Tooltip>

                      <Popup>
                        <div className="min-w-[240px] max-w-[280px] space-y-3">
                          <div>
                            <p className="text-sm font-bold text-[#065f46]">{marker.ville}</p>
                            <p className="text-xs text-[#2c655b]">{marker.producteurs.length} producteur(s) inscrit(s)</p>
                          </div>

                          <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                            {marker.producteurs.slice(0, 6).map((agriculteur) => {
                              const producerLabel = `${agriculteur.prenom} ${agriculteur.nom}`.trim();
                              const exploitationLabel = agriculteur.nomExploitation?.trim();
                              const productsCount = productsCountByAgriculteurId[agriculteur.id] || 0;
                              const addressParts = [agriculteur.adresse?.trim(), agriculteur.codePostal?.trim(), agriculteur.ville?.trim()].filter(Boolean);
                              const addressLine = addressParts.length > 0 ? addressParts.join(', ') : marker.ville;

                              return (
                                <div key={agriculteur.id} className="rounded-xl border border-[#d8f3e4] bg-[#f8fffc] p-2.5">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="text-xs font-bold text-[#00362e]">{producerLabel}</p>
                                      {exploitationLabel && (
                                        <p className="text-[11px] text-[#2c655b]">{exploitationLabel}</p>
                                      )}
                                    </div>
                                    {agriculteur.estVerifie && (
                                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">Vérifié</span>
                                    )}
                                  </div>

                                  <div className="mt-2 space-y-1 text-[11px] text-[#2c655b]">
                                    <p><span className="font-semibold text-[#065f46]">Adresse:</span> {addressLine}</p>
                                    {agriculteur.email && (
                                      <p><span className="font-semibold text-[#065f46]">Email:</span> {agriculteur.email}</p>
                                    )}
                                    {agriculteur.telephone && (
                                      <p><span className="font-semibold text-[#065f46]">Tél:</span> {agriculteur.telephone}</p>
                                    )}
                                    <p><span className="font-semibold text-[#065f46]">Produits:</span> {productsCount}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {marker.producteurs.length > 6 && (
                            <p className="text-[11px] text-[#2c655b]">
                              + {marker.producteurs.length - 6} autre(s) producteur(s) dans cette ville.
                            </p>
                          )}
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>

              <div className="rounded-2xl border border-[#d8f3e4] bg-[#f8fffc] p-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#006851]">
                  {agriculteurs.length} producteur(s) inscrit(s) • {producerMarkers.length} ville(s) positionnée(s)
                </p>
                {producteursSansPosition.length > 0 && (
                  <p className="mt-1 text-xs text-[#2c655b]">
                    Villes sans position reconnue: {producteursSansPosition.map((a) => a.ville || `${a.prenom} ${a.nom}`).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <PanierModal isOpen={panierOpen} onClose={() => setPanierOpen(false)} />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
