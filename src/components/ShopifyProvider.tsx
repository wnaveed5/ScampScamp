
import React from "react";
import { ShopifyProvider as HydrogenProvider } from "@shopify/hydrogen-react";

interface ShopifyProviderProps {
  children: React.ReactNode;
  storeDomain: string;
  storefrontAccessToken: string;
  storefrontApiVersion?: string;
}

export function ShopifyProvider({ 
  children, 
  storeDomain = "your-store.myshopify.com",
  storefrontAccessToken = "your-storefront-access-token",
  storefrontApiVersion = "2023-07"
}: ShopifyProviderProps) {
  return (
    <HydrogenProvider
      storeDomain={`https://${storeDomain}`}
      storefrontToken={storefrontAccessToken}
      storefrontApiVersion={storefrontApiVersion}
      countryIsoCode="US"
      languageIsoCode="EN"
    >
      {children}
    </HydrogenProvider>
  );
}
