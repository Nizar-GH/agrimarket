import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#d6fff5] flex flex-col items-center justify-center gap-6 px-6">
      <span className="text-8xl">🌱</span>
      <h1 className="text-4xl font-extrabold text-[#00362e]">404</h1>
      <p className="text-[#2c655b] text-lg text-center">Cette page n'existe pas ou a été déplacée.</p>
      <button
        onClick={() => navigate('/')}
        className="bg-[#006851] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#005040] transition-colors"
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
