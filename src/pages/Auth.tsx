import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { registerUser, loginUser, setCurrentUser } from "@/lib/auth";
import { Wallet, TrendingUp, Shield } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = loginUser(loginEmail, loginPassword);
    
    if (result.success && result.user) {
      setCurrentUser(result.user);
      toast({
        title: "Welcome back!",
        description: result.message,
      });
      navigate("/");
    } else {
      toast({
        title: "Login failed",
        description: result.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!signupName || !signupEmail || !signupPhone || !signupPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const result = registerUser(signupEmail, signupPassword, signupName, signupPhone);
    
    if (result.success && result.user) {
      setCurrentUser(result.user);
      toast({
        title: "Account created!",
        description: "Welcome to Smart UPI",
      });
      navigate("/");
    } else {
      toast({
        title: "Signup failed",
        description: result.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-success/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>
      
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10 animate-fade-in">
        {/* Left side - Branding */}
        <div className="hidden md:block space-y-8 animate-slide-up">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent animate-scale-in">
              Smart UPI
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              The future of digital payments with smart analytics and instant transactions
            </p>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/90 shadow-md group-hover:scale-105 transition-transform">
                <Wallet className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-lg">Instant Payments</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Send and receive money instantly with UPI</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300" style={{ animationDelay: "0.1s" }}>
              <div className="p-3 rounded-xl bg-gradient-to-br from-success to-success/90 shadow-md group-hover:scale-105 transition-transform">
                <TrendingUp className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bold mb-1 text-lg">Smart Analytics</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Track spending with detailed insights and reports</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300" style={{ animationDelay: "0.2s" }}>
              <div className="p-3 rounded-xl bg-gradient-to-br from-warning to-warning/90 shadow-md group-hover:scale-105 transition-transform">
                <Shield className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-lg">Secure & Safe</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Bank-grade security for all transactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <Card className="shadow-lg border animate-scale-in">
          <CardHeader className="space-y-1.5 pb-6">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-sm">Login or create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="john@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full font-semibold shadow-md hover:shadow-lg transition-all" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="john@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full font-semibold shadow-md hover:shadow-lg transition-all" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
