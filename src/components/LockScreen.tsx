import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff, AlertCircle, Key, Users } from "lucide-react";
import { toast } from "sonner";

interface LockScreenProps {
  onUnlock: () => void;
  isLocked: boolean;
}

const LockScreen = ({ onUnlock, isLocked }: LockScreenProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [showEarlyAccess, setShowEarlyAccess] = useState(false);
  const [email, setEmail] = useState("");

  // Default password - in a real app, this would be stored securely
  const CORRECT_PASSWORD = "weblinker2024";

  useEffect(() => {
    // Check if user is locked out
    const lockoutEnd = localStorage.getItem("lockoutEnd");
    if (lockoutEnd) {
      const endTime = parseInt(lockoutEnd);
      if (Date.now() < endTime) {
        setLockoutTime(endTime);
      } else {
        localStorage.removeItem("lockoutEnd");
        setAttempts(0);
      }
    }
  }, []);

  useEffect(() => {
    if (lockoutTime) {
      const interval = setInterval(() => {
        if (Date.now() >= lockoutTime) {
          setLockoutTime(null);
          setAttempts(0);
          localStorage.removeItem("lockoutEnd");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutTime) return;

    setIsLoading(true);
    
    // Simulate a small delay for security
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === CORRECT_PASSWORD) {
      toast.success("Welcome back!");
      localStorage.setItem("isUnlocked", "true");
      localStorage.removeItem("lockoutEnd");
      setAttempts(0);
      onUnlock();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        const lockoutDuration = 5 * 60 * 1000; // 5 minutes
        const lockoutEnd = Date.now() + lockoutDuration;
        setLockoutTime(lockoutEnd);
        localStorage.setItem("lockoutEnd", lockoutEnd.toString());
        toast.error("Too many failed attempts. Please try again in 5 minutes.");
      } else {
        toast.error(`Incorrect password. ${5 - newAttempts} attempts remaining.`);
      }
    }
    
    setIsLoading(false);
  };

  const handleEarlyAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store early access email
    localStorage.setItem("earlyAccessEmail", email);
    localStorage.setItem("isUnlocked", "true");
    
    toast.success("Welcome to early access!");
    onUnlock();
    
    setIsLoading(false);
  };

  const formatTimeRemaining = () => {
    if (!lockoutTime) return "";
    const remaining = Math.max(0, lockoutTime - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Welcome to Weblinker</CardTitle>
              <CardDescription className="text-white/70 mt-2">
                Enter password or join early access
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {!showEarlyAccess ? (
              <>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={!!lockoutTime || isLoading}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      disabled={!!lockoutTime || isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {lockoutTime ? (
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span>Account temporarily locked</span>
                      </div>
                      <p className="text-sm text-white/70">
                        Try again in {formatTimeRemaining()}
                      </p>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full bg-white text-black hover:bg-white/90"
                      disabled={!password.trim() || isLoading}
                    >
                      {isLoading ? "Unlocking..." : "Unlock"}
                    </Button>
                  )}
                </form>
                
                {attempts > 0 && !lockoutTime && (
                  <p className="text-sm text-red-400 text-center mt-2">
                    {5 - attempts} attempts remaining
                  </p>
                )}

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-white/50">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => setShowEarlyAccess(true)}
                  disabled={isLoading}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Early Access
                </Button>
              </>
            ) : (
              <>
                <form onSubmit={handleEarlyAccessSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-white/90"
                    disabled={!email.trim() || isLoading}
                  >
                    {isLoading ? "Joining..." : "Join Early Access"}
                  </Button>
                </form>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-white/70 hover:text-white mt-2"
                  onClick={() => setShowEarlyAccess(false)}
                  disabled={isLoading}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Back to Password
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LockScreen; 