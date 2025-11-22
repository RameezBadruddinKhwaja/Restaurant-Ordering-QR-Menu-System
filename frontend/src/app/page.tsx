import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QrCode, ChefHat, ShoppingCart, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Modern Restaurant Ordering Made Simple
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50">
              Scan, Order, Enjoy - Experience the future of dining with our QR menu system
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/restaurants">Browse Restaurants</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Scan QR Code</h3>
              <p className="text-gray-600">
                Simply scan the QR code on your table to instantly access the digital menu
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Place Order</h3>
              <p className="text-gray-600">
                Browse dishes, customize your order, and checkout securely with multiple payment options
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track & Enjoy</h3>
              <p className="text-gray-600">
                Get real-time updates on your order status and enjoy your meal when it's ready
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Users className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Are You a Restaurant Owner?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our platform and modernize your restaurant with QR-based ordering,
              menu management, and real-time order tracking
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/register?role=owner">Register Your Restaurant</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2024 Restaurant Ordering System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
