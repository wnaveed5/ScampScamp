import { useContext } from 'react';
import { ShopifyContext } from '../components/ShopifyProvider';

export function useShopify() {
  const context = useContext(ShopifyContext);
  
  if (context === undefined) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  
  return context;
}
