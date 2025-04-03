"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useShopify } from "../hooks/useShopify"
import { fetchProducts } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/Header"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectFade, Navigation } from "swiper/modules"
import { useIsMobile } from "@/hooks/use-mobile"
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
                <Link key={product.id} to={`/product/${product.id}`} className="block group">
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
              ))
            )}
          </div>
        </section>

        <section className="py-20 px-6 md:px-16 bg-gray-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">JOIN OUR NEWSLETTER</h2>
            <p className="text-gray-400 mb-8">
              Stay updated on new releases, exclusive content, and special promotions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-transparent border border-white text-white"
              />
              <Button className="bg-white text-black hover:bg-gray-200">Subscribe</Button>
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
            <p>© {new Date().getFullYear()} SCAMP. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Homepage