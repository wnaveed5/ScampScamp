
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useShopify } from "../hooks/useShopify";
import { fetchProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";

const Homepage = () => {
  const shop = useShopify();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(shop.storeDomain, shop.storefrontToken),
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" />
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://placehold.co/1920x1080/222222/ffffff?text=FEATURED+COLLECTION')" 
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
          <h1 className="text-4xl md:text-7xl font-bold mb-6">SUMMER COLLECTION</h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl">Discover our new line of exclusive designs, crafted with premium materials and attention to detail.</p>
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="w-fit border-white text-white hover:bg-white hover:text-black transition-colors"
          >
            <Link to="/product/1">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-6 md:px-16 bg-black">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-medium">Featured Products</h2>
          <Button 
            asChild 
            variant="link" 
            className="text-white"
          >
            <Link to="/" className="flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="relative">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[3/4] relative">
                  <Skeleton className="absolute inset-0" />
                </div>
              ))}
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent>
                {products?.slice(0, 6).map((product) => (
                  <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3">
                    <Link to={`/product/${product.id}`} className="block group">
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
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-black/50 border-white text-white" />
              <CarouselNext className="right-4 bg-black/50 border-white text-white" />
            </Carousel>
          )}
        </div>
      </section>

      {/* Content Blocks */}
      <section className="py-16 px-6 md:px-16 bg-black">
        <Separator className="bg-gray-800 mb-16" />
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div 
            className="aspect-square relative bg-gray-900"
            style={{ 
              backgroundImage: "url('https://placehold.co/800x800/333333/ffffff?text=LOOKBOOK')",
              backgroundSize: "cover",
              backgroundPosition: "center" 
            }}
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">SUMMER LOOKBOOK</h2>
            <p className="text-gray-400 mb-8">Explore our curated collection showcasing the versatility and style of our newest designs. Shot on location in Joshua Tree.</p>
            <Button 
              asChild 
              variant="outline" 
              className="w-fit border-white text-white hover:bg-white hover:text-black transition-colors"
            >
              <Link to="/">
                View Lookbook <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center order-2 md:order-1">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">OUR STORY</h2>
            <p className="text-gray-400 mb-8">Founded with a passion for quality and design, our brand represents a commitment to craftsmanship and sustainable practices.</p>
            <Button 
              asChild 
              variant="outline" 
              className="w-fit border-white text-white hover:bg-white hover:text-black transition-colors"
            >
              <Link to="/">
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div 
            className="aspect-square relative bg-gray-900 order-1 md:order-2"
            style={{ 
              backgroundImage: "url('https://placehold.co/800x800/333333/ffffff?text=OUR+STORY')",
              backgroundSize: "cover",
              backgroundPosition: "center" 
            }}
          />
        </div>
      </section>

      {/* Newsletter */}
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

      {/* Footer */}
      <footer className="py-12 px-6 md:px-16 bg-black">
        <Separator className="bg-gray-800 mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-medium mb-4">SHOP</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Bestsellers</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Collections</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Sale</Link></li>
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
    </div>
  );
};

export default Homepage;
