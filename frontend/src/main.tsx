import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './app/App'
import Dashboard from './dashboard/Dashboard'
import ProduitDetail from './app/ProduitDetail'
import NotFound from './app/NotFound'
import { PanierProvider } from './components/Panier'
import { ReCaptchaProvider } from './components/ReCaptchaWrapper'
// CSS unique : tailwind.css importe Tailwind CSS 4 + animations
import './styles/tailwind.css'
import 'leaflet/dist/leaflet.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReCaptchaProvider>
      <BrowserRouter>
        <PanierProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/produit/:id" element={<ProduitDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PanierProvider>
      </BrowserRouter>
    </ReCaptchaProvider>
  </React.StrictMode>
)
