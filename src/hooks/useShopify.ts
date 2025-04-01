
import { useShop } from "@shopify/hydrogen-react";

export function useShopify() {
  const context = useShop();
  
  if (context === undefined) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  
  return context;
}
