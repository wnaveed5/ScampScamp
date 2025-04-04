import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from "@/components/ui/drawer";
import { ScampLogoNew } from '@/components/Header';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    { label: 'Shop', path: '/products' },
    { label: 'Collections', path: '/' },
    { label: 'About', path: '/' },
    { label: 'Cart', path: '/' },
  ];

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-screen max-h-screen [&>button]:hidden" ref={menuRef}>
        <DrawerHeader className="flex justify-between items-center border-b pb-4 pl-0">
          <Link to="/" onClick={onClose} className="-ml-10 md:ml-0">
            <ScampLogoNew
              height="120"
              width="240"
              className="transform scale-y-95"
              style={{ color: 'black' }}
            />
          </Link>
          <DrawerClose onClick={onClose} className="pr-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6L18 18" />
            </svg>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="py-8 px-4">
          <nav>
            <ul className="space-y-6">
              {menuItems.map((item) => (
                <li key={item.label} className="text-center">
                  <Link 
                    to={item.path} 
                    className="text-2xl font-medium uppercase tracking-wider hover:text-gray-600 transition-colors"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerMenu;
