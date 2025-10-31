import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, Wallet } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import { getCurrentUser } from "@/lib/auth";
import { getTransactions, getTransactionStats, Transaction } from "@/lib/transactions";

const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const userTransactions = getTransactions(user.id);
    setTransactions(userTransactions);
    setStats(getTransactionStats(userTransactions));
  }, [navigate]);

  if (!stats) {
    return null;
  }

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const categoryChartData = Object.entries(stats.categoryData).map(([name, value]) => ({
    name,
    value
  }));

  const recentTransactions = transactions.slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your UPI activity and performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon={Activity}
            trend="All time"
          />
          <StatsCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={TrendingUp}
            variant="success"
            trend={`${stats.successfulTransactions} successful`}
          />
          <StatsCard
            title="Total Sent"
            value={`₹${stats.totalSent.toLocaleString()}`}
            icon={ArrowUpRight}
            trend="Last 30 days"
          />
          <StatsCard
            title="Total Received"
            value={`₹${stats.totalReceived.toLocaleString()}`}
            icon={ArrowDownRight}
            variant="success"
            trend="Last 30 days"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Transaction Volume Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
              <CardDescription>Last 7 days activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.dailyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="sent" fill="hsl(var(--primary))" name="Sent" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="received" fill="hsl(var(--success))" name="Received" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Distribution of expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'sent' ? 'bg-primary/10' : 'bg-success/10'
                    }`}>
                      {transaction.type === 'sent' ? (
                        <ArrowUpRight className={`h-5 w-5 ${
                          transaction.type === 'sent' ? 'text-primary' : 'text-success'
                        }`} />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-success" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {transaction.type === 'sent' ? 'Sent to' : 'Received from'} {transaction.recipient}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleString()} • {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'sent' ? 'text-foreground' : 'text-success'
                    }`}>
                      {transaction.type === 'sent' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
                    </p>
                    <p className={`text-xs ${
                      transaction.status === 'success' ? 'text-success' :
                      transaction.status === 'pending' ? 'text-warning' : 'text-destructive'
                    }`}>
                      {transaction.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
