import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProducts } from "@/lib/api";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useShopify } from "../hooks/useShopify";
import { useShopifyCart } from "../context/ShopifyCart";
import { toast } from "sonner";

const ProductListingPage = () => {
  const shop = useShopify();
  const { addToCart, setIsCartOpen } = useShopifyCart();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(shop.storeDomain, shop.storefrontToken),
  });

  if (error) {
    console.error("Error loading products:", error);
  }

  const handleAddToCart = (product: any) => {
    // Format the ID for Shopify Storefront API
    const variantId = product.id.includes('gid://') 
      ? product.id 
      : `gid://shopify/ProductVariant/${product.id}`;
    
    addToCart({
      variantId: variantId,
      merchandiseId: variantId,
      title: product.title,
      price: parseFloat(product.price),
      quantity: 1,
      image: product.image
    });

    // Show toast notification
    toast.success("Added to Cart", {
      description: (
        <div className="flex items-center gap-4">
          {product.image && (
            <img 
              src={product.image} 
              alt={product.title}
              className="w-16 h-16 object-cover rounded-md"
            />
          )}
          <div>
            <p className="font-medium">{product.title}</p>
            <p className="text-sm text-gray-500">${product.price}</p>
          </div>
        </div>
      ),
      duration: 3000,
      position: "top-center",
      action: {
        label: "View Cart",
        onClick: () => setIsCartOpen(true)
      }
    });
  };

  const handleBuyNow = (product: any) => {
    // Format the ID for Shopify Storefront API
    const variantId = product.id.includes('gid://') 
      ? product.id 
      : `gid://shopify/ProductVariant/${product.id}`;
    
    addToCart({
      variantId: variantId,
      merchandiseId: variantId,
      title: product.title,
      price: parseFloat(product.price),
      quantity: 1,
      image: product.image
    });
    
    // Open the cart drawer
    setIsCartOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square relative">
                <Skeleton className="absolute inset-0" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 mb-2" />
              </CardContent>
              <CardFooter className="flex gap-2">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative bg-gray-100">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="object-cover object-center absolute inset-0 w-full h-full"
                  />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <CardTitle className="line-clamp-2 text-lg">{product.title}</CardTitle>
                    <p className="text-lg font-medium">${parseFloat(product.price).toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 px-3 bg-transparent hover:bg-gray-100"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                    <Button 
                      size="sm"
                      className="h-8 px-3 bg-black text-white hover:bg-gray-800"
                      onClick={() => handleBuyNow(product)}
                    >
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
