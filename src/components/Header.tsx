
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ScampLogo } from "./ScampLogo";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-16 py-4 md:py-6 flex justify-between items-center">
      {isMobile ? (
        <>
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="text-white hover:text-gray-400 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex justify-center">
            <Link to="/" aria-label="Home">
              <ScampLogo className="h-12 transform scale-y-75" />
            </Link>
          </div>
          
          <div className="w-6">
            {/* Empty div for flex alignment */}
          </div>
          
          {/* Mobile menu overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
              <div className="flex justify-between items-center p-4">
                <Link 
                  to="/" 
                  aria-label="Home"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ScampLogo className="h-12 transform scale-y-75" />
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-white"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              
              <nav className="flex-1 flex flex-col justify-center items-center">
                <ul className="space-y-8 text-center">
                  <li>
                    <Link 
                      to="/products" 
                      className="text-white text-2xl uppercase tracking-widest"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/" 
                      className="text-white text-2xl uppercase tracking-widest"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Collections
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/" 
                      className="text-white text-2xl uppercase tracking-widest"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/" 
                      className="text-white text-2xl uppercase tracking-widest"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Cart
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      ) : (
        <>
          <nav className="w-1/3 flex justify-start">
            <ul className="flex space-x-8">
              <li>
                <Link to="/products" className="text-white hover:text-gray-400 transition-colors text-sm uppercase tracking-widest">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white hover:text-gray-400 transition-colors text-sm uppercase tracking-widest">
                  Collections
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="w-1/3 flex justify-center">
            <Link to="/" aria-label="Home">
              <ScampLogo className="h-16 md:h-20 transform scale-y-75" />
            </Link>
          </div>
          
          <div className="w-1/3 flex justify-end">
            <ul className="flex space-x-8">
              <li>
                <Link to="/" className="text-white hover:text-gray-400 transition-colors text-sm uppercase tracking-widest">
                  About
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white hover:text-gray-400 transition-colors text-sm uppercase tracking-widest">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
