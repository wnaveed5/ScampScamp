import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProducts } from "@/lib/api";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useShopify } from "../hooks/useShopify";
import { useCartJS } from "../context/CartJS";
import { addToCart as addToCartJS } from "../utils/cartHelper";

const ProductListingPage = () => {
  const shop = useShopify();
  const cartJS = useCartJS();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(shop.storeDomain, shop.storefrontToken),
  });

  if (error) {
    console.error("Error loading products:", error);
  }

  const handleAddToCart = (product) => {
    addToCartJS(cartJS, {
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      image: product.image || "",
      variant_id: product.id
    });
  };

  const handleBuyNow = (product) => {
    addToCartJS(cartJS, {
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      image: product.image || "",
      variant_id: product.id
    });
    cartJS.setIsCartOpen(true);
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
              <CardHeader>
                <CardTitle className="line-clamp-2">{product.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">${product.price}</p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => handleBuyNow(product)}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
