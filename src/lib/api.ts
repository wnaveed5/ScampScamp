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

// GraphQL query for fetching all products
const PRODUCTS_QUERY = `
  query Products {
    products(first: 10) {
      edges {
        node {
          id
          title
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query for fetching a single product by ID
const PRODUCT_QUERY = `
  query Product($id: ID!) {
    product(id: $id) {
      id
      title
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            priceV2 {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }
`;

/**
 * Fetch all products using Shopify Storefront API
 */
export async function fetchProducts(storeDomain: string, storefrontToken: string): Promise<Product[]> {
  try {
    const cleanDomain = storeDomain.replace('https://', '');
    
    console.log("Fetching products from domain:", cleanDomain);
    console.log("Using token:", storefrontToken);
    
    try {
      const response = await fetch(`https://${cleanDomain}/api/2025-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontToken,
        },
        body: JSON.stringify({ query: PRODUCTS_QUERY }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP error response:", response.status, errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Shopify API response:", data);
      
      if (data.data && data.data.products && data.data.products.edges) {
        return data.data.products.edges.map((edge: any) => {
          // Get variant ID if available
          const variantId = edge.node.variants?.edges?.[0]?.node?.id || edge.node.id;
          
          return {
            id: variantId, // Keep the full gid:// ID for cart operations
            title: edge.node.title,
            description: edge.node.description,
            price: edge.node.priceRange.minVariantPrice.amount,
            image: edge.node.featuredImage?.url || "https://placehold.co/500x500/e2e8f0/1e293b?text=No+Image",
          };
        });
      } else {
        console.error("Unexpected API response structure:", data);
        throw new Error("Invalid API response structure");
      }
    } catch (apiError) {
      console.error("Error fetching from Shopify API:", apiError);
      // Fall back to mock data
      return getFallbackProducts();
    }
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    return getFallbackProducts();
  }
}

// Fallback mock products for development/error scenarios
function getFallbackProducts(): Product[] {
  console.log("Using fallback mock products");
  const mockProducts: Product[] = [
    {
      id: "gid://shopify/ProductVariant/1",
      title: "Sample Product 1",
      description: "This is a sample product description. It would contain details about the product features and benefits.",
      price: "19.99",
      image: "https://placehold.co/500x500/e2e8f0/1e293b?text=Product+1"
    },
    {
      id: "gid://shopify/ProductVariant/2",
      title: "Sample Product 2",
      description: "Another sample product with a detailed description to show how the content would appear on the product page.",
      price: "29.99",
      image: "https://placehold.co/500x500/e2e8f0/1e293b?text=Product+2"
    },
    {
      id: "gid://shopify/ProductVariant/3",
      title: "Sample Product 3",
      description: "A third sample product with details about what makes it special and why customers should buy it.",
      price: "39.99",
      image: "https://placehold.co/500x500/e2e8f0/1e293b?text=Product+3"
    },
  ];
  
  return mockProducts;
}

/**
 * Fetch a single product by ID using Shopify Storefront API
 */
export async function fetchProductById(productId: string | undefined, storeDomain: string, storefrontToken: string): Promise<Product | null> {
  if (!productId) return null;
  
  try {
    const cleanDomain = storeDomain.replace('https://', '');
    
    console.log("Fetching product by ID:", productId);
    console.log("Using domain:", cleanDomain);
    
    try {
      const response = await fetch(`https://${cleanDomain}/api/2025-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontToken,
        },
        body: JSON.stringify({ 
          query: PRODUCT_QUERY, 
          variables: { id: `gid://shopify/Product/${productId}` } 
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP error response:", response.status, errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Shopify API product response:", data);
      
      const product = data.data?.product;
      if (!product) return null;
      
      return {
        id: product.id.split('/').pop(),
        title: product.title,
        description: product.description,
        price: product.priceRange.minVariantPrice.amount,
        image: product.featuredImage?.url || "https://placehold.co/500x500/e2e8f0/1e293b?text=No+Image",
        images: product.images?.edges.map((edge: any) => edge.node.url) || [],
        variants: product.variants?.edges.map((edge: any) => ({
          id: edge.node.id,
          title: edge.node.title,
          price: edge.node.priceV2.amount,
          available: edge.node.availableForSale
        })) || []
      };
    } catch (apiError) {
      console.error("Error fetching product from Shopify API:", apiError);
      // Fall back to mock data
      const products = getFallbackProducts();
      return products.find(p => p.id === productId) || null;
    }
  } catch (error) {
    console.error("Error in fetchProductById:", error);
    return null;
  }
}
