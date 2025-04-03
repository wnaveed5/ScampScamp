import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useShopify } from "../hooks/useShopify";
import { fetchProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { useIsMobile } from "@/hooks/use-mobile";
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const Homepage = () => {
  const shop = useShopify();
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(3);
  const swiperRef = useRef<any>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const productsSectionRef = useRef<HTMLDivElement>(null);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(shop.storeDomain, shop.storefrontToken),
  });
  
  const isMobile = useIsMobile();

  const heroSlides = isMobile ? [
    { type: 'video', src: 'https://cdn.shopify.com/videos/c/o/v/7ce6a0a174264d11954f01ea3bab82d8.mp4' },
    { type: 'image', src: 'https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_pink_phone.png?v=1743282576' },
    { type: 'image', src: 'https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_blue_phone.jpg?v=1743282582' }
  ] : [
    { type: 'video', src: 'https://cdn.shopify.com/videos/c/o/v/d171bd97a07040888e99f84f4cf6f5c0.mp4' },
    { type: 'image', src: 'https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_pink_deskto.png?v=1743282580' },
    { type: 'image', src: 'https://cdn.shopify.com/s/files/1/0743/9312/4887/files/blue_desktop_scamp.jpg?v=1743282583' }
  ];

  useEffect(() => {
    setTotalSlides(heroSlides.length);
  }, [heroSlides]);

  // Check if on last slide and update navigation button
  useEffect(() => {
    if (activeIndex === totalSlides - 1) {
      if (navigationNextRef.current) {
        navigationNextRef.current.classList.add('final-slide-next');
      }
    } else {
      if (navigationNextRef.current) {
        navigationNextRef.current.classList.remove('final-slide-next');
      }
    }
  }, [activeIndex, totalSlides]);

  const handleVideoEnd = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  useEffect(() => {
    const currentSlide = heroSlides[activeIndex];
    let intervalId: ReturnType<typeof setInterval>;
    let slideDuration = 5; // Default duration for image slides
    
    if (currentSlide.type === 'video' && videoRefs.current[activeIndex]) {
      const videoElement = videoRefs.current[activeIndex];
      
      if (videoElement.readyState >= 2) {
        slideDuration = videoElement.duration;
        videoElement.play().catch(err => console.log('Video play error:', err));
        
        if (swiperRef.current && swiperRef.current.swiper) {
          swiperRef.current.swiper.autoplay.stop();
        }
      }
    } else {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.autoplay.start();
      }
    }
    
    return () => clearInterval(intervalId);
  }, [activeIndex, heroSlides]);

  // Control scrolling based on the showGrid state
  useEffect(() => {
    if (!showGrid) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      // Scroll to the products section when showGrid becomes true
      if (productsSectionRef.current) {
        setTimeout(() => {
          productsSectionRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 50);
      }
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showGrid]);

  const handleShowGrid = () => {
    setShowGrid(true);
  };

  const handleNextClick = () => {
    if (activeIndex === totalSlides - 1) {
      handleShowGrid();
    } else if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!showGrid) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!showGrid) {
      setTouchEnd(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    if (!showGrid && touchStart - touchEnd > 100) {
      handleShowGrid();
    }
  };

  return (
    <div className="bg-black text-white">
      <Header />

      <section 
        className="relative h-screen"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Swiper
          ref={swiperRef}
          modules={[Autoplay, EffectFade, Navigation]}
          effect="fade"
          speed={1000}
          loop={false}
          allowTouchMove={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          onBeforeInit={(swiper) => {
            // @ts-ignore - Swiper types are not completely accurate
            swiper.params.navigation.prevEl = navigationPrevRef.current;
            // @ts-ignore - Swiper types are not completely accurate
            swiper.params.navigation.nextEl = navigationNextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          className="h-full w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index} className="h-full">
              {slide.type === 'video' ? (
                <video
                  ref={el => {
                    if (el) videoRefs.current[index] = el;
                  }}
                  muted
                  playsInline
                  className="absolute inset-0 object-cover h-full w-full"
                  onEnded={handleVideoEnd}
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
            </SwiperSlide>
          ))}
          
          <div className="absolute bottom-8 left-0 right-0 z-10 flex items-center justify-center gap-6">
            <button 
              ref={navigationPrevRef}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              ref={navigationNextRef}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors group"
              onClick={handleNextClick}
            >
              <ChevronRight size={24} className="chevron-right transition-transform duration-300" />
            </button>
          </div>
        </Swiper>
      </section>

      <div ref={productsSectionRef} id="products-section" className="bg-black min-h-screen">
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
      </div>
    </div>
  );
};

export default Homepage;
