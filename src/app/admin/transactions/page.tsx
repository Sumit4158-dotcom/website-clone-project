"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface Transaction {
  id: number;
  userId: number;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
  username?: string;
  gameName?: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/transactions");
      const data = await res.json();
      setTransactions(data || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500 bg-green-500/10";
      case "pending":
        return "text-yellow-500 bg-yellow-500/10";
      case "failed":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-500 bg-green-500/10";
      case "withdrawal":
        return "text-red-500 bg-red-500/10";
      case "bet":
        return "text-orange-500 bg-orange-500/10";
      case "win":
        return "text-blue-500 bg-blue-500/10";
      case "bonus":
        return "text-purple-500 bg-purple-500/10";
      case "refund":
        return "text-cyan-500 bg-cyan-500/10";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  // ✅ FIX ADDED HERE — define filteredTransactions
  const filteredTransactions = transactions.filter((t) => {
    const typeMatch = typeFilter === "all" || t.type === typeFilter;
    const statusMatch = statusFilter === "all" || t.status === statusFilter;
    return typeMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <Button
          variant="outline"
          onClick={fetchTransactions}
          disabled={loading}
          className="gap-2"
        >
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Transaction Filters</CardTitle>
          <div className="flex flex-wrap gap-3">
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="bet">Bet</option>
              <option value="win">Win</option>
              <option value="bonus">Bonus</option>
              <option value="refund">Refund</option>
            </select>

            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="p-4 font-medium">#</th>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Game</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {/* ✅ Now filteredTransactions works */}
              {filteredTransactions.slice(0, 50).map((tx) => (
                <tr key={tx.id} className="border-t border-border hover:bg-secondary/50">
                  <td className="p-4 text-sm font-mono">#{tx.id}</td>
                  <td className="p-4">{tx.username || `User #${tx.userId}`}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={getTypeColor(tx.type)}>
                      {tx.type}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium">₹{tx.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={getStatusColor(tx.status)}>
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="p-4">{tx.gameName || "-"}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(tx.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
