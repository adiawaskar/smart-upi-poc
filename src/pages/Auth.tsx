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
      {/* Animated background elements with multiple orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-success/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-warning/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }} />
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary/20 rounded-full animate-float" style={{ animationDelay: "0.5s", animationDuration: "4s" }} />
        <div className="absolute top-2/3 left-2/3 w-3 h-3 bg-success/20 rounded-full animate-float" style={{ animationDelay: "1.2s", animationDuration: "5s" }} />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-warning/20 rounded-full animate-float" style={{ animationDelay: "0.8s", animationDuration: "4.5s" }} />
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

        {/* Right side - Auth forms with glass effect */}
        <Card className="shadow-2xl border-2 border-white/20 backdrop-blur-xl bg-white/90 animate-scale-in relative overflow-hidden group">
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-success opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
          
          <CardHeader className="space-y-1.5 pb-6 relative">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Login or create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50 backdrop-blur-sm">
                <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5 mt-6">
                  <div className="space-y-2 group">
                    <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="john@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="transition-all duration-300 focus:shadow-md focus:scale-[1.01] border-2 hover:border-primary/30"
                      required
                    />
                  </div>
                  <div className="space-y-2 group">
                    <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="transition-all duration-300 focus:shadow-md focus:scale-[1.01] border-2 hover:border-primary/30"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group" 
                    disabled={isLoading}
                  >
                    <span className="relative z-10">{isLoading ? "Logging in..." : "Login"}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity animate-[shimmer_2s_linear_infinite]" />
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4 mt-6">
                  <div className="space-y-2 group">
                    <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="transition-all duration-300 focus:shadow-md focus:scale-[1.01] border-2 hover:border-primary/30"
                      required
                    />
                  </div>
                  <div className="space-y-2 group">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="john@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="transition-all duration-300 focus:shadow-md focus:scale-[1.01] border-2 hover:border-primary/30"
                      required
                    />
                  </div>
                  <div className="space-y-2 group">
                    <Label htmlFor="signup-phone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="transition-all duration-300 focus:shadow-md focus:scale-[1.01] border-2 hover:border-primary/30"
                      required
                    />
                  </div>
                  <div className="space-y-2 group">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="transition-all duration-300 focus:shadow-md focus:scale-[1.01] border-2 hover:border-primary/30"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group" 
                    disabled={isLoading}
                  >
                    <span className="relative z-10">{isLoading ? "Creating account..." : "Create Account"}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity animate-[shimmer_2s_linear_infinite]" />
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
