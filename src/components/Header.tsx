
import React from "react";
import { Link } from "react-router-dom";
import { ScampLogo } from "./ScampLogo";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-6 flex justify-between items-center">
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
          <ScampLogo className="h-6 md:h-8" />
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
    </header>
  );
};

export default Header;
