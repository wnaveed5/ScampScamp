import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ScampLogo } from "./ScampLogo";
import DrawerMenu from './DrawerMenu';
import CartDrawer from './CartDrawer';
import { useCart } from '../context/CartContext';
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, ShoppingBag } from 'lucide-react';
import './Header.css';
// import scampLogoSvg from '../scamp-logo.svg';

// New SVG logo component
const ScampLogoNew: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
  // Track both scroll position and user-initiated scrolling
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const isMobile = useIsMobile();
  const { totalItems, setIsCartOpen, isCartOpen } = useCart();

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      // Set that user has scrolled
      setHasUserScrolled(true);
      
      const scrollPosition = window.scrollY;
      const newIsScrolled = scrollPosition > 50;
      setIsScrolled(newIsScrolled);
    };

    // Listen for scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysBlack]);

  // Prevent body scrolling when menu or cart is open
  useEffect(() => {
    if (isMenuOpen || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = ""; // Cleanup on unmount
    };
  }, [isMenuOpen, isCartOpen]);

  // Force header styling when alwaysBlack changes
  useEffect(() => {
    if (alwaysBlack) {
      setIsScrolled(true);
    }
  }, [alwaysBlack]);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleCartClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen(true);
  }, [setIsCartOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-16 py-4 md:py-6 transition-all duration-300 ${
          alwaysBlack
            ? "bg-black" 
            : isScrolled
            ? "header--scrolled"
            : "bg-transparent"
        }`}
        style={{
          backgroundColor: alwaysBlack ? 'black' : (isScrolled ? 'white' : 'transparent'),
          boxShadow: alwaysBlack ? 'none' : (isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none')
        }}
      >
        <div className="flex justify-between items-center">
          {/* Menu Button (Left) */}
          <div className="menu-button-container">
            <button
              className={`burger mobile-nav-toggle flex flex-col justify-center items-center w-10 h-10 ${
                alwaysBlack ? 'text-white' : (isScrolled ? 'text-black' : 'text-white')
              }`}
              onClick={handleMenuToggle}
              title="Open Navigation"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Centered Logo */}
          <div className="flex justify-center items-center h-20 md:h-24">
            <Link
              to="/"
              aria-label="Home"
              className={`logo-link flex items-center h-full ${
                alwaysBlack ? 'text-white' : (isScrolled ? 'text-black' : 'text-white')
              }`}
            >
              {alwaysBlack ? (
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

          {/* Cart Button (Right) */}
          <div className="flex items-center">
            <button
              onClick={handleCartClick}
              className={`relative p-2 ${
                alwaysBlack ? 'text-white' : (isScrolled ? 'text-black' : 'text-white')
              }`}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <div className="cart-count-bubble">
                  {totalItems}
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Menu Component */}
      <DrawerMenu isOpen={isMenuOpen} onClose={handleCloseMenu} />
      
      {/* Cart Drawer Component */}
      <CartDrawer />
    </>
  );
};

export default Header;