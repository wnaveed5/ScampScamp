"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useShopify } from "../hooks/useShopify";
import { fetchProducts } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { useShopifyCart } from "../context/ShopifyCart";
import { toast } from "sonner";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import EarlyAccessModal from "@/components/EarlyAccessModal";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";

interface HomepageProps {
  onLock?: () => void;
}

const Homepage = ({ onLock }: HomepageProps) => {
  const shop = useShopify();
  const [showGrid, setShowGrid] = useState(false);
  const productsSectionRef = useRef<HTMLDivElement>(null);
  const { addToCart, setIsCartOpen, isCartOpen } = useShopifyCart();
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  const viewportMetaRef = useRef<HTMLMetaElement | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const isMobile = useIsMobile();

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(shop.storeDomain, shop.storefrontToken),
  });

  // Detect iOS
  useEffect(() => {
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);
  }, []);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();

    const variantId = product.id.includes("gid://") ? product.id : `gid://shopify/ProductVariant/${product.id}`;

    addToCart({
      variantId: variantId,
      merchandiseId: variantId,
      title: product.title,
      price: Number.parseFloat(product.price),
      quantity: 1,
      image: product.image,
    });

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
    });
  };

  const handleBuyNow = (product: any, e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const numericId = product.id.split("/").pop().split("?")[0];
      const checkoutUrl = `https://${shop.storeDomain}/cart/${numericId}:1`;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error redirecting to checkout:", error);
      toast.error("Unable to Checkout", {
        description: "Please try again or contact support",
        duration: 5000,
        position: "top-center",
      });
    }
  };

  const handleViewAllClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowEarlyAccessModal(true);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Refreshing products...");
  };

  const handleShopClick = () => {
    setShowGrid(true);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    viewportMetaRef.current = document.querySelector('meta[name="viewport"]');
    if (!viewportMetaRef.current) {
      viewportMetaRef.current = document.createElement("meta");
      viewportMetaRef.current.name = "viewport";
      document.head.appendChild(viewportMetaRef.current);
    }

    viewportMetaRef.current.content = "width=device-width, initial-scale=1, viewport-fit=cover";

    const style = document.createElement("style");
    style.textContent = `
      * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      body {
        overscroll-behavior: none;
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (viewportMetaRef.current) {
        viewportMetaRef.current.content = "width=device-width, initial-scale=1";
      }
      style.remove();
    };
  }, []);

  return (
    <>
      <div className="bg-black text-white">
        <Header alwaysBlack={showGrid} onLock={onLock} />

        <div className="relative overflow-hidden">
          <div 
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              showGrid 
                ? 'opacity-0 translate-y-[-100%] pointer-events-none' 
                : 'opacity-100 translate-y-0'
            }`}
          >
            <HeroSection onShopClick={handleShopClick} isIOS={isIOS} isMobile={isMobile} />
          </div>
          <div 
            className={`transition-all duration-500 ease-in-out ${
              showGrid 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-[100%] pointer-events-none'
            }`}
          >
            <ProductsSection
              products={products || []}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              onViewAll={handleViewAllClick}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>
      </div>

      <EarlyAccessModal isOpen={showEarlyAccessModal} onClose={() => setShowEarlyAccessModal(false)} />
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </>
  );
};

export default Homepage;