import api from '@/lib/api';
import { MenuItem, Category } from '@/types';

export const menuService = {
  async getCategories(restaurantId: string) {
    const response = await api.get(`/api/menu/categories/restaurant/${restaurantId}`);
    return response.data.data as Category[];
  },

  async getMenuItems(restaurantId: string, params?: {
    categoryId?: string;
    search?: string;
    vegetarian?: boolean;
    vegan?: boolean;
    featured?: boolean;
  }) {
    const response = await api.get(`/api/menu/items/restaurant/${restaurantId}`, { params });
    return response.data.data as MenuItem[];
  },

  async getMenuItem(id: string) {
    const response = await api.get(`/api/menu/items/${id}`);
    return response.data.data as MenuItem;
  },
};
