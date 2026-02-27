import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react"; // Added Loader2 for a nice loading state
import { toast } from "@/hooks/use-toast";

interface Props {
  // Updated to return a Promise<boolean>
  onLogin: (email: string, password: string) => Promise<boolean>;
}

const LoginModal = ({ onLogin }: Props) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state to handle loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Disable button while checking database

    try {
      const success = await onLogin(email, password);
      
      if (success) {
        setOpen(false);
        setEmail("");
        setPassword("");
        toast({ title: "Welcome back!", description: "You're now logged in as owner." });
      } else {
        toast({ title: "Login failed", description: "Invalid email or password.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong. Try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-40 w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
        aria-label="Owner login"
      >
        <LogIn className="w-4 h-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-card border-border/30 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Owner Login</DialogTitle>
            <DialogDescription>Sign in to manage your menu.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="admin@restaurant.com" 
                disabled={isLoading}
                required 
                className="bg-muted/50" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••" 
                disabled={isLoading}
                required 
                className="bg-muted/50" 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginModal;
