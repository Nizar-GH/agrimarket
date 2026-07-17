import axios from 'axios';
import {
  mockProduits,
  mockCategories,
  mockAgriculteurs,
  mockClients,
  mockCommandes,
  mockSaisons,
  mockStocks,
  mockFrontendSettings,
  delay,
} from './mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8283/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper pour simuler une réponse API
const mockResponse = async (data: any) => {
  await delay();
  return { data };
};

export const produitsApi = {
  getAll: () => USE_MOCK_DATA ? mockResponse(mockProduits) : api.get('/produits'),
  getById: (id: number) => USE_MOCK_DATA ? mockResponse(mockProduits.find(p => p.id === id)) : api.get(`/produits/${id}`),
  create: (data: any) => USE_MOCK_DATA ? mockResponse({ ...data, id: Date.now() }) : api.post('/produits', data),
  update: (id: number, data: any) => USE_MOCK_DATA ? mockResponse({ ...data, id }) : api.put(`/produits/${id}`, data),
  delete: (id: number) => USE_MOCK_DATA ? mockResponse({}) : api.delete(`/produits/${id}`),
};

export const categoriesApi = {
  getAll: () => USE_MOCK_DATA ? mockResponse(mockCategories) : api.get('/categories'),
  getById: (id: number) => USE_MOCK_DATA ? mockResponse(mockCategories.find(c => c.id === id)) : api.get(`/categories/${id}`),
  create: (data: any) => USE_MOCK_DATA ? mockResponse({ ...data, id: Date.now() }) : api.post('/categories', data),
  update: (id: number, data: any) => USE_MOCK_DATA ? mockResponse({ ...data, id }) : api.put(`/categories/${id}`, data),
  delete: (id: number) => USE_MOCK_DATA ? mockResponse({}) : api.delete(`/categories/${id}`),
};

export const agriculteursApi = {
  getAll: () => USE_MOCK_DATA ? mockResponse(mockAgriculteurs) : api.get('/agriculteurs'),
  getById: (id: number) => USE_MOCK_DATA ? mockResponse(mockAgriculteurs.find(a => a.id === id)) : api.get(`/agriculteurs/${id}`),
  create: (data: any) => USE_MOCK_DATA ? mockResponse({ ...data, id: Date.now() }) : api.post('/agriculteurs', data),
  update: (id: number, data: any) => USE_MOCK_DATA ? mockResponse({ ...data, id }) : api.put(`/agriculteurs/${id}`, data),
  delete: (id: number) => USE_MOCK_DATA ? mockResponse({}) : api.delete(`/agriculteurs/${id}`),
};

export const clientsApi = {
  getAll: () => USE_MOCK_DATA ? mockResponse(mockClients.filter((c: any) => c.estActif !== false)) : api.get('/clients'),
  getById: (id: number) => USE_MOCK_DATA ? mockResponse(mockClients.find(c => c.id === id)) : api.get(`/clients/${id}`),
  create: (data: any) => {
    if (!USE_MOCK_DATA) {
      return api.post('/clients', data);
    }

    const createdClient = {
      ...data,
      id: Date.now(),
      estActif: data.estActif ?? true,
    };
    mockClients.unshift(createdClient as any);
    return mockResponse(createdClient);
  },
  update: (id: number, data: any) => {
    if (!USE_MOCK_DATA) {
      return api.put(`/clients/${id}`, data);
    }

    const index = mockClients.findIndex((c: any) => c.id === id);
    if (index >= 0) {
      mockClients[index] = {
        ...mockClients[index],
        ...data,
        id,
      } as any;
      return mockResponse(mockClients[index]);
    }

    const fallbackClient = {
      ...data,
      id,
      estActif: data.estActif ?? true,
    };
    mockClients.unshift(fallbackClient as any);
    return mockResponse(fallbackClient);
  },
  delete: (id: number) => {
    if (!USE_MOCK_DATA) {
      return api.delete(`/clients/${id}`);
    }

    const index = mockClients.findIndex((c: any) => c.id === id);
    if (index >= 0) {
      mockClients[index] = {
        ...mockClients[index],
        estActif: false,
      } as any;
    }
    return mockResponse({});
  },
};

export const commandesApi = {
  getAll: () => USE_MOCK_DATA ? mockResponse(mockCommandes) : api.get('/commandes'),
  getById: (id: number) => USE_MOCK_DATA ? mockResponse(mockCommandes.find(c => c.id === id)) : api.get(`/commandes/${id}`),
  create: (data: any) => USE_MOCK_DATA ? mockResponse({ ...data, id: Date.now() }) : api.post('/commandes', data),
  updateStatut: (id: number, statut: string) => USE_MOCK_DATA ? mockResponse({ statut }) : api.put(`/commandes/${id}/statut?statut=${statut}`),
  delete: (id: number) => USE_MOCK_DATA ? mockResponse({}) : api.delete(`/commandes/${id}`),
};

export const saisonsApi = {
  getAll: () => USE_MOCK_DATA ? mockResponse(mockSaisons) : api.get('/saisons'),
  getById: (id: number) => USE_MOCK_DATA ? mockResponse(mockSaisons.find(s => s.id === id)) : api.get(`/saisons/${id}`),
  create: (data: any) => USE_MOCK_DATA ? mockResponse({ ...data, id: Date.now() }) : api.post('/saisons', data),
  update: (id: number, data: any) => USE_MOCK_DATA ? mockResponse({ ...data, id }) : api.put(`/saisons/${id}`, data),
  delete: (id: number) => USE_MOCK_DATA ? mockResponse({}) : api.delete(`/saisons/${id}`),
};

export const stocksApi = {
  getAll: () => USE_MOCK_DATA ? mockResponse(mockStocks) : api.get('/stocks'),
  getByProduitId: (produitId: number) => USE_MOCK_DATA ? mockResponse(mockStocks.find(s => s.produit?.id === produitId || s.id === produitId) || null) : api.get(`/stocks/produit/${produitId}`),
  reapprovisionner: (id: number, quantite: number) => USE_MOCK_DATA ? mockResponse({ quantite }) : api.put(`/stocks/${id}/reapprovisionner?quantite=${quantite}`),
  update: (id: number, data: any) => USE_MOCK_DATA ? mockResponse({ ...data, id }) : api.put(`/stocks/${id}`, data),
  upsertByProduitId: (produitId: number, data: any) => USE_MOCK_DATA ? mockResponse({ ...data, produit: { id: produitId } }) : api.put(`/stocks/produit/${produitId}`, data),
};

export const frontendApi = {
  getAll: () => USE_MOCK_DATA ? mockResponse(mockFrontendSettings) : api.get('/frontend-settings'),
  getBySection: async (section: string) => {
    if (USE_MOCK_DATA) {
      return mockResponse(mockFrontendSettings.find(s => s.section === section) || null);
    }
    try {
      return await api.get(`/frontend-settings/section/${section}`);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        const response = await api.get('/frontend-settings');
        const item = Array.isArray(response.data)
          ? response.data.find((s: any) => s.section === section)
          : null;
        return { data: item };
      }
      throw error;
    }
  },
  update: (id: number, data: any) => USE_MOCK_DATA ? mockResponse({ ...data, id }) : api.put(`/frontend-settings/${id}`, data),
  create: (data: any) => USE_MOCK_DATA ? mockResponse({ ...data, id: Date.now() }) : api.post('/frontend-settings', data),
};
