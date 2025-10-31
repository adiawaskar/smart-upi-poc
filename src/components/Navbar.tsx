import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Send, LogOut } from "lucide-react";
import { logoutUser } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
    navigate("/auth");
  };

  return (
    <nav className="border-b border-border bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Smart UPI
            </h1>
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant={location.pathname === "/" ? "default" : "ghost"}
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={location.pathname === "/transaction" ? "default" : "ghost"}
                onClick={() => navigate("/transaction")}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Send Money
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
