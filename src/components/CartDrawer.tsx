import React from 'react';
import { X, Plus, Minus, ShoppingBag, ExternalLink } from 'lucide-react';
import { useCart } from '@shopify/hydrogen-react';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface CartDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, setIsOpen }) => {
  // Get cart context
  const { 
    lines, 
    totalQuantity, 
    cost, 
    checkoutUrl, 
    linesRemove, 
    linesUpdate,
    status
  } = useCart();
  
  // Handle removing an item from the cart
  const handleRemoveItem = (lineId: string) => {
    linesRemove([lineId]);
  };

  // Handle updating item quantity
  const handleUpdateQuantity = (lineId: string, quantity: number, delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity <= 0) return;
    
    linesUpdate([
      {
        id: lineId,
        quantity: newQuantity
      }
    ]);
  };

  // Handle checkout redirect
  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  // Helper to format money
  const formatMoney = (amount: string | undefined) => {
    if (!amount) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle className="text-xl font-bold flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Cart ({totalQuantity || 0})
          </SheetTitle>
          <SheetClose className="absolute right-4 top-4">
            <X size={24} />
          </SheetClose>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-6">
          {!lines || lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
              <p className="text-muted-foreground">Add some products to your cart to see them here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {lines.map((line) => {
                const merchandise = line.merchandise;
                return (
                  <div key={line.id} className="flex border-b pb-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                      {merchandise.image && (
                        <img
                          src={merchandise.image.url}
                          alt={merchandise.product.title}
                          className="h-full w-full object-cover object-center"
                        />
                      )}
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium">
                        <h3 className="line-clamp-2">{merchandise.product.title}</h3>
                        <p className="ml-4">{formatMoney(line.cost.totalAmount.amount)}</p>
                      </div>
                      {merchandise.selectedOptions && merchandise.selectedOptions.length > 0 && (
                        <p className="mt-1 text-sm text-gray-500">
                          {merchandise.selectedOptions.map(option => 
                            `${option.name}: ${option.value}`
                          ).join(', ')}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md">
                          <button 
                            onClick={() => handleUpdateQuantity(line.id, line.quantity, -1)}
                            className="p-1"
                            disabled={line.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-2">{line.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(line.id, line.quantity, 1)} 
                            className="p-1"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          type="button" 
                          className="text-sm font-medium text-primary hover:text-primary/80"
                          onClick={() => handleRemoveItem(line.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <SheetFooter className="border-t pt-4 px-1">
          <div className="w-full">
            <div className="flex justify-between text-base font-medium mb-2">
              <p>Subtotal</p>
              <p>{formatMoney(cost?.subtotalAmount?.amount)}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Shipping and taxes calculated at checkout.</p>
            <div className="space-y-2">
              <Button 
                className="w-full flex items-center justify-center" 
                disabled={!lines || lines.length === 0 || !checkoutUrl}
                onClick={handleCheckout}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
