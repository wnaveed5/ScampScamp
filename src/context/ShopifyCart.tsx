import React, { createContext, useContext, useState, useEffect } from 'react';
import { useShopify } from '../hooks/useShopify';

// Define types for our cart
interface CartItem {
  id: string;
  variantId: string;
  merchandiseId: string; // Shopify uses this term
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface CartContextType {
  cartId: string | null;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, "id">) => Promise<void>;
  updateCartItem: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  checkoutUrl: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Create cart creation mutation
const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image {
                    url
                  }
                  priceV2 {
                    amount
                  }
                  product {
                    title
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
          }
        }
      }
    }
  }
`;

// Add lines to cart mutation
const ADD_LINES_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image {
                    url
                  }
                  priceV2 {
                    amount
                  }
                  product {
                    title
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
          }
        }
      }
    }
  }
`;

// Update cart lines mutation
const UPDATE_LINES_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image {
                    url
                  }
                  priceV2 {
                    amount
                  }
                  product {
                    title
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
          }
        }
      }
    }
  }
`;

// Remove cart lines mutation
const REMOVE_LINES_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  image {
                    url
                  }
                  priceV2 {
                    amount
                  }
                  product {
                    title
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
          }
        }
      }
    }
  }
`;

// Get cart query
const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                image {
                  url
                }
                priceV2 {
                  amount
                }
                product {
                  title
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
        }
      }
    }
  }
`;

export const ShopifyCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shop = useShopify();
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // Load cart ID from localStorage on initial render
  useEffect(() => {
    const storedCartId = localStorage.getItem('shopifyCartId');
    if (storedCartId) {
      setCartId(storedCartId);
      fetchCart(storedCartId);
    }
  }, []);

  // Make a GraphQL request to Shopify Storefront API
  const shopifyFetch = async (query: string, variables: any = {}) => {
    try {
      const response = await fetch(`https://${shop.storeDomain}/api/2025-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': shop.storefrontToken
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error making Shopify API request:', error);
      throw error;
    }
  };

  // Create a new cart
  const createCart = async (item?: Omit<CartItem, "id">) => {
    setIsLoading(true);
    try {
      const lines = item ? [{ 
        merchandiseId: item.merchandiseId,
        quantity: item.quantity
      }] : [];

      const result = await shopifyFetch(CREATE_CART_MUTATION, {
        input: { lines }
      });

      if (result.data?.cartCreate?.cart) {
        const newCart = result.data.cartCreate.cart;
        setCartId(newCart.id);
        setCheckoutUrl(newCart.checkoutUrl);
        localStorage.setItem('shopifyCartId', newCart.id);
        updateCartState(newCart);
        return newCart.id;
      } else {
        throw new Error('Failed to create cart');
      }
    } catch (error) {
      console.error('Error creating cart:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart data
  const fetchCart = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await shopifyFetch(GET_CART_QUERY, { cartId: id });

      if (result.data?.cart) {
        updateCartState(result.data.cart);
        setCheckoutUrl(result.data.cart.checkoutUrl);
      } else {
        // Cart no longer exists
        localStorage.removeItem('shopifyCartId');
        setCartId(null);
        setItems([]);
        setTotalItems(0);
        setTotalPrice(0);
        setCheckoutUrl(null);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Handle 404 error - cart doesn't exist anymore
      localStorage.removeItem('shopifyCartId');
      setCartId(null);
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
      setCheckoutUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Update local cart state from Shopify cart data
  const updateCartState = (cart: any) => {
    if (!cart || !cart.lines || !cart.lines.edges) {
      setItems([]);
      setTotalItems(0);
      setTotalPrice(0);
      return;
    }

    const cartItems = cart.lines.edges.map((edge: any) => {
      const node = edge.node;
      const merchandise = node.merchandise;
      
      return {
        id: node.id,
        variantId: merchandise.id,
        merchandiseId: merchandise.id,
        title: merchandise.product.title,
        price: parseFloat(merchandise.priceV2.amount),
        quantity: node.quantity,
        image: merchandise.image?.url
      };
    });

    setItems(cartItems);
    setTotalItems(cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0));
    
    if (cart.cost?.totalAmount?.amount) {
      setTotalPrice(parseFloat(cart.cost.totalAmount.amount));
    }
  };

  // Add an item to the cart
  const addToCart = async (item: Omit<CartItem, "id">) => {
    setIsLoading(true);
    
    try {
      // If no cart exists, create one with the item
      if (!cartId) {
        await createCart(item);
        return;
      }

      // Add to existing cart
      const result = await shopifyFetch(ADD_LINES_MUTATION, {
        cartId,
        lines: [
          {
            merchandiseId: item.merchandiseId,
            quantity: item.quantity
          }
        ]
      });

      if (result.data?.cartLinesAdd?.cart) {
        updateCartState(result.data.cartLinesAdd.cart);
        setCheckoutUrl(result.data.cartLinesAdd.cart.checkoutUrl);
      } else if (result.errors) {
        // Cart might not exist anymore
        console.error('Error adding to cart:', result.errors);
        await createCart(item);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Try creating a new cart if the error might be due to an invalid cart ID
      await createCart(item);
    } finally {
      setIsLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (id: string, quantity: number) => {
    if (!cartId) return;
    
    setIsLoading(true);
    try {
      const result = await shopifyFetch(UPDATE_LINES_MUTATION, {
        cartId,
        lines: [
          {
            id,
            quantity
          }
        ]
      });

      if (result.data?.cartLinesUpdate?.cart) {
        updateCartState(result.data.cartLinesUpdate.cart);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove an item from the cart
  const removeFromCart = async (id: string) => {
    if (!cartId) return;
    
    setIsLoading(true);
    try {
      const result = await shopifyFetch(REMOVE_LINES_MUTATION, {
        cartId,
        lineIds: [id]
      });

      if (result.data?.cartLinesRemove?.cart) {
        updateCartState(result.data.cartLinesRemove.cart);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear the cart by creating a new empty one
  const clearCart = async () => {
    setCartId(null);
    setItems([]);
    setTotalItems(0);
    setTotalPrice(0);
    setCheckoutUrl(null);
    localStorage.removeItem('shopifyCartId');
    await createCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartId,
        isCartOpen,
        setIsCartOpen,
        items,
        totalItems,
        totalPrice,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        isLoading,
        checkoutUrl
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useShopifyCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useShopifyCart must be used within a ShopifyCartProvider');
  }
  return context;
}; 