
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from "@/components/ui/drawer";
import { ScampLogo } from './ScampLogo';

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
      <DrawerContent className="h-screen max-h-screen" ref={menuRef}>
        <DrawerHeader className="flex justify-between items-center border-b pb-4">
          <Link to="/" onClick={onClose}>
            <ScampLogo className="h-24 transform scale-y-75" />
          </Link>
          <DrawerClose onClick={onClose}>
            <X size={24} />
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
