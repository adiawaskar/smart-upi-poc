import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Wallet, Home, Send, LogOut } from "lucide-react";
import { logoutUser } from "@/lib/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate("/auth");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary to-primary/90 rounded-xl shadow-md">
              <Wallet className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Smart UPI</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={isActive("/") ? "secondary" : "ghost"}
              size="sm" 
              onClick={() => navigate("/")}
              className="gap-2 font-medium"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={isActive("/transaction") ? "secondary" : "ghost"}
              size="sm" 
              onClick={() => navigate("/transaction")}
              className="gap-2 font-medium"
            >
              <Send className="h-4 w-4" />
              Send Money
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive font-medium"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
