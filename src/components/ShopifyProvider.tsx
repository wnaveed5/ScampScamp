
import React from "react";
import { ShopifyProvider as HydrogenProvider } from "@shopify/hydrogen-react";

interface ShopifyProviderProps {
  children: React.ReactNode;
  storeDomain: string;
  storefrontAccessToken: string;
}

export function ShopifyProvider({ 
  children, 
  storeDomain = "your-store.myshopify.com",
  storefrontAccessToken = "your-storefront-access-token" 
}: ShopifyProviderProps) {
  return (
    <HydrogenProvider
      storeDomain={`https://${storeDomain}`}
      storefrontToken={storefrontAccessToken}
      storefrontApiVersion="2023-07" // Update this to the latest version
    >
      {children}
    </HydrogenProvider>
  );
}
