
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
// Import Swiper React components and required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Homepage = () => {
  const shop = useShopify();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(shop.storeDomain, shop.storefrontToken),
  });

  // Function to determine if we're on mobile
  const isMobile = () => window.innerWidth < 768;
  
  // State to track current device type
  const [mobile, setMobile] = React.useState(isMobile());

  // Update mobile state when window resizes
  useEffect(() => {
    const handleResize = () => {
      setMobile(isMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hero slider content based on device type
  const heroSlides = mobile ? [
    { type: 'video', src: 'https://cdn.shopify.com/videos/c/o/v/7ce6a0a174264d11954f01ea3bab82d8.mp4' },
    { type: 'image', src: 'https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_pink_phone.png?v=1743282576' },
    { type: 'image', src: 'https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_blue_phone.jpg?v=1743282582' }
  ] : [
    { type: 'video', src: 'https://cdn.shopify.com/videos/c/o/v/d171bd97a07040888e99f84f4cf6f5c0.mp4' },
    { type: 'image', src: 'https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_pink_deskto.png?v=1743282580' },
    { type: 'image', src: 'https://cdn.shopify.com/s/files/1/0743/9312/4887/files/blue_desktop_scamp.jpg?v=1743282583' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Hero Section with Swiper */}
      <section className="relative h-screen">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          speed={1000}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ 
            clickable: true,
            el: ".swiper-pagination",
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          className="h-full w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index} className="h-full">
              {slide.type === 'video' ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 object-cover h-full w-full"
                >
                  <source src={slide.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${slide.src}')` }}
                />
              )}
              <div className="absolute inset-0 bg-black opacity-20" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                <h1 className="text-4xl md:text-7xl font-bold mb-6">SUMMER COLLECTION</h1>
                <p className="text-lg md:text-xl mb-8 max-w-xl">Discover our new line of exclusive designs, crafted with premium materials and attention to detail.</p>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="w-fit border-white text-white hover:bg-white hover:text-black transition-colors"
                >
                  <Link to="/products">
                    Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination absolute bottom-10 z-10"></div>
          <div className="swiper-button-prev text-white"></div>
          <div className="swiper-button-next text-white"></div>
        </Swiper>
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
            <Link to="/products" className="flex items-center">
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
            <Swiper
              modules={[Navigation]}
              slidesPerView={1}
              spaceBetween={24}
              navigation={{
                nextEl: '.product-next',
                prevEl: '.product-prev',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                }
              }}
              className="product-swiper"
            >
              {products?.slice(0, 6).map((product) => (
                <SwiperSlide key={product.id}>
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
                </SwiperSlide>
              ))}
              <div className="absolute top-1/2 -left-4 z-10 product-prev flex items-center justify-center w-10 h-10 rounded-full bg-black/50 border border-white text-white cursor-pointer">
                <ArrowRight className="h-4 w-4 rotate-180" />
              </div>
              <div className="absolute top-1/2 -right-4 z-10 product-next flex items-center justify-center w-10 h-10 rounded-full bg-black/50 border border-white text-white cursor-pointer">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Swiper>
          )}
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
    </div>
  );
};

export default Homepage;
