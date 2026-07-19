import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Package, Users, ShoppingBag, FolderOpen, Calendar,
  Archive, Plus, Edit, Trash2, Eye, X
} from 'lucide-react';
import {
  produitsApi, agriculteursApi, clientsApi, commandesApi,
  categoriesApi, saisonsApi, stocksApi, frontendApi
} from '../services/api';
import type { Produit, Agriculteur, Client, Commande, Categorie, Saison, Stock, FrontendSetting } from '../services/types';
import { ICONES_CATEGORIES } from '../services/constants';

type Section = 'produits' | 'agriculteurs' | 'clients' | 'commandes' | 'categories' | 'saisons' | 'stocks' | 'frontend';

const COMMANDE_STATUTS: Commande['statut'][] = [
  'EN_ATTENTE',
  'CONFIRMEE',
  'EN_PREPARATION',
  'EXPEDIEE',
  'LIVREE',
  'ANNULEE',
];

const COMMANDE_STATUT_LABELS: Record<Commande['statut'], string> = {
  EN_ATTENTE: 'En attente',
  CONFIRMEE: 'Confirmée',
  EN_PREPARATION: 'En préparation',
  EXPEDIEE: 'Expédiée',
  LIVREE: 'Livrée',
  ANNULEE: 'Annulée',
};

const getCommandeStatutBadgeClass = (statut: Commande['statut']) => {
  if (statut === 'LIVREE') return 'bg-green-100 text-green-800';
  if (statut === 'CONFIRMEE' || statut === 'EN_PREPARATION' || statut === 'EXPEDIEE') return 'bg-blue-100 text-blue-800';
  if (statut === 'ANNULEE') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('produits');
  const [data, setData] = useState<(Produit | Agriculteur | Client | Commande | Categorie | Saison | Stock | FrontendSetting)[]>([]);
  const [productStocks, setProductStocks] = useState<Record<number, Stock>>({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [frontendSettings, setFrontendSettings] = useState<FrontendSetting | null>(null);
  const [updatingCommandeId, setUpdatingCommandeId] = useState<number | null>(null);

  const emptyColSpan = activeSection === 'frontend'
    ? 7
    : activeSection === 'produits'
      ? 7
      : activeSection === 'clients'
        ? 8
        : activeSection === 'commandes'
          ? 8
          : activeSection === 'categories'
          ? 5
          : 4;

  useEffect(() => {
    loadData();
    setSearch('');
  }, [activeSection]);

  useEffect(() => {
    const handleClientRegistered = () => {
      if (activeSection === 'clients') {
        loadData();
      }
    };

    const handleCommandeCreated = () => {
      if (activeSection === 'commandes') {
        loadData();
      }
    };

    window.addEventListener('agrimarket:client-registered', handleClientRegistered);
    window.addEventListener('agrimarket:commande-created', handleCommandeCreated);

    return () => {
      window.removeEventListener('agrimarket:client-registered', handleClientRegistered);
      window.removeEventListener('agrimarket:commande-created', handleCommandeCreated);
    };
  }, [activeSection]);

  const loadData = async () => {
    setLoading(true);
    try {
      let response;
      let stocksResponse;
      switch (activeSection) {
        case 'produits':
          [response, stocksResponse] = await Promise.all([
            produitsApi.getAll(),
            stocksApi.getAll(),
          ]);
          break;
        case 'agriculteurs': response = await agriculteursApi.getAll(); break;
        case 'clients': response = await clientsApi.getAll(); break;
        case 'commandes': response = await commandesApi.getAll(); break;
        case 'categories': response = await categoriesApi.getAll(); break;
        case 'saisons': response = await saisonsApi.getAll(); break;
        case 'stocks': response = await stocksApi.getAll(); break;
        case 'frontend': response = await frontendApi.getBySection('special-offer'); break;
      }
      setData(response?.data ? (Array.isArray(response.data) ? response.data : [response.data]) : []);
      if (activeSection === 'produits') {
        const stocks = (stocksResponse?.data || []) as Stock[];
        setProductStocks(
          Object.fromEntries(stocks.map((stock) => [stock.produit?.id, stock]).filter(([id]) => Boolean(id)))
        );
      } else {
        setProductStocks({});
      }
      if (activeSection === 'frontend') {
        setFrontendSettings(response?.data || null);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
      setData([]);
      if (activeSection === 'frontend') {
        setFrontendSettings(null);
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    try {
      switch (activeSection) {
        case 'produits': await produitsApi.delete(id); break;
        case 'agriculteurs': await agriculteursApi.delete(id); break;
        case 'clients': await clientsApi.delete(id); break;
        case 'commandes': await commandesApi.delete(id); break;
        case 'categories': await categoriesApi.delete(id); break;
        case 'saisons': await saisonsApi.delete(id); break;
      }
      loadData();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editItem) {
        switch (activeSection) {
          case 'produits': {
            const productPayload = { ...formData };
            delete productPayload.stockQuantiteDisponible;
            delete productPayload.stockSeuilAlerte;
            const response = await produitsApi.update(editItem.id, productPayload);
            const produitId = response?.data?.id ?? editItem.id;
            await stocksApi.upsertByProduitId(produitId, {
              quantiteDisponible: Number(formData.stockQuantiteDisponible ?? 0),
              seuilAlerte: Number(formData.stockSeuilAlerte ?? 10),
            });
            break;
          }
          case 'agriculteurs': await agriculteursApi.update(editItem.id, formData); break;
          case 'clients': await clientsApi.update(editItem.id, formData); break;
          case 'categories': await categoriesApi.update(editItem.id, formData); break;
          case 'saisons': await saisonsApi.update(editItem.id, formData); break;
          case 'frontend': await frontendApi.update(editItem.id, formData); break;
        }
      } else {
        switch (activeSection) {
          case 'produits': {
            const productPayload = { ...formData };
            delete productPayload.stockQuantiteDisponible;
            delete productPayload.stockSeuilAlerte;
            const response = await produitsApi.create(productPayload);
            const produitId = response?.data?.id;
            if (produitId) {
              await stocksApi.upsertByProduitId(produitId, {
                quantiteDisponible: Number(formData.stockQuantiteDisponible ?? 0),
                seuilAlerte: Number(formData.stockSeuilAlerte ?? 10),
              });
            }
            break;
          }
          case 'agriculteurs': await agriculteursApi.create(formData); break;
          case 'clients': await clientsApi.create(formData); break;
          case 'categories': await categoriesApi.create(formData); break;
          case 'saisons': await saisonsApi.create(formData); break;
          case 'frontend': await frontendApi.create(formData); break;
        }
      }

      setModalOpen(false);
      setEditItem(null);
      loadData();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleUpdateCommandeStatut = async (id: number, statut: Commande['statut']) => {
    try {
      setUpdatingCommandeId(id);
      await commandesApi.updateStatut(id, statut);
      setData((current: any[]) => current.map((entry: any) => (
        entry.id === id ? { ...entry, statut } : entry
      )) as any);
    } catch (error) {
      console.error('Erreur changement statut:', error);
      alert('Erreur lors du changement de statut');
    } finally {
      setUpdatingCommandeId(null);
    }
  };

  const dateFiltree = (data as any[]).filter(item => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      item.nomProduit?.toLowerCase().includes(s) ||
      item.agriculteur?.nom?.toLowerCase().includes(s) ||
      item.agriculteur?.prenom?.toLowerCase().includes(s) ||
      item.agriculteur?.nomExploitation?.toLowerCase().includes(s) ||
      item.nom?.toLowerCase().includes(s) ||
      item.prenom?.toLowerCase().includes(s) ||
      item.genre?.toLowerCase().includes(s) ||
      item.email?.toLowerCase().includes(s) ||
      item.adresseLivraison?.toLowerCase().includes(s) ||
      item.codePostal?.toLowerCase().includes(s) ||
      item.ville?.toLowerCase().includes(s) ||
      item.numeroCommande?.toLowerCase().includes(s) ||
      item.libelle?.toLowerCase().includes(s) ||
      item.nomSaison?.toLowerCase().includes(s) ||
      item.produit?.nomProduit?.toLowerCase().includes(s) ||
      item.title?.toLowerCase().includes(s) ||
      item.highlightText?.toLowerCase().includes(s) ||
      item.description?.toLowerCase().includes(s)
    );
  });

  const handleReapprovisionner = async (stockId: number) => {
    const quantite = prompt('Quantité à ajouter au stock :');
    if (!quantite || isNaN(Number(quantite))) return;
    try {
      await stocksApi.reapprovisionner(stockId, Number(quantite));
      loadData();
    } catch (error) {
      console.error('Erreur réapprovisionnement:', error);
      alert('Erreur lors du réapprovisionnement');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-[#006851] text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">AgriMarket</h1>
          <p className="text-sm text-emerald-200">Dashboard Admin</p>
        </div>

        <nav className="space-y-2">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-700">
            <Home className="w-5 h-5" />
            <span>Retour App</span>
          </button>
          <button
            onClick={() => setActiveSection('produits')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeSection === 'produits' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}
          >
            <Package className="w-5 h-5" />
            <span>Produits</span>
          </button>
          <button
            onClick={() => setActiveSection('agriculteurs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeSection === 'agriculteurs' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}
          >
            <Users className="w-5 h-5" />
            <span>Producteurs</span>
          </button>
          <button
            onClick={() => setActiveSection('clients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeSection === 'clients' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}
          >
            <Users className="w-5 h-5" />
            <span>Clients</span>
          </button>
          <button
            onClick={() => setActiveSection('commandes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeSection === 'commandes' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Commandes</span>
          </button>
          <button
            onClick={() => setActiveSection('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeSection === 'categories' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}
          >
            <FolderOpen className="w-5 h-5" />
            <span>Catégories</span>
          </button>
          <button
            onClick={() => setActiveSection('saisons')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeSection === 'saisons' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}
          >
            <Calendar className="w-5 h-5" />
            <span>Saisons</span>
          </button>
          <button
            onClick={() => setActiveSection('stocks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeSection === 'stocks' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}
          >
            <Archive className="w-5 h-5" />
            <span>Stocks</span>
          </button>
          <button
            onClick={() => setActiveSection('frontend')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${activeSection === 'frontend' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}
          >
            <FolderOpen className="w-5 h-5" />
            <span>Pages</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 capitalize">{activeSection === 'frontend' ? 'Pages' : activeSection}</h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006851] w-48"
              />
              {!['commandes', 'stocks'].includes(activeSection) && (
                <button
                  onClick={() => { setEditItem(null); setModalOpen(true); }}
                  className="flex items-center gap-2 bg-[#006851] text-white px-6 py-3 rounded-lg hover:bg-[#005040]"
                >
                  <Plus className="w-5 h-5" />
                  <span>Ajouter</span>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    {activeSection === 'produits' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unité</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </>
                    )}
                    {activeSection === 'agriculteurs' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exploitation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </>
                    )}
                    {activeSection === 'clients' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Genre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code postal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </>
                    )}
                    {activeSection === 'commandes' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Commande</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </>
                    )}
                    {activeSection === 'categories' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icône</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Libellé</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </>
                    )}
                    {activeSection === 'saisons' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Début</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </>
                    )}
                    {activeSection === 'stocks' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seuil</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </>
                    )}
                    {activeSection === 'frontend' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bouton</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lien</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Couleurs</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={emptyColSpan} className="px-6 py-12 text-center text-gray-500">Aucune donnée disponible</td>
                    </tr>
                  ) : (
                    dateFiltree.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        {activeSection === 'produits' && (
                          <>
                            <td className="px-6 py-4">{item.nomProduit}</td>
                            <td className="px-6 py-4">
                              {item.agriculteur ? `${item.agriculteur.nom} ${item.agriculteur.prenom}` : '-'}
                            </td>
                            <td className="px-6 py-4">{item.prixUnitaire?.toFixed(2)} €</td>
                            <td className="px-6 py-4">{item.uniteMesure}</td>
                            <td className="px-6 py-4">
                              {productStocks[item.id] ? (
                                <span className={productStocks[item.id].quantiteDisponible <= productStocks[item.id].seuilAlerte ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                                  {productStocks[item.id].quantiteDisponible} dispo
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${item.estActif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {item.estActif ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => { setEditItem(item); setModalOpen(true); }} className="text-blue-600 hover:text-blue-800">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                        {activeSection === 'agriculteurs' && (
                          <>
                            <td className="px-6 py-4">{item.nom} {item.prenom}</td>
                            <td className="px-6 py-4">{item.email}</td>
                            <td className="px-6 py-4">{item.nomExploitation || '-'}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => { setEditItem(item); setModalOpen(true); }} className="text-blue-600 hover:text-blue-800">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                        {activeSection === 'clients' && (
                          <>
                            <td className="px-6 py-4 min-w-[88px]">
                              {item.imageProfil ? (
                                <img
                                  src={item.imageProfil}
                                  alt={`Photo de ${item.prenom || ''} ${item.nom || ''}`.trim() || 'Photo client'}
                                  className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-500">
                                  {`${item.prenom?.[0] || ''}${item.nom?.[0] || ''}`.toUpperCase() || '--'}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 min-w-[180px]">{item.nom} {item.prenom}</td>
                            <td className="px-6 py-4 min-w-[220px]">{item.email}</td>
                            <td className="px-6 py-4 min-w-[120px]">
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                {item.genre || 'Non renseigné'}
                              </span>
                            </td>
                            <td className="px-6 py-4 min-w-[260px]">{item.adresseLivraison || '-'}</td>
                            <td className="px-6 py-4 min-w-[120px]">{item.codePostal || '-'}</td>
                            <td className="px-6 py-4 min-w-[140px]">{item.ville || '-'}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => { setSelectedItem(item); setDetailsOpen(true); }} className="text-emerald-600 hover:text-emerald-800">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setEditItem(item); setModalOpen(true); }} className="text-blue-600 hover:text-blue-800">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                        {activeSection === 'commandes' && (
                          <>
                            <td className="px-6 py-4">{item.numeroCommande}</td>
                            <td className="px-6 py-4 min-w-[220px]">
                              <div className="font-medium text-gray-800">{item.client ? `${item.client.nom || ''} ${item.client.prenom || ''}`.trim() : 'Client inconnu'}</div>
                              <div className="text-xs text-gray-500">{item.client?.email || '-'}</div>
                            </td>
                            <td className="px-6 py-4">{new Date(item.dateCommande).toLocaleDateString()}</td>
                            <td className="px-6 py-4">{item.lignesCommande?.length ?? 0}</td>
                            <td className="px-6 py-4 max-w-[260px] truncate" title={item.adresseLivraison || '-'}>{item.adresseLivraison || '-'}</td>
                            <td className="px-6 py-4">{item.total?.toFixed(2)} €</td>
                            <td className="px-6 py-4">
                              <div className="space-y-2 min-w-[170px]">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getCommandeStatutBadgeClass(item.statut)}`}>
                                  {COMMANDE_STATUT_LABELS[item.statut as Commande['statut']] || item.statut}
                                </span>
                                <select
                                  value={item.statut}
                                  disabled={updatingCommandeId === item.id}
                                  onChange={(event) => handleUpdateCommandeStatut(item.id, event.target.value as Commande['statut'])}
                                  className="w-full border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#006851] disabled:opacity-60"
                                >
                                  {COMMANDE_STATUTS.map((statutOption) => (
                                    <option key={statutOption} value={statutOption}>
                                      {COMMANDE_STATUT_LABELS[statutOption]}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => { setSelectedItem(item); setDetailsOpen(true); }} className="text-blue-600 hover:text-blue-800">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                        {activeSection === 'categories' && (
                          <>
                            <td className="px-6 py-4 text-2xl">{item.icone || ICONES_CATEGORIES[item.libelle] || '🌱'}</td>
                            <td className="px-6 py-4">{item.libelle}</td>
                            <td className="px-6 py-4">{item.description || '-'}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${item.estActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {item.estActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => { setEditItem(item); setModalOpen(true); }} className="text-blue-600 hover:text-blue-800">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                        {activeSection === 'saisons' && (
                          <>
                            <td className="px-6 py-4">{item.nomSaison}</td>
                            <td className="px-6 py-4">{new Date(item.dateDebut).toLocaleDateString()}</td>
                            <td className="px-6 py-4">{new Date(item.dateFin).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => { setEditItem(item); setModalOpen(true); }} className="text-blue-600 hover:text-blue-800">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                        {activeSection === 'stocks' && (
                          <>
                            <td className="px-6 py-4">{item.produit?.nomProduit || 'N/A'}</td>
                            <td className="px-6 py-4">
                              <span className={item.quantiteDisponible <= item.seuilAlerte ? 'text-red-600 font-semibold' : ''}>
                                {item.quantiteDisponible}
                              </span>
                            </td>
                            <td className="px-6 py-4">{item.seuilAlerte}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleReapprovisionner(item.id)}
                                className="bg-[#006851] text-white px-3 py-1 rounded text-sm hover:bg-[#005040]"
                              >
                                Réapprovisionner
                              </button>
                            </td>
                          </>
                        )}
                        {activeSection === 'frontend' && (
                          <>
                            <td className="px-6 py-4">{item.title || '-'}</td>
                            <td className="px-6 py-4">{item.highlightText || '-'}</td>
                            <td className="px-6 py-4">{item.buttonLabel || '-'}</td>
                            <td className="px-6 py-4">{item.linkUrl || '-'}</td>
                            <td className="px-6 py-4">{item.description || '-'}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2 items-center">
                                <span className="w-6 h-6 rounded-full" style={{ backgroundColor: item.gradientFrom || '#999' }} />
                                <span className="w-6 h-6 rounded-full" style={{ backgroundColor: item.gradientTo || '#999' }} />
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => { setEditItem(item); setModalOpen(true); }} className="text-blue-600 hover:text-blue-800">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {modalOpen && <FormModal section={activeSection} item={editItem} onClose={() => { setModalOpen(false); setEditItem(null); }} onSave={handleSave} />}
      {detailsOpen && <DetailsModal item={selectedItem} onClose={() => { setDetailsOpen(false); setSelectedItem(null); }} />}
    </div>
  );
}

function FormModal({ section, item, onClose, onSave }: any) {
  const [formData, setFormData] = useState(item || {});
  const [agriculteurs, setAgriculteurs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [saisons, setSaisons] = useState<any[]>([]);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [imageError, setImageError] = useState('');

  const MAX_IMAGE_DIMENSION = 1200;
  const MAX_IMAGE_SIZE_BYTES = 350 * 1024;

  const compressProductImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = image;

          if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
            const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Impossible de compresser l\'image (canvas indisponible).'));
            return;
          }

          context.drawImage(image, 0, 0, width, height);

          let quality = 0.85;
          let dataUrl = canvas.toDataURL('image/webp', quality);

          while (dataUrl.length > MAX_IMAGE_SIZE_BYTES * 1.37 && quality > 0.45) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/webp', quality);
          }

          if (dataUrl.length > MAX_IMAGE_SIZE_BYTES * 1.37) {
            quality = 0.82;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
            while (dataUrl.length > MAX_IMAGE_SIZE_BYTES * 1.37 && quality > 0.45) {
              quality -= 0.1;
              dataUrl = canvas.toDataURL('image/jpeg', quality);
            }
          }

          resolve(dataUrl);
        };

        image.onerror = () => reject(new Error('Le fichier image est invalide.'));
        image.src = String(reader.result);
      };

      reader.onerror = () => reject(new Error('Impossible de lire le fichier image.'));
      reader.readAsDataURL(file);
    });
  };

  const handleProductImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageError('Fichier invalide: sélectionne une image.');
      event.target.value = '';
      return;
    }

    setImageError('');
    setIsCompressingImage(true);
    try {
      const compressedDataUrl = await compressProductImage(file);
      setFormData((current: any) => ({ ...current, imageUrl: compressedDataUrl }));
    } catch (error: any) {
      setImageError(error?.message || 'Erreur lors de la compression de l\'image.');
    } finally {
      setIsCompressingImage(false);
      event.target.value = '';
    }
  };

  const getDataUrlSizeKb = (dataUrl?: string) => {
    if (!dataUrl || !dataUrl.startsWith('data:')) {
      return null;
    }
    const base64 = dataUrl.split(',')[1] || '';
    const bytes = Math.ceil((base64.length * 3) / 4);
    return Math.round(bytes / 1024);
  };

  useEffect(() => {
    setFormData(item || {});
    if (section !== 'produits') {
      return;
    }

    const loadStock = async () => {
      try {
        if (item?.id) {
          const stockResponse = await stocksApi.getByProduitId(item.id);
          const stock = stockResponse?.data;
          setFormData((current: any) => ({
            ...current,
            stockQuantiteDisponible: stock?.quantiteDisponible ?? 0,
            stockSeuilAlerte: stock?.seuilAlerte ?? 10,
          }));
        } else {
          setFormData((current: any) => ({
            ...current,
            stockQuantiteDisponible: 0,
            stockSeuilAlerte: 10,
          }));
        }
      } catch (error) {
        setFormData((current: any) => ({
          ...current,
          stockQuantiteDisponible: 0,
          stockSeuilAlerte: 10,
        }));
      }
    };

    loadStock();
  }, [item, section]);

  useEffect(() => {
    if (section !== 'produits') return;

    const load = async () => {
      try {
        const [agRes, catRes, saiRes] = await Promise.all([
          agriculteursApi.getAll(),
          categoriesApi.getAll(),
          saisonsApi.getAll(),
        ]);

        setAgriculteurs(agRes?.data || []);
        setCategories(catRes?.data || []);
        setSaisons(saiRes?.data || []);
      } catch (e) {
        console.error('Erreur chargement listes:', e);
      }
    };

    load();
  }, [section]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (section === 'produits' && isCompressingImage) {
      alert('Compression en cours, attends la fin avant de sauvegarder.');
      return;
    }

    const payload = { ...formData };
    if (section === 'frontend') {
      payload.section = 'special-offer';
      if (payload.estActif === undefined) {
        payload.estActif = true;
      }
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-2xl font-bold mb-4">{item ? 'Modifier' : 'Ajouter'} {section}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
        {section === 'produits' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Agriculteur *</label>
                <select
                  value={formData.agriculteurId ?? ''}
                  onChange={(e) => setFormData({ ...formData, agriculteurId: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="" disabled>Choisir un producteur</option>
                  {agriculteurs.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nom} {a.prenom}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                placeholder="Nom du produit"
                value={formData.nomProduit || ''}
                onChange={(e) => setFormData({ ...formData, nomProduit: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.descriptionProduit || ''}
                onChange={(e) => setFormData({ ...formData, descriptionProduit: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Prix unitaire"
                value={formData.prixUnitaire || ''}
                onChange={(e) => setFormData({ ...formData, prixUnitaire: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Unité (kg, u, etc.)"
                value={formData.uniteMesure || 'kg'}
                onChange={(e) => setFormData({ ...formData, uniteMesure: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Image produit</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageUpload}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="url"
                  placeholder="Ou colle une URL d'image"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <p className="text-xs text-gray-500">
                  Les images uploadées sont compressées automatiquement avant l'enregistrement en base.
                </p>
                {isCompressingImage && (
                  <p className="text-sm text-emerald-700">Compression en cours...</p>
                )}
                {imageError && (
                  <p className="text-sm text-red-600">{imageError}</p>
                )}
                {formData.imageUrl && (
                  <div className="mt-2 border rounded-lg p-3 bg-gray-50">
                    <img
                      src={formData.imageUrl}
                      alt="Aperçu produit"
                      className="h-36 w-36 object-cover rounded-lg border"
                    />
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-600">
                        Taille estimée: {getDataUrlSizeKb(formData.imageUrl) ? `${getDataUrlSizeKb(formData.imageUrl)} KB` : 'URL externe'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="text-xs px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        Retirer l'image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select
                  value={formData.categorieId ?? ''}
                  onChange={(e) => setFormData({ ...formData, categorieId: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Aucune</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.libelle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Saison</label>
                <select
                  value={formData.saisonId ?? ''}
                  onChange={(e) => setFormData({ ...formData, saisonId: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Aucune</option>
                  {saisons.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nomSaison}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.estActif !== false}
                  onChange={(e) => setFormData({ ...formData, estActif: e.target.checked })}
                />
                <span>Actif</span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  min="0"
                  placeholder="Stock disponible"
                  value={formData.stockQuantiteDisponible ?? 0}
                  onChange={(e) => setFormData({ ...formData, stockQuantiteDisponible: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Seuil d'alerte"
                  value={formData.stockSeuilAlerte ?? 10}
                  onChange={(e) => setFormData({ ...formData, stockSeuilAlerte: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </>
          )}


          {section === 'agriculteurs' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom *"
                  value={formData.nom || ''}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Prénom *"
                  value={formData.prenom || ''}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email *"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={formData.telephone || ''}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Nom de l'exploitation"
                value={formData.nomExploitation || ''}
                onChange={(e) => setFormData({ ...formData, nomExploitation: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Ville"
                value={formData.ville || ''}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.estActif !== false}
                  onChange={(e) => setFormData({ ...formData, estActif: e.target.checked })}
                />
                <span>Actif</span>
              </label>
            </>
          )}

          {section === 'clients' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom *"
                  value={formData.nom || ''}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Prénom *"
                  value={formData.prenom || ''}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <select
                value={formData.genre || ''}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="" disabled>Genre *</option>
                <option value="Femme">Femme</option>
                <option value="Homme">Homme</option>
                <option value="Autre">Autre</option>
              </select>
              <input
                type="email"
                placeholder="Email *"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={formData.telephone || ''}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Adresse"
                value={formData.adresseLivraison || ''}
                onChange={(e) => setFormData({ ...formData, adresseLivraison: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Code postal"
                value={formData.codePostal || ''}
                onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Ville"
                value={formData.ville || ''}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.estActif !== false}
                  onChange={(e) => setFormData({ ...formData, estActif: e.target.checked })}
                />
                <span>Actif</span>
              </label>
            </>
          )}

          {section === 'categories' && (
            <>
              <input
                type="text"
                placeholder="Libellé"
                value={formData.libelle || ''}
                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div>
                <label className="block text-sm font-medium mb-1">Icône</label>
                <select
                  value={formData.icone || ICONES_CATEGORIES[formData.libelle] || '🌱'}
                  onChange={(e) => setFormData({ ...formData, icone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="🌱">🌱 Standard</option>
                  <option value="🥦">🥦 Légumes</option>
                  <option value="🍓">🍓 Fruits</option>
                  <option value="🌿">🌿 Herbes / Aromates</option>
                  <option value="🫙">🫙 Produits transformés</option>
                  <option value="🥚">🥚 Oeufs / Laitiers</option>
                  <option value="🍯">🍯 Miel</option>
                  <option value="🧺">🧺 Marché / Produits locaux</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Choisis une icône compatible avec la catégorie. Si le libellé correspond à un thème connu, une suggestion est proposée.
                </p>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.estActive !== false}
                  onChange={(e) => setFormData({ ...formData, estActive: e.target.checked })}
                />
                <span>Active</span>
              </label>
            </>
          )}

          {section === 'frontend' && (
            <>
              <input
                type="text"
                placeholder="Titre"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Offre mise en avant"
                value={formData.highlightText || ''}
                onChange={(e) => setFormData({ ...formData, highlightText: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Texte du bouton principal (ex: Voir les tomates)"
                value={formData.buttonLabel || ''}
                onChange={(e) => setFormData({ ...formData, buttonLabel: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Lien de redirection (ex: /?search=Tomates)"
                value={formData.linkUrl || ''}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Gradient de départ</label>
                  <input
                    type="color"
                    value={formData.gradientFrom || '#993d49'}
                    onChange={(e) => setFormData({ ...formData, gradientFrom: e.target.value })}
                    className="w-full h-12 border rounded-lg p-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gradient d'arrivée</label>
                  <input
                    type="color"
                    value={formData.gradientTo || '#992027'}
                    onChange={(e) => setFormData({ ...formData, gradientTo: e.target.value })}
                    className="w-full h-12 border rounded-lg p-1"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={formData.estActif !== false}
                  onChange={(e) => setFormData({ ...formData, estActif: e.target.checked })}
                  className="h-4 w-4"
                />
                <span>Afficher l'offre spéciale</span>
              </label>
            </>
          )}

          {section === 'saisons' && (
            <>
              <input
                type="text"
                placeholder="Nom de la saison"
                value={formData.nomSaison || ''}
                onChange={(e) => setFormData({ ...formData, nomSaison: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="date"
                placeholder="Date début"
                value={formData.dateDebut || ''}
                onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="date"
                placeholder="Date fin"
                value={formData.dateFin || ''}
                onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </>
          )}

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Annuler
            </button>
            <button type="submit" className="px-6 py-2 bg-[#006851] text-white rounded-lg hover:bg-[#005040]">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DetailsModal({ item, onClose }: any) {
  const isClient = !!item && !!item.email && !item.numeroCommande;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-2xl font-bold mb-4">{isClient ? 'Détails du client' : 'Détails de la commande'}</h3>
        {isClient ? (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {item.imageProfil ? (
                <img
                  src={item.imageProfil}
                  alt={`Photo de ${item.prenom || ''} ${item.nom || ''}`.trim() || 'Photo client'}
                  className="h-20 w-20 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-lg font-semibold text-gray-500">
                  {`${item.prenom?.[0] || ''}${item.nom?.[0] || ''}`.toUpperCase() || '--'}
                </div>
              )}
              <div>
                <p className="text-lg font-semibold">{item.nom} {item.prenom}</p>
                <p className="text-sm text-gray-600">{item.email}</p>
              </div>
            </div>
            <p><strong>Genre:</strong> {item.genre || 'Non renseigné'}</p>
            <p><strong>Téléphone:</strong> {item.telephone || 'Non renseigné'}</p>
            <p><strong>Adresse:</strong> {item.adresseLivraison || 'Non spécifiée'}</p>
            <p><strong>Code postal:</strong> {item.codePostal || 'Non spécifié'}</p>
            <p><strong>Ville:</strong> {item.ville || 'Non spécifiée'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>N° Commande:</strong> {item.numeroCommande}</p>
            <p><strong>Client:</strong> {item.client ? `${item.client.nom || ''} ${item.client.prenom || ''}`.trim() : 'Client inconnu'}</p>
            <p><strong>Email client:</strong> {item.client?.email || 'Non spécifié'}</p>
            <p><strong>Date:</strong> {new Date(item.dateCommande).toLocaleString()}</p>
            <p><strong>Total:</strong> {item.total?.toFixed(2)} €</p>
            <p><strong>Statut:</strong> <span className={`px-2 py-1 rounded-full text-xs ${
              item.statut === 'LIVREE' ? 'bg-green-100 text-green-800' :
              item.statut === 'CONFIRMEE' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>{item.statut}</span></p>
            <p><strong>Adresse livraison:</strong> {item.adresseLivraison || 'Non spécifiée'}</p>
            {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}

            <div className="pt-2">
              <p className="font-semibold mb-2">Lignes de commande</p>
              {Array.isArray(item.lignesCommande) && item.lignesCommande.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">Produit</th>
                        <th className="px-3 py-2 text-left">Quantité</th>
                        <th className="px-3 py-2 text-left">Prix unitaire</th>
                        <th className="px-3 py-2 text-left">Sous-total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.lignesCommande.map((ligne: any) => {
                        const prixUnitaire = Number(ligne.prixUnitaireSnapshot ?? ligne.prixUnitaire ?? 0);
                        const quantite = Number(ligne.quantite ?? 0);
                        const sousTotal = Number(ligne.prixLigne ?? (prixUnitaire * quantite));
                        return (
                          <tr key={ligne.id ?? `${ligne.produit?.id ?? 'p'}-${quantite}-${prixUnitaire}`} className="border-t border-gray-100">
                            <td className="px-3 py-2">{ligne.produit?.nomProduit || `Produit #${ligne.produitId ?? '-'}`}</td>
                            <td className="px-3 py-2">{quantite}</td>
                            <td className="px-3 py-2">{prixUnitaire.toFixed(2)} €</td>
                            <td className="px-3 py-2 font-medium">{sousTotal.toFixed(2)} €</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucune ligne disponible pour cette commande.</p>
              )}
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
