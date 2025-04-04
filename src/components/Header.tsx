import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ScampLogo } from "./ScampLogo";
import DrawerMenu from './DrawerMenu';
import CartDrawer from './CartDrawer';
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, ShoppingBag } from 'lucide-react';
import { useShopifyCart } from "../context/ShopifyCart";
import './Header.css';
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
// import scampLogoSvg from '../scamp-logo.svg';

// New SVG logo component
export const ScampLogoNew: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    version="1.0" 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300 388"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <g transform="translate(0.000000,388.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
      <path d="M1071 2316 c85 -15 127 -32 143 -58 26 -43 -34 -76 -319 -176 -297
      -105 -361 -136 -390 -191 -14 -28 -13 -31 10 -59 67 -79 357 -148 745 -176
      l75 -6 -110 23 c-61 13 -133 34 -160 47 -42 21 -50 30 -53 56 -2 25 3 37 24
      53 31 24 112 50 163 52 20 1 -11 5 -69 10 -126 9 -249 33 -268 53 -8 8 -12 22
      -9 30 8 20 51 21 107 1 225 -79 937 -92 1368 -24 40 7 71 13 69 16 -2 2 -82
      -4 -178 -13 -297 -28 -704 -9 -873 40 -137 40 -158 139 -43 198 125 64 444
      105 726 95 84 -3 152 -4 150 -2 -3 2 -65 11 -139 20 -183 23 -1093 33 -969 11z"/>
      <path d="M2428 1973 c6 -2 18 -2 25 0 6 3 1 5 -13 5 -14 0 -19 -2 -12 -5z"/>
      <path d="M1368 1643 c6 -2 18 -2 25 0 6 3 1 5 -13 5 -14 0 -19 -2 -12 -5z"/>
    </g>
  </svg>
);

interface HeaderProps {
  alwaysBlack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ alwaysBlack = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  
  const { totalItems, isCartOpen, setIsCartOpen } = useShopifyCart();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Only set isScrolled to true if we've scrolled more than 50px
      const newIsScrolled = scrollPosition > 50;
      console.log('Header Scroll:', {
        scrollPosition,
        currentIsScrolled: isScrolled,
        newIsScrolled,
        alwaysBlack
      });
      setIsScrolled(newIsScrolled);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Control body scroll - only when menu or cart is open
  useEffect(() => {
    console.log('Header Menu/Cart Effect:', {
      isMenuOpen,
      isCartOpen,
      currentOverflow: document.body.style.overflow
    });

    if (isMenuOpen || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      console.log('Header Cleanup: Setting overflow to auto');
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen, isCartOpen]);

  // Determine if we should show the black header
  const shouldShowBlack = alwaysBlack || isScrolled;

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleCartClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen(true);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-16 py-4 md:py-6 transition-all duration-300 ${
          shouldShowBlack ? "bg-black" : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center">
          {/* Menu Button */}
          <div className="menu-button-container">
            <button
              className="burger mobile-nav-toggle flex flex-col justify-center items-center w-10 h-10 text-white"
              onClick={handleMenuToggle}
              title="Open Navigation"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex justify-center items-center h-20 md:h-24">
            <Link
              to="/"
              aria-label="Home"
              className="logo-link flex items-center h-full text-white"
            >
              {shouldShowBlack ? (
                <ScampLogoNew
                  height="60"
                  width="120"
                  className="md:h-24 md:w-auto transition-all duration-300"
                  style={{ color: 'white' }}
                />
              ) : (
                <ScampLogo
                  className={`h-14 md:h-20 transition-all duration-300 ${isScrolled ? 'scale-90' : ''}`}
                />
              )}
            </Link>
          </div>

          {/* Cart Button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <DrawerMenu isOpen={isMenuOpen} onClose={handleCloseMenu} />
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </>
  );
};

export default Header;