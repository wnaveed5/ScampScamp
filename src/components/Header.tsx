
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScampLogo } from "./ScampLogo";
import DrawerMenu from './DrawerMenu';
import { useIsMobile } from "@/hooks/use-mobile";
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  
  // Since we don't have the full ShopContext implementation, we'll mock cartCount
  const cartCount = 0;
  
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
    // Since we don't have the full ShopContext implementation
    // console.log("Cart clicked");
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-16 py-4 md:py-6 transition-all duration-300 ${isScrolled ? "header--scrolled" : "bg-transparent"}`}>
        <div className="flex justify-between items-center">
          {/* Menu Button (Left) */}
          <div className="menu-button-container">
            <button
              className="burger mobile-nav-toggle flex flex-col justify-center items-center w-10 h-10"
              onClick={handleMenuToggle}
              title="Open Navigation"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <div className={`w-6 h-0.5 mb-1.5 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
              <div className={`w-6 h-0.5 mt-1.5 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </button>
          </div>

          {/* Centered Logo */}
          <div className="flex justify-center">
            <Link to="/" aria-label="Home" className="logo-link">
              <ScampLogo className={`${isMobile ? 'h-16' : 'h-24 md:h-32'} transform scale-y-75 transition-all duration-300 ${isScrolled ? 'scale-90' : ''}`} />
            </Link>
          </div>

          {/* Cart Button (Right) */}
          <div className="flex items-center">
            <Link to="/cart" className="relative p-2" onClick={handleCartClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3.86376 16.4552C3.00581 13.0234 2.57684 11.3075 3.47767 10.1538C4.3785 9 6.14721 9 9.68462 9H14.3153C17.8527 9 19.6214 9 20.5222 10.1538C21.4231 11.3075 20.9941 13.0234 20.1362 16.4552C19.5905 18.6379 19.3176 19.7292 18.5039 20.3646C17.6901 21 16.5652 21 14.3153 21H9.68462C7.43476 21 6.30983 21 5.49605 20.3646C4.68227 19.7292 4.40943 18.6379 3.86376 16.4552Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  opacity="0.5"
                  d="M19.5 9.5L18.7896 6.89465C18.5157 5.89005 18.3787 5.38775 18.0978 5.00946C17.818 4.63273 17.4378 4.34234 17.0008 4.17152C16.5619 4 16.0413 4 15 4M4.5 9.5L5.2104 6.89465C5.48432 5.89005 5.62128 5.38775 5.90221 5.00946C6.18199 4.63273 6.56216 4.34234 6.99922 4.17152C7.43808 4 7.95872 4 9 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4C15 4.55228 14.5523 5 14 5H10C9.44772 5 9 4.55228 9 4Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              {cartCount > 0 && (
                <div className="cart-count-bubble">
                  {cartCount}
                </div>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Drawer Menu Component */}
      <DrawerMenu isOpen={isMenuOpen} onClose={handleCloseMenu} />
    </>
  );
};

export default Header;
