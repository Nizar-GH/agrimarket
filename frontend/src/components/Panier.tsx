import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { commandesApi } from '../services/api';
import type { PanierItem } from '../services/types';

const STORAGE_KEY = 'agrimarket_panier';

interface PanierContextType {
  items: PanierItem[];
  ajouterAuPanier: (produit: PanierItem) => void;
  retirerDuPanier: (id: number) => void;
  modifierQuantite: (id: number, quantite: number) => void;
  viderPanier: () => void;
  total: number;
}

const PanierContext = createContext<PanierContextType | undefined>(undefined);

export const PanierProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<PanierItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const ajouterAuPanier = (produit: PanierItem) => {
    setItems(prev => {
      const existant = prev.find(item => item.id === produit.id);
      if (existant) {
        return prev.map(item =>
          item.id === produit.id ? { ...item, quantite: item.quantite + 1 } : item
        );
      }
      return [...prev, { ...produit, quantite: 1 }];
    });
  };

  const retirerDuPanier = (id: number) => setItems(prev => prev.filter(item => item.id !== id));

  const modifierQuantite = (id: number, quantite: number) => {
    if (quantite <= 0) { retirerDuPanier(id); return; }
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantite } : item));
  };

  const viderPanier = () => setItems([]);
  const total = items.reduce((sum, item) => sum + item.prixUnitaire * item.quantite, 0);

  return (
    <PanierContext.Provider value={{ items, ajouterAuPanier, retirerDuPanier, modifierQuantite, viderPanier, total }}>
      {children}
    </PanierContext.Provider>
  );
};

export const usePanier = () => {
  const context = useContext(PanierContext);
  if (!context) throw new Error('usePanier doit être utilisé dans un PanierProvider');
  return context;
};

interface ClientForm {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresseLivraison: string;
}

export default function PanierModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, retirerDuPanier, modifierQuantite, viderPanier, total } = usePanier();
  const [etape, setEtape] = useState<'panier' | 'client'>('panier');
  const [loading, setLoading] = useState(false);
  const [clientForm, setClientForm] = useState<ClientForm>({
    nom: '', prenom: '', email: '', telephone: '', adresseLivraison: '',
  });

  const handleClose = () => { setEtape('panier'); onClose(); };

  const handleCommander = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await commandesApi.create({
        clientNom: clientForm.nom,
        clientPrenom: clientForm.prenom,
        clientEmail: clientForm.email,
        clientTelephone: clientForm.telephone,
        adresseLivraison: clientForm.adresseLivraison,
        lignesCommande: items.map(item => ({
          produitId: item.id,
          quantite: item.quantite,
          prixUnitaire: item.prixUnitaire,
        })),
      });

      window.dispatchEvent(new CustomEvent('agrimarket:commande-created', {
        detail: {
          commandeId: response?.data?.id,
          numeroCommande: response?.data?.numeroCommande,
          clientEmail: clientForm.email,
        }
      }));

      viderPanier();
      setEtape('panier');
      setClientForm({ nom: '', prenom: '', email: '', telephone: '', adresseLivraison: '' });
      handleClose();
      alert('Commande passée avec succès !');
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || error?.response?.data;
      alert(backendMessage || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[32px] max-w-[500px] w-full max-h-[85vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {etape === 'client' && (
              <button onClick={() => setEtape('panier')} className="text-[#006851] font-semibold text-sm">← Retour</button>
            )}
            <h2 className="text-[22px] font-bold text-[#00362e]">
              {etape === 'panier' ? 'Panier' : 'Vos coordonnées'}
            </h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Contenu panier */}
        {etape === 'panier' && (
          <>
            <div className="p-6 overflow-y-auto flex-1">
              {items.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Votre panier est vide</p>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-[#f0fdf4] rounded-2xl">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.nomProduit} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#00362e] truncate">{item.nomProduit}</p>
                        <p className="text-xs text-gray-400">{item.prixUnitaire.toFixed(2)} € / {item.uniteMesure}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => modifierQuantite(item.id, item.quantite - 1)}
                          className="w-7 h-7 rounded-full bg-[#d6fff5] text-[#006851] flex items-center justify-center hover:bg-[#a4f1e1] font-bold"
                        >-</button>
                        <span className="w-6 text-center font-bold text-[#00362e]">{item.quantite}</span>
                        <button
                          onClick={() => modifierQuantite(item.id, item.quantite + 1)}
                          className="w-7 h-7 rounded-full bg-[#006851] text-white flex items-center justify-center hover:bg-[#005040] font-bold"
                        >+</button>
                        <span className="font-bold text-[#006851] ml-1 w-14 text-right">{(item.prixUnitaire * item.quantite).toFixed(2)} €</span>
                        <button onClick={() => retirerDuPanier(item.id)} className="text-red-400 hover:text-red-600 text-lg leading-none ml-1">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-200 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-[#00362e]">Total</span>
                  <span className="text-2xl font-bold text-[#006851]">{total.toFixed(2)} €</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={viderPanier} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-full font-semibold hover:bg-gray-200">
                    Vider
                  </button>
                  <button onClick={() => setEtape('client')} className="flex-1 bg-[#006851] text-white py-3 rounded-full font-semibold hover:bg-[#005040]">
                    Commander →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Formulaire client */}
        {etape === 'client' && (
          <form onSubmit={handleCommander} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text" placeholder="Nom *" required
                  value={clientForm.nom}
                  onChange={e => setClientForm({ ...clientForm, nom: e.target.value })}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006851]"
                />
                <input
                  type="text" placeholder="Prénom"
                  value={clientForm.prenom}
                  onChange={e => setClientForm({ ...clientForm, prenom: e.target.value })}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006851]"
                />
              </div>
              <input
                type="email" placeholder="Email *" required
                value={clientForm.email}
                onChange={e => setClientForm({ ...clientForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006851]"
              />
              <input
                type="tel" placeholder="Téléphone"
                value={clientForm.telephone}
                onChange={e => setClientForm({ ...clientForm, telephone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006851]"
              />
              <textarea
                placeholder="Adresse de livraison *" required rows={3}
                value={clientForm.adresseLivraison}
                onChange={e => setClientForm({ ...clientForm, adresseLivraison: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006851] resize-none"
              />
              <div className="bg-[#f0fdf4] rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">{items.length} article(s)</span>
                <span className="font-bold text-[#006851]">{total.toFixed(2)} €</span>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 shrink-0">
              <button
                type="submit" disabled={loading}
                className="w-full bg-[#006851] text-white py-4 rounded-full text-lg font-bold hover:bg-[#005040] disabled:opacity-50"
              >
                {loading ? 'En cours...' : 'Confirmer la commande'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
