import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw, ShoppingBag, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductsSectionProps {
  products: any[];
  isLoading: boolean;
  onRefresh: () => void;
  onViewAll: (e: React.MouseEvent) => void;
  onAddToCart: (product: any, e: React.MouseEvent) => void;
  onBuyNow: (product: any, e: React.MouseEvent) => void;
}

const ProductsSection = ({
  products,
  isLoading,
  onRefresh,
  onViewAll,
  onAddToCart,
  onBuyNow,
}: ProductsSectionProps) => {
  return (
    <div className="bg-black min-h-screen">
      <section className="pt-[99px] md:pt-[147px] pb-12 md:pb-16 px-4 md:px-16">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-3xl font-medium">Featured Products</h2>
          <div className="flex items-center gap-4">
            <Button asChild variant="link" className="text-white" onClick={onViewAll}>
              <Link to="/products" className="flex items-center text-sm md:text-base">
                View All <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {isLoading
            ? [...Array(3)].map((_, i) => <Skeleton key={i} className="aspect-[3/4] w-full" />)
            : products?.slice(0, 6).map((product) => (
                <div key={product.id} className="group relative">
                  <div className="aspect-[3/4] relative mb-3 md:mb-4 overflow-hidden">
                    <Link to={`/product/${product.id}`} className="block">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ transform: "translateZ(0)" }}
                      />
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link to={`/product/${product.id}`} className="block flex-1 mr-3 md:mr-4">
                      <h3 className="text-lg md:text-xl font-medium">{product.title}</h3>
                      <p className="text-sm md:text-base text-gray-400">
                        ${Number.parseFloat(product.price).toFixed(2)}
                      </p>
                    </Link>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 md:h-8 px-2 md:px-3 bg-transparent border-white text-white hover:bg-white hover:text-black text-xs md:text-sm"
                        onClick={(e) => onAddToCart(product, e)}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 md:h-8 px-2 md:px-3 bg-white text-black hover:bg-gray-200 text-xs md:text-sm"
                        onClick={(e) => onBuyNow(product, e)}
                      >
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-16 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl md:text-4xl font-bold mb-4 md:mb-6">JOIN OUR NEWSLETTER</h2>
          <p className="text-sm md:text-base text-gray-400 mb-6 md:mb-8">
            Stay updated on new releases, exclusive content, and special promotions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 md:py-3 bg-transparent border border-white text-white text-sm md:text-base rounded-none"
              style={{ WebkitAppearance: "none" }}
            />
            <Button className="bg-white text-black hover:bg-gray-200 text-sm md:text-base">Subscribe</Button>
          </div>
        </div>
      </section>

      <footer className="py-8 md:py-12 px-4 md:px-16 bg-black">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <h3 className="font-medium mb-3 md:mb-4 text-sm md:text-base">SHOP</h3>
            <ul className="space-y-2 text-gray-400 text-xs md:text-sm">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3 md:mb-4 text-sm md:text-base">HELP</h3>
            <ul className="space-y-2 text-gray-400 text-xs md:text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3 md:mb-4 text-sm md:text-base">ABOUT</h3>
            <ul className="space-y-2 text-gray-400 text-xs md:text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3 md:mb-4 text-sm md:text-base">FOLLOW</h3>
            <ul className="space-y-2 text-gray-400 text-xs md:text-sm">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 md:mt-12 text-center text-gray-500 text-xs md:text-sm">
          <p>© {new Date().getFullYear()} SCAMP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductsSection; 