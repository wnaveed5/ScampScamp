
import { cn } from "@/lib/utils";

// Define types for our data
export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  images?: string[];
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  available: boolean;
}

/**
 * Fetch all products from the API
 * This is a placeholder function that will be replaced with actual Shopify API calls
 */
export async function fetchProducts(): Promise<Product[]> {
  // For development, return mock data
  // When ready to connect to Shopify, replace this with actual API call
  
  // MOCK DATA - Replace with actual Shopify API call
  const mockProducts: Product[] = [
    {
      id: "1",
      title: "Sample Product 1",
      description: "This is a sample product description. It would contain details about the product features and benefits.",
      price: "19.99",
      image: "https://placehold.co/500x500/e2e8f0/1e293b?text=Product+1"
    },
    {
      id: "2",
      title: "Sample Product 2",
      description: "Another sample product with a detailed description to show how the content would appear on the product page.",
      price: "29.99",
      image: "https://placehold.co/500x500/e2e8f0/1e293b?text=Product+2"
    },
    {
      id: "3",
      title: "Sample Product 3",
      description: "A third sample product with details about what makes it special and why customers should buy it.",
      price: "39.99",
      image: "https://placehold.co/500x500/e2e8f0/1e293b?text=Product+3"
    },
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockProducts;
  
  // REAL IMPLEMENTATION WOULD LOOK SOMETHING LIKE:
  // const response = await fetch('https://your-shop.myshopify.com/api/2023-01/graphql.json', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-Shopify-Storefront-Access-Token': 'your-storefront-access-token'
  //   },
  //   body: JSON.stringify({
  //     query: `
  //       {
  //         products(first: 10) {
  //           edges {
  //             node {
  //               id
  //               title
  //               description
  //               priceRange {
  //                 minVariantPrice {
  //                   amount
  //                   currencyCode
  //                 }
  //               }
  //               images(first: 1) {
  //                 edges {
  //                   node {
  //                     src
  //                   }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     `
  //   })
  // });
  // const data = await response.json();
  // return data.data.products.edges.map(edge => {
  //   return {
  //     id: edge.node.id,
  //     title: edge.node.title,
  //     description: edge.node.description,
  //     price: edge.node.priceRange.minVariantPrice.amount,
  //     image: edge.node.images.edges[0]?.node.src
  //   };
  // });
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(productId: string | undefined): Promise<Product | null> {
  if (!productId) return null;
  
  // For development, return mock data
  const products = await fetchProducts();
  const product = products.find(p => p.id === productId);
  
  return product || null;
  
  // REAL IMPLEMENTATION WOULD LOOK SOMETHING LIKE:
  // const response = await fetch('https://your-shop.myshopify.com/api/2023-01/graphql.json', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-Shopify-Storefront-Access-Token': 'your-storefront-access-token'
  //   },
  //   body: JSON.stringify({
  //     query: `
  //       {
  //         product(id: "${productId}") {
  //           id
  //           title
  //           description
  //           priceRange {
  //             minVariantPrice {
  //               amount
  //               currencyCode
  //             }
  //           }
  //           images(first: 5) {
  //             edges {
  //               node {
  //                 src
  //               }
  //             }
  //           }
  //           variants(first: 10) {
  //             edges {
  //               node {
  //                 id
  //                 title
  //                 priceV2 {
  //                   amount
  //                   currencyCode
  //                 }
  //                 availableForSale
  //               }
  //             }
  //           }
  //         }
  //       }
  //     `
  //   })
  // });
  // const data = await response.json();
  // const product = data.data.product;
  
  // if (!product) return null;
  
  // return {
  //   id: product.id,
  //   title: product.title,
  //   description: product.description,
  //   price: product.priceRange.minVariantPrice.amount,
  //   image: product.images.edges[0]?.node.src,
  //   images: product.images.edges.map(edge => edge.node.src),
  //   variants: product.variants.edges.map(edge => ({
  //     id: edge.node.id,
  //     title: edge.node.title,
  //     price: edge.node.priceV2.amount,
  //     available: edge.node.availableForSale
  //   }))
  // };
}
