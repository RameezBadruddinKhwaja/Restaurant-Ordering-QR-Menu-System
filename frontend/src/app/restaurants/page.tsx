'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurant.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { Search, Star, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function RestaurantsPage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['restaurants', { search, city }],
    queryFn: () => restaurantService.getAll({ search, city }),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Restaurants
          </h1>
          <p className="text-gray-600">
            Browse through our collection of amazing restaurants
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Filter by city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Restaurant Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.restaurants?.map((restaurant: any) => (
              <Link key={restaurant.id} href={`/restaurants/${restaurant.slug}`}>
                <Card className="hover:shadow-lg transition cursor-pointer h-full">
                  <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600">
                    {restaurant.coverImage && (
                      <img
                        src={restaurant.coverImage}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white text-gray-900">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {restaurant.averageRating.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{restaurant.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {restaurant.description || 'Delicious food awaits you'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {restaurant.cuisineType.slice(0, 3).map((cuisine: string) => (
                        <Badge key={cuisine} variant="secondary" className="text-xs">
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {restaurant.city}
                      </span>
                      <span className="text-gray-600">
                        Min: {formatCurrency(restaurant.minOrderAmount)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && (!data?.restaurants || data.restaurants.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No restaurants found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
