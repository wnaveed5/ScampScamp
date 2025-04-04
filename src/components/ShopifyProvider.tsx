import React, { createContext, useContext } from "react";

interface ShopifyContextType {
  storeDomain: string;
  storefrontToken: string;
  storefrontApiVersion: string;
  countryCode: string;
  languageCode: string;
}

export const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

interface ShopifyProviderProps {
  children: React.ReactNode;
  storeDomain: string;
  storefrontAccessToken: string;
  storefrontApiVersion?: string;
  countryIsoCode?: string;
  languageIsoCode?: string;
}

export function ShopifyProvider({ 
  children, 
  storeDomain = "your-store.myshopify.com",
  storefrontAccessToken = "your-storefront-access-token",
  storefrontApiVersion = "2025-01",
  countryIsoCode = "US",
  languageIsoCode = "EN"
}: ShopifyProviderProps) {
  
  // Format domain to ensure it doesn't have https:// prefix for consistency
  const formattedDomain = storeDomain.replace(/^https?:\/\//, '');
  
  const contextValue: ShopifyContextType = {
    storeDomain: formattedDomain,
    storefrontToken: storefrontAccessToken,
    storefrontApiVersion,
    countryCode: countryIsoCode,
    languageCode: languageIsoCode
  };

  return (
    <ShopifyContext.Provider value={contextValue}>
      {children}
    </ShopifyContext.Provider>
  );
}
