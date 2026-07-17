import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Minus, Plus } from 'lucide-react';
import { produitsApi, stocksApi } from '../services/api';
import { usePanier } from '../components/Panier';
import PanierModal from '../components/Panier';
import type { Produit, Stock } from '../services/types';
import { ICONES_CATEGORIES } from '../services/constants';

function Stars({ note }: { note: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className="w-4 h-4"
          fill={i <= Math.round(note) ? '#f59e0b' : 'none'}
          stroke={i <= Math.round(note) ? '#f59e0b' : '#d1d5db'}
        />
      ))}
    </div>
  );
}

function ProduitDetailContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [produit, setProduit] = useState<Produit | null>(null);
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  const [stockLoading, setStockLoading] = useState(false);
  const [panierOpen, setPanierOpen] = useState(false);
  const [quantite, setQuantite] = useState(1);
  const { ajouterAuPanier, items } = usePanier();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await produitsApi.getById(Number(id));
        setProduit(res.data);
        try {
          setStockLoading(true);
          const stockRes = await stocksApi.getByProduitId(Number(id));
          setStock(stockRes.data || null);
        } catch {
          setStock(null);
        } finally {
          setStockLoading(false);
        }
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAjouter = () => {
    if (!produit) return;
    for (let i = 0; i < quantite; i++) ajouterAuPanier(produit);
    setPanierOpen(true);
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-[#d6fff5]">Chargement...</div>;
  if (!produit) return null;

  const categorie = produit.categorie;
  const icone = categorie ? (ICONES_CATEGORIES[categorie.libelle] ?? '🌱') : null;
  const note = produit.note ?? 4.5;
  const nbAvis = produit.nbAvis ?? 0;

  return (
    <div className="bg-[#d6fff5] min-h-screen">
      <header className="fixed top-0 left-0 right-0 backdrop-blur-[12px] bg-[rgba(236,253,245,0.7)] shadow-lg z-40">
        <div className="max-w-[672px] mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#065F46]">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Retour</span>
          </button>
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

      <main className="max-w-[672px] mx-auto px-6 pt-24 pb-12 space-y-4">

        {/* Image */}
        <div className="aspect-square bg-[#aff6e7] rounded-[48px] overflow-hidden">
          {produit.imageUrl ? (
            <img
              src={produit.imageUrl}
              alt={produit.nomProduit}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">
              {icone ?? '🌱'}
            </div>
          )}
        </div>

        {/* Infos principales */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm space-y-3">

          {/* Catégorie */}
          {categorie && (
            <span className="inline-flex items-center gap-1 bg-[#d6fff5] text-[#006851] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {icone} {categorie.libelle}
            </span>
          )}

          {/* Nom + Prix */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-[26px] font-extrabold text-[#00362e] leading-tight">{produit.nomProduit}</h1>
            <div className="text-right shrink-0">
              <p className="text-[24px] font-bold text-[#006851]">{Number(produit.prixUnitaire).toFixed(2)} €</p>
              <p className="text-xs text-[#7fb8ac]">par {produit.uniteMesure}</p>
            </div>
          </div>

          {/* Étoiles + avis */}
          <div className="flex items-center gap-2">
            <Stars note={note} />
            <span className="text-sm font-bold text-[#00362e]">{note.toFixed(1)}</span>
            {nbAvis > 0 && <span className="text-sm text-gray-400">({nbAvis} avis)</span>}
          </div>

          {produit.agriculteur && (
            <div className="rounded-[24px] bg-[#f8fffc] p-4">
              <h2 className="text-[16px] font-bold text-[#00362e] mb-2">Producteur</h2>
              <p className="text-sm font-semibold text-[#006851]">{produit.agriculteur.nom} {produit.agriculteur.prenom}</p>
              {produit.agriculteur.nomExploitation && <p className="text-sm text-[#2c655b]">{produit.agriculteur.nomExploitation}</p>}
              {produit.agriculteur.ville && <p className="text-xs text-gray-400">{produit.agriculteur.ville}</p>}
            </div>
          )}

          <div className="rounded-[24px] bg-[#f8fffc] p-4">
            <h2 className="text-[16px] font-bold text-[#00362e] mb-2">Stock</h2>
            <p className="text-sm text-[#2c655b]">
              {stockLoading
                ? 'Chargement du stock...'
                : stock
                  ? `${stock.quantiteDisponible} ${produit.uniteMesure} disponibles`
                  : 'Stock non renseigné'}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {produit.estBio && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">🌿 Bio</span>
            )}
            {produit.estLocal && (
              <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">📍 Local</span>
            )}
            {produit.estNouveau && (
              <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">✨ Nouveau</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm">
          <h2 className="text-[16px] font-bold text-[#00362e] mb-2">Description</h2>
          <p className="text-[#2c655b] text-sm leading-relaxed">
            {produit.descriptionProduit || 'Aucune description disponible.'}
          </p>
          {produit.variete && (
            <p className="text-xs text-gray-400 mt-2">Variété : {produit.variete}</p>
          )}
        </div>

        {/* Quantité + Bouton */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm">
          <h2 className="text-[16px] font-bold text-[#00362e] mb-4">Quantité</h2>
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setQuantite(q => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full bg-[#d6fff5] text-[#006851] flex items-center justify-center hover:bg-[#a4f1e1] transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-[24px] font-bold text-[#00362e] w-8 text-center">{quantite}</span>
            <button
              onClick={() => setQuantite(q => q + 1)}
              className="w-10 h-10 rounded-full bg-[#006851] text-white flex items-center justify-center hover:bg-[#005040] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400 ml-2">{produit.uniteMesure}</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-[20px] font-bold text-[#006851]">
              {(Number(produit.prixUnitaire) * quantite).toFixed(2)} €
            </span>
          </div>

          <button
            onClick={handleAjouter}
            className="w-full bg-[#006851] text-white py-4 rounded-full text-lg font-bold hover:bg-[#005040] transition-colors"
          >
            Ajouter au panier
          </button>
        </div>

      </main>

      <PanierModal isOpen={panierOpen} onClose={() => setPanierOpen(false)} />
    </div>
  );
}

export default function ProduitDetail() {
  return <ProduitDetailContent />;
}
