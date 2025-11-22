'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, ChefHat } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ChefHat className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">RestaurantHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/restaurants" className="text-gray-700 hover:text-green-600 transition">
              Restaurants
            </Link>
            {isAuthenticated && user?.role === 'RESTAURANT_OWNER' && (
              <Link href="/dashboard/restaurant" className="text-gray-700 hover:text-green-600 transition">
                My Restaurant
              </Link>
            )}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link href="/dashboard/admin" className="text-gray-700 hover:text-green-600 transition">
                Admin
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
                <span className="text-sm font-medium hidden md:block">
                  {user?.firstName}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
