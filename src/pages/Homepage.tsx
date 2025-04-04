"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, ChevronUp, ChevronDown, ShoppingBag, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useShopify } from "../hooks/useShopify"
import { fetchProducts } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/Header"
import CartDrawer from "@/components/CartDrawer"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectFade, Navigation } from "swiper/modules"
import { useIsMobile } from "@/hooks/use-mobile"
import { useShopifyCart } from "../context/ShopifyCart"
import { toast } from "sonner"
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
  const { addToCart, setIsCartOpen, isCartOpen } = useShopifyCart()
  const scrollLockRef = useRef(false)
  const heroSectionRef = useRef<HTMLElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(shop.storeDomain, shop.storefrontToken),
  })

  const isMobile = useIsMobile()

  const heroSlides = isMobile
    ? [
        { type: "video", src: "https://cdn.shopify.com/videos/c/o/v/7ce6a0a174264d11954f01ea3bab82d8.mp4" },
        {
          type: "image",
          src: "https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_pink_phone.png?v=1743282576",
        },
        {
          type: "image",
          src: "https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_blue_phone.jpg?v=1743282582",
        },
      ]
    : [
        { type: "video", src: "https://cdn.shopify.com/videos/c/o/v/d171bd97a07040888e99f84f4cf6f5c0.mp4" },
        {
          type: "image",
          src: "https://cdn.shopify.com/s/files/1/0743/9312/4887/files/scamp_pink_deskto.png?v=1743282580",
        },
        {
          type: "image",
          src: "https://cdn.shopify.com/s/files/1/0743/9312/4887/files/blue_desktop_scamp.jpg?v=1743282583",
        },
      ]

  // Handle slide transitions
  useEffect(() => {
    const currentSlide = heroSlides[activeIndex]

    if (currentSlide.type === "video" && videoRefs.current[activeIndex]) {
      const video = videoRefs.current[activeIndex]
      video.currentTime = 0
      video.play().catch((err) => console.error("Video play error:", err))

      const updateProgress = () => {
        setSlideProgress(video.currentTime / video.duration)
      }

      video.addEventListener("timeupdate", updateProgress)
      video.addEventListener("ended", () => {
        if (activeIndex < totalSlides - 1) {
          goToNextSlide()
        } else {
          scrollToGrid()
        }
      })

      return () => {
        video.removeEventListener("timeupdate", updateProgress)
        video.pause()
      }
    } else {
      // Image slide
      setSlideProgress(0)
      const timer = setTimeout(() => {
        if (activeIndex < totalSlides - 1) {
          goToNextSlide()
        } else {
          scrollToGrid()
        }
      }, 5000) // 5 seconds for image slides

      const progressInterval = setInterval(() => {
        setSlideProgress((prev) => Math.min(prev + 0.02, 1))
      }, 100)

      return () => {
        clearTimeout(timer)
        clearInterval(progressInterval)
      }
    }
  }, [activeIndex])

  // Initial setup
  useEffect(() => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(0, 0)
    }

    // Check if user has scrolled past hero section on load
    const checkInitialScrollPosition = () => {
      if (heroSectionRef.current) {
        const heroHeight = heroSectionRef.current.offsetHeight
        const scrollPosition = window.scrollY

        if (scrollPosition > heroHeight * 0.5) {
          setShowGrid(true)
          scrollLockRef.current = false
          document.body.style.overflow = "auto"
        } else {
          setShowGrid(false)
          scrollLockRef.current = true
          document.body.style.overflow = "hidden"
        }
      }
    }

    checkInitialScrollPosition()

    // Add wheel event listener for smooth transition
    const handleWheel = (e: WheelEvent) => {
      if (scrollLockRef.current && e.deltaY > 0) {
        e.preventDefault()
        scrollToGrid()
      }
    }

    // Add scroll listener to update state when scrolling back up
    const handleScroll = () => {
      if (heroSectionRef.current && productsSectionRef.current) {
        const heroRect = heroSectionRef.current.getBoundingClientRect()
        const productsRect = productsSectionRef.current.getBoundingClientRect()

        // If hero section is visible and products are below viewport
        if (heroRect.bottom > 0 && productsRect.top > window.innerHeight) {
          if (showGrid) {
            setShowGrid(false)
          }
        }
        // If products section is visible
        else if (productsRect.top < window.innerHeight) {
          if (!showGrid) {
            setShowGrid(true)
          }
        }
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("scroll", handleScroll)

    return () => {
      videoRefs.current.forEach((video) => video?.pause())
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("scroll", handleScroll)
      document.body.style.overflow = "auto"
    }
  }, [])

  // Update scroll lock based on showGrid state
  useEffect(() => {
    if (!showGrid) {
      scrollLockRef.current = true
      document.body.style.overflow = "hidden"
    } else {
      scrollLockRef.current = false
      document.body.style.overflow = "auto"
    }
  }, [showGrid])

  const scrollToGrid = useCallback(() => {
    if (productsSectionRef.current) {
      setShowGrid(true)
      scrollLockRef.current = false
      document.body.style.overflow = "auto"

      // Use smooth scroll behavior
      productsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      // Fallback for browsers that don't support smooth scrolling
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight,
          behavior: "smooth",
        })
      }, 100)
    }
  }, [])

  const goToNextSlide = () => {
    if (activeIndex < totalSlides - 1) {
      setActiveIndex((prev) => prev + 1)
      swiperRef.current?.swiper.slideTo(activeIndex + 1)
    } else {
      scrollToGrid()
    }
  }

  const goToPrevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1)
      swiperRef.current?.swiper.slideTo(activeIndex - 1)
    }
  }

  // Calculate progress with equal segments
  const calculateProgressHeight = () => {
    // Each slide represents 1/3 of the total height (33.33%)
    const segmentHeight = 100 / totalSlides
    // Calculate total progress: completed slides + current slide progress
    return (activeIndex + slideProgress) * segmentHeight
  }

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation

    // Format the ID for Shopify Storefront API
    const variantId = product.id.includes("gid://") ? product.id : `gid://shopify/ProductVariant/${product.id}`

    addToCart({
      variantId: variantId,
      merchandiseId: variantId,
      title: product.title,
      price: Number.parseFloat(product.price),
      quantity: 1,
      image: product.image,
    })

    // Show toast notification
    toast.success("Added to Cart", {
      description: (
        <div className="flex items-center gap-4">
          {product.image && (
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="w-16 h-16 object-cover rounded-md"
            />
          )}
          <div>
            <p className="font-medium">{product.title}</p>
            <p className="text-sm text-gray-500">${Number.parseFloat(product.price).toFixed(2)}</p>
          </div>
        </div>
      ),
      duration: 3000,
      position: "top-center",
      action: {
        label: "View Cart",
        onClick: () => setIsCartOpen(true),
      },
    })
  }

  const handleBuyNow = (product: any, e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation

    try {
      // Get the numeric ID from the product ID
      const numericId = product.id.split('/').pop().split('?')[0];
      
      // Create the checkout URL with the product variant ID and quantity
      const checkoutUrl = `https://${shop.storeDomain}/cart/${numericId}:1`;
      
      // Redirect to checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      toast.error("Unable to Checkout", {
        description: "Please try again or contact support",
        duration: 5000,
        position: "top-center",
      });
    }
  }

  return (
    <div className="bg-black text-white">
      <Header alwaysBlack={showGrid} />

      <section ref={heroSectionRef} className="relative h-screen">
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
                <div className="relative w-full h-full">
                <video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el
                  }}
                    muted={isMuted}
                    autoPlay
                    loop
                  playsInline
                  className="absolute inset-0 object-cover h-full w-full"
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      const video = videoRefs.current[index];
                      if (video) {
                        video.muted = !isMuted;
                      }
                    }}
                    className="absolute bottom-8 left-8 z-50 bg-white/30 hover:bg-white/40 p-2 rounded-full transition-colors backdrop-blur-sm scale-70 md:scale-90"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4 md:w-5 md:h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4 md:w-5 md:h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                      </svg>
                    )}
                  </button>
                </div>
              ) : (
                <img
                  src={slide.src || "/placeholder.svg"}
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

          {/* Scroll down indicator */}
          <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer"
            onClick={scrollToGrid}
          >
            <span className="text-white/80 text-sm mb-2">Shop</span>
            <ChevronDown className="animate-bounce text-white/80" />
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
            {isLoading
              ? [...Array(3)].map((_, i) => <Skeleton key={i} className="aspect-[3/4] w-full" />)
              : products?.slice(0, 6).map((product) => (
                  <div key={product.id} className="group relative">
                  <div className="aspect-[3/4] relative mb-4 overflow-hidden">
                      <Link to={`/product/${product.id}`} className="block">
                    <img
                          src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                      </Link>
                    </div>
                    <div className="flex items-center justify-between">
                      <Link to={`/product/${product.id}`} className="block flex-1 mr-4">
                        <h3 className="text-xl font-medium">{product.title}</h3>
                        <p className="text-gray-400">${Number.parseFloat(product.price).toFixed(2)}</p>
                      </Link>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 bg-transparent border-white text-white hover:bg-white hover:text-black"
                          onClick={(e) => handleAddToCart(product, e)}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 px-3 bg-white text-black hover:bg-gray-200"
                          onClick={(e) => handleBuyNow(product, e)}
                        >
                          <ShoppingBag className="h-3 w-3 mr-1" />
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
              ))}
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

      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </div>
  )
}

export default Homepage

