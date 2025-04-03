import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShopifyProvider } from "./components/ShopifyProvider";
import { CartProvider } from "./context/CartContext";
import Homepage from "./pages/Homepage";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ShopifyProvider 
        storeDomain={"aji4t0-cb.myshopify.com"}
        storefrontAccessToken={"e01d5c460eac1f4f6257b8b621710c83"}
        storefrontApiVersion="2025-01"
      >
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/products" element={<Index />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ShopifyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
