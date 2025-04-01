
import { cn } from "@/lib/utils";
import { 
  useShopQuery, 
  gql, 
  useProduct, 
  useProductOptions 
} from "@shopify/hydrogen-react";

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
const PRODUCTS_QUERY = gql`
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
        }
      }
    }
  }
`;

// GraphQL query for fetching a single product by ID
const PRODUCT_QUERY = gql`
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
 * Fetch all products using Hydrogen
 */
export async function fetchProducts(): Promise<Product[]> {
  // For development/fallback, return mock data
  // In a production app, this would be replaced by proper error handling
  
  try {
    // This would be used when integrated with Shopify
    // const { data } = await useShopQuery({
    //   query: PRODUCTS_QUERY,
    // });
    
    // return data.products.edges.map(edge => {
    //   return {
    //     id: edge.node.id,
    //     title: edge.node.title,
    //     description: edge.node.description,
    //     price: edge.node.priceRange.minVariantPrice.amount,
    //     image: edge.node.featuredImage.url,
    //   };
    // });
    
    // MOCK DATA - Used for development and when Shopify connection fails
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
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return mock data as fallback
    return [
      {
        id: "1",
        title: "Sample Product 1",
        description: "This is a sample product description. It would contain details about the product features and benefits.",
        price: "19.99",
        image: "https://placehold.co/500x500/e2e8f0/1e293b?text=Product+1"
      },
      // ... additional fallback products
    ];
  }
}

/**
 * Fetch a single product by ID using Hydrogen
 */
export async function fetchProductById(productId: string | undefined): Promise<Product | null> {
  if (!productId) return null;
  
  // For development/fallback, use mock data
  try {
    // This would be used when integrated with Shopify
    // const { data } = await useShopQuery({
    //   query: PRODUCT_QUERY,
    //   variables: { id: productId }
    // });
    
    // const product = data.product;
    // if (!product) return null;
    
    // return {
    //   id: product.id,
    //   title: product.title,
    //   description: product.description,
    //   price: product.priceRange.minVariantPrice.amount,
    //   image: product.featuredImage.url,
    //   images: product.images.edges.map(edge => edge.node.url),
    //   variants: product.variants.edges.map(edge => ({
    //     id: edge.node.id,
    //     title: edge.node.title,
    //     price: edge.node.priceV2.amount,
    //     available: edge.node.availableForSale
    //   }))
    // };
    
    // Mock data for development
    const products = await fetchProducts();
    const product = products.find(p => p.id === productId);
    
    return product || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
