import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShopifyProvider } from "./components/ShopifyProvider";
import { ShopifyCartProvider } from "./context/ShopifyCart";
import LockScreen from "./components/LockScreen";
import Homepage from "./pages/Homepage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    // Check if user is already unlocked
    const isUnlocked = localStorage.getItem("isUnlocked") === "true";
    setIsLocked(!isUnlocked);
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const handleLock = () => {
    setIsLocked(true);
    localStorage.removeItem("isUnlocked");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ShopifyProvider 
          storeDomain={"aji4t0-cb.myshopify.com"}
          storefrontAccessToken={"e01d5c460eac1f4f6257b8b621710c83"}
          storefrontApiVersion="2025-01"
        >
          <ShopifyCartProvider>
            <Toaster />
            <Sonner />
            <LockScreen isLocked={isLocked} onUnlock={handleUnlock} />
            {!isLocked && (
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Homepage onLock={handleLock} />} />
                  <Route path="/products" element={<Index onLock={handleLock} />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound onLock={handleLock} />} />
                </Routes>
              </BrowserRouter>
            )}
          </ShopifyCartProvider>
        </ShopifyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
