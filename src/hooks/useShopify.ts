
import { useContext } from "react";
import { ShopifyContext } from "@shopify/hydrogen-react";

export function useShopify() {
  const context = useContext(ShopifyContext);
  
  if (context === undefined) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  
  return context;
}
