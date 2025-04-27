import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EarlyAccessModal: React.FC<EarlyAccessModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black text-white border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-bold text-center">Join Early Access Now</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <p className="text-lg text-white/80 text-center mb-8">
            Be the first to experience our exclusive collection and get special early access benefits.
          </p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const email = (e.target as HTMLFormElement).email.value;
            // TODO: Handle email signup
            toast.success("Thanks for joining!", {
              description: "We'll keep you updated on our launch.",
              duration: 5000,
              position: "top-center",
            });
            onClose();
          }} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40"
            />
            <button
              type="submit"
              className="w-full px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
            >
              Join Now
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EarlyAccessModal; 