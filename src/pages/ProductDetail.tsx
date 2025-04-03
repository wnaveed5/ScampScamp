
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProductById } from "@/lib/api";
import { ArrowLeft, ShoppingBag, ShoppingCart } from "lucide-react";
import { useShopify } from "../hooks/useShopify";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const shop = useShopify();
  const { addToCart, setIsCartOpen } = useCart();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId, shop.storeDomain, shop.storefrontToken),
    enabled: !!productId,
  });

  if (error) {
    console.error("Error loading product:", error);
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: parseFloat(product.price),
        image: product.image || "",
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: parseFloat(product.price),
        image: product.image || "",
      });
      setIsCartOpen(true);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="aspect-square w-full" />
          </div>
          <div>
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-8" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 aspect-square relative">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="object-contain absolute inset-0 w-full h-full"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-2xl font-medium mb-6">${product.price}</p>
            <div className="prose mb-6">
              <p>{product.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button 
                className="flex-1"
                onClick={handleBuyNow}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl">Product not found</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
