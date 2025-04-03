import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useShopify } from "../hooks/useShopify";
import { fetchProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";

const ProductsPage = () => {
  const shop = useShopify();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(shop.storeDomain, shop.storefrontToken),
  });

  // Ensure scrolling is enabled after transition animation completes
  useEffect(() => {
    // Pre-load any important assets or data
    
    // Enable scrolling only after animation completes
    const timer = setTimeout(() => {
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';
    }, 700); // Match the transition duration
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="bg-black">
        <section className="pt-32 pb-16 px-6 md:px-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-medium">Featured Products</h2>
            <Button 
              asChild 
              variant="link" 
              className="text-white"
            >
              <Link to="/products" className="flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="relative" id="products-grid">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] relative">
                    <Skeleton className="absolute inset-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products?.slice(0, 6).map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/product/${product.id}`} 
                    className="block group"
                  >
                    <div className="aspect-[3/4] relative mb-4 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-lg font-medium mb-1">{product.title}</h3>
                    <p className="text-gray-400">${product.price}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 px-6 md:px-16 bg-gray-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">JOIN OUR NEWSLETTER</h2>
            <p className="text-gray-400 mb-8">Stay updated on new releases, exclusive content, and special promotions.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 bg-transparent border border-white text-white"
              />
              <Button className="bg-white text-black hover:bg-gray-200">
                Subscribe
              </Button>
            </div>
          </div>
        </section>

        <footer className="py-12 px-6 md:px-16 bg-black">
          <Separator className="bg-gray-800 mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium mb-4">SHOP</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/products" className="hover:text-white transition-colors">New Arrivals</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Bestsellers</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Collections</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Sale</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">HELP</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Shipping</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Returns</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">ABOUT</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Sustainability</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">FOLLOW</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} SCAMP. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ProductsPage; 