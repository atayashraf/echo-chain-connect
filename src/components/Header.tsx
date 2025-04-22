
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { User, Home, Bell, Search } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

export function Header() {
  const { address, isConnected, connectWallet } = useWallet();
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <span className="font-bold text-xl">EchoChain</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-5 h-5" />
          </Link>
          <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-5 h-5" />
          </Link>
          <Link to="/notifications" className="text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
          </Link>
          <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
            <User className="w-5 h-5" />
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {isConnected ? (
            <Link to="/profile" className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary-light text-primary">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''}
              </span>
            </Link>
          ) : (
            <Button onClick={connectWallet} className="bg-primary hover:bg-primary-dark transition-colors">
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
