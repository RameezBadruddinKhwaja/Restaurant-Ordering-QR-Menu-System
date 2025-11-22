import api from '@/lib/api';
import { Restaurant } from '@/types';

export const restaurantService = {
  async getAll(params?: {
    city?: string;
    cuisineType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/api/restaurants', { params });
    return response.data.data;
  },

  async getById(id: string) {
    const response = await api.get(`/api/restaurants/${id}`);
    return response.data.data as Restaurant;
  },

  async getBySlug(slug: string) {
    const response = await api.get(`/api/restaurants/slug/${slug}`);
    return response.data.data as Restaurant;
  },

  async getMyRestaurants() {
    const response = await api.get('/api/restaurants/owner/my-restaurants');
    return response.data.data as Restaurant[];
  },

  async create(data: any) {
    const response = await api.post('/api/restaurants', data);
    return response.data.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`/api/restaurants/${id}`, data);
    return response.data.data;
  },
};
