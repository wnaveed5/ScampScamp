
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScampLogo } from "./ScampLogo";
import DrawerMenu from './DrawerMenu';
import CartDrawer from './CartDrawer';
import { useCart } from '../context/CartContext';
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, ShoppingBag } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const { totalItems, setIsCartOpen } = useCart();
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen(true);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-16 py-4 md:py-6 transition-all duration-300 ${isScrolled ? "header--scrolled" : "bg-transparent"}`}>
        <div className="flex justify-between items-center">
          {/* Menu Button (Left) */}
          <div className="menu-button-container">
            <button
              className={`burger mobile-nav-toggle flex flex-col justify-center items-center w-10 h-10 ${isScrolled ? 'text-black' : 'text-white'}`}
              onClick={handleMenuToggle}
              title="Open Navigation"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Centered Logo */}
          <div className="flex justify-center">
            <Link to="/" aria-label="Home" className={`logo-link ${isScrolled ? 'text-black' : 'text-white'}`}>
              <ScampLogo className={`${isMobile ? 'h-16' : 'h-24 md:h-32'} transform scale-y-75 transition-all duration-300 ${isScrolled ? 'scale-90' : ''}`} />
            </Link>
          </div>

          {/* Cart Button (Right) */}
          <div className="flex items-center">
            <button 
              onClick={handleCartClick}
              className={`relative p-2 ${isScrolled ? 'text-black' : 'text-white'}`}
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
