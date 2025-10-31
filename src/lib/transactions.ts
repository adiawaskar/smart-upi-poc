export interface Transaction {
  id: string;
  userId: string;
  type: 'sent' | 'received';
  amount: number;
  recipient: string;
  recipientUpi: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
  category: string;
}

const TRANSACTIONS_KEY = 'smart_upi_transactions';

// Initialize with dummy transaction data
const initializeDummyTransactions = (userId: string): Transaction[] => {
  const categories = ['Food', 'Shopping', 'Bills', 'Transfer', 'Entertainment'];
  const recipients = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Brown', 'Charlie Davis'];
  const dummyTransactions: Transaction[] = [];
  
  // Generate 30 days of transactions
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const isSent = Math.random() > 0.4;
    dummyTransactions.push({
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type: isSent ? 'sent' : 'received',
      amount: Math.floor(Math.random() * 5000) + 100,
      recipient: recipients[Math.floor(Math.random() * recipients.length)],
      recipientUpi: `user${Math.floor(Math.random() * 1000)}@upi`,
      status: Math.random() > 0.1 ? 'success' : (Math.random() > 0.5 ? 'pending' : 'failed'),
      timestamp: date.toISOString(),
      category: categories[Math.floor(Math.random() * categories.length)]
    });
  }
  
  return dummyTransactions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const getTransactions = (userId: string): Transaction[] => {
  const stored = localStorage.getItem(TRANSACTIONS_KEY);
  let allTransactions: Transaction[] = stored ? JSON.parse(stored) : [];
  
  const userTransactions = allTransactions.filter(t => t.userId === userId);
  
  // If no transactions exist for this user, create dummy data
  if (userTransactions.length === 0) {
    const dummyTransactions = initializeDummyTransactions(userId);
    allTransactions = [...allTransactions, ...dummyTransactions];
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(allTransactions));
    return dummyTransactions;
  }
  
  return userTransactions;
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction => {
  const stored = localStorage.getItem(TRANSACTIONS_KEY);
  const allTransactions: Transaction[] = stored ? JSON.parse(stored) : [];
  
  const newTransaction: Transaction = {
    ...transaction,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  };
  
  allTransactions.push(newTransaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(allTransactions));
  
  return newTransaction;
};

export const getTransactionStats = (transactions: Transaction[]) => {
  const totalTransactions = transactions.length;
  const successfulTransactions = transactions.filter(t => t.status === 'success');
  const failedTransactions = transactions.filter(t => t.status === 'failed');
  
  const totalSent = successfulTransactions
    .filter(t => t.type === 'sent')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalReceived = successfulTransactions
    .filter(t => t.type === 'received')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const successRate = totalTransactions > 0 
    ? ((successfulTransactions.length / totalTransactions) * 100).toFixed(1)
    : '0';
  
  // Group by category
  const categoryData = successfulTransactions.reduce((acc, t) => {
    if (t.type === 'sent') {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);
  
  // Daily transaction volume for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });
  
  const dailyVolume = last7Days.map(date => {
    const dayTransactions = successfulTransactions.filter(t => 
      t.timestamp.startsWith(date)
    );
    const sent = dayTransactions.filter(t => t.type === 'sent').reduce((sum, t) => sum + t.amount, 0);
    const received = dayTransactions.filter(t => t.type === 'received').reduce((sum, t) => sum + t.amount, 0);
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sent,
      received,
      total: sent + received
    };
  });
  
  return {
    totalTransactions,
    successfulTransactions: successfulTransactions.length,
    failedTransactions: failedTransactions.length,
    totalSent,
    totalReceived,
    successRate,
    categoryData,
    dailyVolume
  };
};
