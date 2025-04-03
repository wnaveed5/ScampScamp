import { useCartJS } from "../context/CartJS";

// Cart Item type
export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variant_id?: string;
}

/**
 * Helper function to add an item to the cart
 * @param cartContext The cart context from useCartJS()
 * @param product The product to add to the cart
 * @param quantity The quantity to add
 */
export const addToCart = (
  cartContext: ReturnType<typeof useCartJS>,
  product: {
    id: string;
    title: string;
    price: number;
    image?: string;
    variant_id?: string;
  },
  quantity: number = 1
) => {
  const cartItem: CartItem = {
    id: product.id,
    title: product.title,
    price: product.price,
    quantity: quantity,
    image: product.image,
    variant_id: product.variant_id
  };

  cartContext.addItem(cartItem);
  cartContext.setIsCartOpen(true); // Open cart drawer after adding item
};

/**
 * Format price to display as currency
 * @param price Price in cents
 * @returns Formatted price string
 */
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100);
}; 