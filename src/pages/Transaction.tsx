import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { getCurrentUser } from "@/lib/auth";
import { addTransaction } from "@/lib/transactions";
import Navbar from "@/components/Navbar";
import { Send, Wallet } from "lucide-react";

const Transaction = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [amount, setAmount] = useState("");
  const [recipientUpi, setRecipientUpi] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [category, setCategory] = useState("Transfer");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!amount || !recipientUpi || !recipientName) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const transaction = addTransaction({
        userId: user.id,
        type: 'sent',
        amount: amountNum,
        recipient: recipientName,
        recipientUpi,
        status: 'success',
        category
      });

      toast({
        title: "Transaction successful!",
        description: `₹${amountNum.toLocaleString()} sent to ${recipientName}`,
      });

      // Reset form
      setAmount("");
      setRecipientUpi("");
      setRecipientName("");
      setCategory("Transfer");

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-mesh bg-background">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">Send Money</h2>
          <p className="text-muted-foreground text-lg">Transfer funds instantly via UPI</p>
        </div>

        <div className="grid gap-6">
          {/* User Balance Card */}
          <Card className="shadow-xl border-none bg-gradient-hero text-primary-foreground overflow-hidden relative group hover:shadow-2xl transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-2 font-medium uppercase tracking-wide">Your UPI ID</p>
                  <p className="text-3xl font-bold tracking-tight">{user.upiId}</p>
                </div>
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform shadow-lg">
                  <Wallet className="h-10 w-10" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Form */}
          <Card className="shadow-xl border-none">
            <CardHeader>
              <CardTitle className="text-2xl">Transaction Details</CardTitle>
              <CardDescription className="text-base">Enter the recipient information and amount</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransaction} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipient-name">Recipient Name</Label>
                  <Input
                    id="recipient-name"
                    type="text"
                    placeholder="John Doe"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient-upi">Recipient UPI ID</Label>
                  <Input
                    id="recipient-upi"
                    type="text"
                    placeholder="john@upi"
                    value={recipientUpi}
                    onChange={(e) => setRecipientUpi(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transfer">Transfer</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Bills">Bills</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full gap-2 shadow-glow hover:shadow-xl transition-all text-lg py-6" disabled={isLoading}>
                  <Send className="h-5 w-5" />
                  {isLoading ? "Processing..." : "Send Money"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-xl border-none bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-xl">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 group hover:translate-x-2 transition-transform">
                <div className="w-3 h-3 bg-gradient-primary rounded-full mt-1 shadow-glow" />
                <p className="text-muted-foreground leading-relaxed">Verify the UPI ID before sending money</p>
              </div>
              <div className="flex items-start gap-3 group hover:translate-x-2 transition-transform">
                <div className="w-3 h-3 bg-gradient-success rounded-full mt-1 shadow-glow-success" />
                <p className="text-muted-foreground leading-relaxed">Transactions are instant and secure</p>
              </div>
              <div className="flex items-start gap-3 group hover:translate-x-2 transition-transform">
                <div className="w-3 h-3 bg-gradient-to-br from-warning to-warning/80 rounded-full mt-1 shadow-md" />
                <p className="text-muted-foreground leading-relaxed">You can track all transactions in the dashboard</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Transaction;
