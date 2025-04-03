import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartJS } from '../context/CartJS';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const CartDrawer = () => {
  // Get cart context
  const cart = useCartJS();
  const { items, totalItems, totalPrice, isCartOpen, setIsCartOpen } = cart;
  
  // Handle removing an item from the cart
  const handleRemoveItem = (id: string) => {
    cart.removeItem(id);
  };

  // Handle updating item quantity
  const handleUpdateQuantity = (item: any, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) return;
    
    cart.updateItem(item.id, newQuantity);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle className="text-xl font-bold flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Cart ({totalItems})
          </SheetTitle>
          <SheetClose className="absolute right-4 top-4">
            <X size={24} />
          </SheetClose>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
              <p className="text-muted-foreground">Add some products to your cart to see them here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex border-b pb-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium">
                      <h3 className="line-clamp-2">{item.title}</h3>
                      <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => handleUpdateQuantity(item, -1)}
                          className="p-1"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item, 1)} 
                          className="p-1"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        type="button" 
                        className="text-sm font-medium text-primary hover:text-primary/80"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="border-t pt-4 px-1">
          <div className="w-full">
            <div className="flex justify-between text-base font-medium mb-2">
              <p>Subtotal</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Shipping and taxes calculated at checkout.</p>
            <div className="space-y-2">
              <Button className="w-full" disabled={items.length === 0}>
                Checkout
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setIsCartOpen(false)}>
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
