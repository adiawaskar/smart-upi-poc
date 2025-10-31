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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Send Money</h2>
          <p className="text-muted-foreground">Transfer funds instantly via UPI</p>
        </div>

        <div className="grid gap-6">
          {/* User Balance Card */}
          <Card className="shadow-card bg-gradient-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Your UPI ID</p>
                  <p className="text-2xl font-bold">{user.upiId}</p>
                </div>
                <div className="p-4 bg-white/20 rounded-full">
                  <Wallet className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Enter the recipient information and amount</CardDescription>
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

                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                  {isLoading ? "Processing..." : "Send Money"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                <p className="text-muted-foreground">Verify the UPI ID before sending money</p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-success rounded-full mt-1.5" />
                <p className="text-muted-foreground">Transactions are instant and secure</p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-warning rounded-full mt-1.5" />
                <p className="text-muted-foreground">You can track all transactions in the dashboard</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Transaction;
