"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, ChevronUp, ChevronDown, ShoppingBag, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useShopify } from "../hooks/useShopify"
import { fetchProducts } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/Header"
import CartDrawer from "@/components/CartDrawer"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectFade, Navigation } from "swiper/modules"
import { useIsMobile } from "@/hooks/use-mobile"
import { useCart } from "@shopify/hydrogen-react"
import "swiper/css"
import "swiper/css/effect-fade"
import "swiper/css/navigation"

const Homepage = () => {
  const shop = useShopify()
  const videoRefs = useRef<HTMLVideoElement[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [totalSlides] = useState(3)
  const [slideProgress, setSlideProgress] = useState(0)
  const swiperRef = useRef<any>(null)
  const [showGrid, setShowGrid] = useState(false)
  const productsSectionRef = useRef<HTMLDivElement>(null)
  const navigationPrevRef = useRef<HTMLButtonElement>(null)
  const navigationNextRef = useRef<HTMLButtonElement>(null)
  const { linesAdd } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(shop.storeDomain, shop.storefrontToken),
  })

  const isMobile = useIsMobile()

  const heroSlides = isMobile
    ? [
        { type: "video", src: "https://cdn.shopify.com/videos/c/o/v/7ce6a0a174264d11954f01ea3bab82d8.mp4" },
        { type: "image", src: "https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_pink_phone.png?v=1743282576" },
        { type: "image", src: "https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_blue_phone.jpg?v=1743282582" },
      ]
    : [
        { type: "video", src: "https://cdn.shopify.com/videos/c/o/v/d171bd97a07040888e99f84f4cf6f5c0.mp4" },
        { type: "image", src: "https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_pink_deskto.png?v=1743282580" },
        { type: "image", src: "https://cdn.shopify.com/s/files/1/0743/9312/4887/files/blue_desktop_scamp.jpg?v=1743282583" },
      ]

  // Handle slide transitions
  useEffect(() => {
    const currentSlide = heroSlides[activeIndex]
    
    if (currentSlide.type === "video" && videoRefs.current[activeIndex]) {
      const video = videoRefs.current[activeIndex]
      video.currentTime = 0
      video.play().catch(err => console.error("Video play error:", err))
      
      const updateProgress = () => {
        setSlideProgress(video.currentTime / video.duration)
      }
      
      video.addEventListener('timeupdate', updateProgress)
      video.addEventListener('ended', () => {
        if (activeIndex < totalSlides - 1) {
          goToNextSlide()
        } else {
          setShowGrid(true)
        }
      })
      
      return () => {
        video.removeEventListener('timeupdate', updateProgress)
        video.pause()
      }
    } else {
      // Image slide
      setSlideProgress(0)
      const timer = setTimeout(() => {
        if (activeIndex < totalSlides - 1) {
          goToNextSlide()
        } else {
          setShowGrid(true)
        }
      }, 5000) // 5 seconds for image slides
      
      const progressInterval = setInterval(() => {
        setSlideProgress(prev => Math.min(prev + 0.02, 1))
      }, 100)
      
      return () => {
        clearTimeout(timer)
        clearInterval(progressInterval)
      }
    }
  }, [activeIndex])

  // Control scrolling
  useEffect(() => {
    document.body.style.overflow = showGrid ? "auto" : "hidden"
    if (showGrid && productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: "smooth" })
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [showGrid])

  const goToNextSlide = () => {
    if (activeIndex < totalSlides - 1) {
      setActiveIndex(prev => prev + 1)
      swiperRef.current?.swiper.slideTo(activeIndex + 1)
    } else {
      setShowGrid(true)
    }
  }

  const goToPrevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1)
      swiperRef.current?.swiper.slideTo(activeIndex - 1)
    }
  }

  // Initial setup
  useEffect(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(0, 0)
    }
    return () => {
      videoRefs.current.forEach(video => video?.pause())
    }
  }, [])

  // Calculate progress with equal segments
  const calculateProgressHeight = () => {
    // Each slide represents 1/3 of the total height (33.33%)
    const segmentHeight = 100 / totalSlides
    // Calculate total progress: completed slides + current slide progress
    return (activeIndex + slideProgress) * segmentHeight
  }

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    linesAdd([
      {
        merchandiseId: product.id,
        quantity: 1
      }
    ]);
  };

  const handleBuyNow = (product: any, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    linesAdd([
      {
        merchandiseId: product.id,
        quantity: 1
      }
    ]);
    // Open the cart drawer
    setIsCartOpen(true);
  };

  return (
    <div className="bg-black text-white">
      <Header alwaysBlack={showGrid} />

      <section className="relative h-screen">
        <Swiper
          ref={swiperRef}
          modules={[EffectFade, Navigation]}
          effect="fade"
          speed={500}
          fadeEffect={{ crossFade: true }}
          initialSlide={0}
          loop={false}
          slidesPerView={1}
          allowTouchMove={false}
          navigation={false}
          className="h-full w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index} className="h-full">
              {slide.type === "video" ? (
                <video
                  ref={el => { if (el) videoRefs.current[index] = el }}
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 object-cover h-full w-full"
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={slide.src}
                  alt={`Slide ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </SwiperSlide>
          ))}

          <div className="absolute bottom-8 right-8 z-10 flex items-center justify-center">
            <div className="flex flex-col items-center py-2 px-1.5 rounded-full bg-white/30 backdrop-blur-sm scale-70 md:scale-90">
              <button
                ref={navigationPrevRef}
                className="w-6 h-6 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white/90 hover:text-white"
                onClick={goToPrevSlide}
                disabled={activeIndex === 0}
              >
                <ChevronUp size={18} className="md:w-[22px] md:h-[22px]" />
              </button>

              <div className="h-32 md:h-40 w-1.5 md:w-2 bg-white/10 my-2 md:my-3 relative rounded-full">
                <div
                  className="absolute top-0 w-full bg-red-500 transition-all duration-100 rounded-full shadow-glow"
                  style={{ height: `${calculateProgressHeight()}%` }}
                />
              </div>

              <button
                ref={navigationNextRef}
                className="w-6 h-6 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white/90 hover:text-white"
                onClick={goToNextSlide}
              >
                <ChevronDown size={18} className="md:w-[22px] md:h-[22px]" />
              </button>
            </div>
          </div>
        </Swiper>
      </section>

      <div ref={productsSectionRef} className="bg-black min-h-screen">
        <section className="pt-32 pb-16 px-6 md:px-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-medium">Featured Products</h2>
            <Button asChild variant="link" className="text-white">
              <Link to="/products" className="flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full" />
              ))
            ) : (
              products?.slice(0, 6).map((product) => (
                <div key={product.id} className="group relative">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="aspect-[3/4] relative mb-4 overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-lg font-medium mb-1">{product.title}</h3>
                    <p className="text-gray-400">${product.price}</p>
                  </Link>
                  
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 bg-transparent border-white text-white hover:bg-white hover:text-black"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button 
                      size="sm"
                      className="flex-1 bg-white text-black hover:bg-gray-200"
                      onClick={(e) => handleBuyNow(product, e)}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </div>
  )
}

export default Homepage