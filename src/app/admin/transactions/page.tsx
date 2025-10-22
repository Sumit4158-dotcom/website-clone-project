"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Download } from "lucide-react";

interface Transaction {
  id: number;
  userId: number;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: string;
  paymentMethod?: string;
  transactionRef?: string;
  description?: string;
  createdAt: string;
  completedAt?: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: "100" });
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      
      const response = await fetch(`/api/admin/transactions?${params}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-green-500 bg-green-500/10';
      case 'withdrawal': return 'text-red-500 bg-red-500/10';
      case 'bet': return 'text-orange-500 bg-orange-500/10';
      case 'win': return 'text-blue-500 bg-blue-500/10';
      case 'bonus': return 'text-purple-500 bg-purple-500/10';
      case 'refund': return 'text-cyan-500 bg-cyan-500/10';
      default: return 'text-muted-foreground bg-secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transaction Management</h1>
          <p className="text-muted-foreground">Monitor all financial transactions</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Types</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="bet">Bets</option>
          <option value="win">Wins</option>
          <option value="bonus">Bonuses</option>
          <option value="refund">Refunds</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Deposits</p>
          <p className="text-2xl font-bold text-green-500">
            ৳{transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((acc, t) => acc + t.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Withdrawals</p>
          <p className="text-2xl font-bold text-red-500">
            ৳{Math.abs(transactions.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((acc, t) => acc + t.amount, 0)).toFixed(2)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">
            {transactions.filter(t => t.status === 'pending').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Failed</p>
          <p className="text-2xl font-bold text-red-500">
            {transactions.filter(t => t.status === 'failed').length}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">ID</th>
                  <th className="text-left p-4 text-sm font-medium">Type</th>
                  <th className="text-left p-4 text-sm font-medium">User ID</th>
                  <th className="text-left p-4 text-sm font-medium">Amount</th>
                  <th className="text-left p-4 text-sm font-medium">Method</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-sm font-medium">Date</th>
                  <th className="text-right p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.slice(0, 50).map((tx) => (
                  <tr key={tx.id} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-4 text-sm font-mono">#{tx.id}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(tx.type)}`}>
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-sm">User #{tx.userId}</td>
                    <td className="p-4">
                      <p className={`text-sm font-bold ${tx.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.amount >= 0 ? '+' : ''}৳{tx.amount.toFixed(2)}
                      </p>
                    </td>
                    <td className="p-4 text-sm">{tx.paymentMethod || '-'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                        tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        tx.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                        'bg-gray-500/10 text-gray-500'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-secondary rounded-md transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
