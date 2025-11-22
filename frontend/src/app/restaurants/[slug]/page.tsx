'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { restaurantService } from '@/services/restaurant.service';
import { menuService } from '@/services/menu.service';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart.store';
import { MenuItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Star, Clock, Phone, Mail, MapPin, Plus, Leaf, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RestaurantPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const { data: restaurant, isLoading: loadingRestaurant } = useQuery({
    queryKey: ['restaurant', slug],
    queryFn: () => restaurantService.getBySlug(slug),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories', restaurant?.id],
    queryFn: () => menuService.getCategories(restaurant!.id),
    enabled: !!restaurant?.id,
  });

  const { data: menuItems } = useQuery({
    queryKey: ['menu-items', restaurant?.id, selectedCategory],
    queryFn: () =>
      menuService.getMenuItems(restaurant!.id, {
        categoryId: selectedCategory || undefined,
      }),
    enabled: !!restaurant?.id,
  });

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.discountPrice || item.price,
      quantity: 1,
      image: item.images[0],
      restaurantId: restaurant!.id,
      restaurantName: restaurant!.name,
    });
    toast.success(`${item.name} added to cart!`);
  };

  if (loadingRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200" />
          <div className="container mx-auto px-4 py-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Restaurant Header */}
      <div className="relative h-64 bg-gradient-to-br from-green-600 to-green-800">
        {restaurant.coverImage && (
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-semibold">{restaurant.averageRating.toFixed(1)}</span>
                <span className="ml-1 text-sm">({restaurant.totalReviews} reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {restaurant.cuisineType.map((cuisine) => (
                  <Badge key={cuisine} variant="secondary">
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Restaurant Info */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Restaurant Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">{restaurant.address}</p>
                    <p className="text-gray-600">
                      {restaurant.city}, {restaurant.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">{restaurant.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">{restaurant.email}</p>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="text-gray-600">
                    Min Order: <span className="font-semibold text-gray-900">
                      {formatCurrency(restaurant.minOrderAmount)}
                    </span>
                  </p>
                  <p className="text-gray-600 mt-1">
                    Delivery Fee: <span className="font-semibold text-gray-900">
                      {formatCurrency(restaurant.deliveryFee)}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Category Filter */}
            {categories && categories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-md transition ${
                      !selectedCategory
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    All Items
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition ${
                        selectedCategory === category.id
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content - Menu Items */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">Our Menu</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {menuItems?.map((item: MenuItem) => (
                <Card key={item.id} className="hover:shadow-lg transition">
                  <div className="grid grid-cols-3 gap-4 p-4">
                    <div className="col-span-2">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.isVegetarian && (
                          <Badge variant="secondary" className="text-xs">
                            <Leaf className="w-3 h-3 mr-1" />
                            Veg
                          </Badge>
                        )}
                        {item.spiceLevel > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Flame className="w-3 h-3 mr-1" />
                            Spicy {item.spiceLevel}
                          </Badge>
                        )}
                        {item.prepTime && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.prepTime}m
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          {item.discountPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-green-600">
                                {formatCurrency(item.discountPrice)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(item.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-gray-900">
                              {formatCurrency(item.price)}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.isAvailable}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <div className="col-span-1">
                      {item.images[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-24 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-md" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {(!menuItems || menuItems.length === 0) && (
              <div className="text-center py-12">
                <p className="text-gray-600">No items found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
