"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Gamepad2, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Activity,
  Gift,
  Building2
} from "lucide-react";

interface Stats {
  users: { total: number; active: number };
  games: { total: number; active: number };
  transactions: { 
    total: number; 
    completed: number;
    revenue: number;
    withdrawals: number;
  };
  bets: { 
    total: number;
    totalAmount: number;
    totalWins: number;
  };
  bonuses: { total: number; active: number };
  categories: { total: number };
  providers: { total: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const profitLoss = stats ? stats.transactions.revenue - stats.transactions.withdrawals - stats.bets.totalWins : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Manage your casino platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-xs text-muted-foreground">Active: {stats?.users.active}</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-3xl font-bold">{stats?.users.total}</p>
          </div>
        </div>

        {/* Total Games */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Gamepad2 className="h-6 w-6 text-purple-500" />
            </div>
            <span className="text-xs text-muted-foreground">Active: {stats?.games.active}</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Games</p>
            <p className="text-3xl font-bold">{stats?.games.total}</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <span className="text-xs text-green-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12.5%
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold">৳{stats?.transactions.revenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Profit/Loss */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-full ${profitLoss >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
              <DollarSign className={`h-6 w-6 ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <span className={`text-xs flex items-center gap-1 ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {profitLoss >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {profitLoss >= 0 ? '+' : ''}{((profitLoss / (stats?.transactions.revenue || 1)) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Net Profit/Loss</p>
            <p className={`text-3xl font-bold ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ৳{profitLoss.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Transactions</span>
          </div>
          <p className="text-2xl font-bold">{stats?.transactions.total}</p>
          <p className="text-xs text-muted-foreground mt-1">Completed: {stats?.transactions.completed}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-orange-500" />
            <span className="text-sm text-muted-foreground">Total Bets</span>
          </div>
          <p className="text-2xl font-bold">{stats?.bets.total}</p>
          <p className="text-xs text-muted-foreground mt-1">Amount: ৳{stats?.bets.totalAmount.toFixed(2)}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="h-5 w-5 text-pink-500" />
            <span className="text-sm text-muted-foreground">Active Bonuses</span>
          </div>
          <p className="text-2xl font-bold">{stats?.bonuses.active}</p>
          <p className="text-xs text-muted-foreground mt-1">Total: {stats?.bonuses.total}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-5 w-5 text-cyan-500" />
            <span className="text-sm text-muted-foreground">Game Providers</span>
          </div>
          <p className="text-2xl font-bold">{stats?.providers.total}</p>
          <p className="text-xs text-muted-foreground mt-1">Categories: {stats?.categories.total}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Financial Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Deposits</p>
                  <p className="text-xs text-muted-foreground">All-time revenue</p>
                </div>
              </div>
              <p className="text-lg font-bold text-green-500">৳{stats?.transactions.revenue.toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Withdrawals</p>
                  <p className="text-xs text-muted-foreground">All-time payouts</p>
                </div>
              </div>
              <p className="text-lg font-bold text-red-500">৳{stats?.transactions.withdrawals.toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Bets</p>
                  <p className="text-xs text-muted-foreground">Player wagering</p>
                </div>
              </div>
              <p className="text-lg font-bold">৳{stats?.bets.totalAmount.toFixed(2)}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Wins</p>
                  <p className="text-xs text-muted-foreground">Paid to players</p>
                </div>
              </div>
              <p className="text-lg font-bold text-blue-500">৳{stats?.bets.totalWins.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Platform Status</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">User Activity Rate</span>
                <span className="text-sm font-medium">
                  {stats ? ((stats.users.active / stats.users.total) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: stats ? `${(stats.users.active / stats.users.total) * 100}%` : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Games</span>
                <span className="text-sm font-medium">
                  {stats ? ((stats.games.active / stats.games.total) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: stats ? `${(stats.games.active / stats.games.total) * 100}%` : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Transaction Success Rate</span>
                <span className="text-sm font-medium">
                  {stats ? ((stats.transactions.completed / stats.transactions.total) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: stats ? `${(stats.transactions.completed / stats.transactions.total) * 100}%` : '0%' }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Bonuses</span>
                <span className="text-sm font-bold text-primary">{stats?.bonuses.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Game Providers</span>
                <span className="text-sm font-bold">{stats?.providers.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Categories</span>
                <span className="text-sm font-bold">{stats?.categories.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Average Bet Size</p>
            <p className="text-2xl font-bold">
              ৳{stats ? (stats.bets.totalAmount / stats.bets.total).toFixed(2) : '0.00'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-2xl font-bold text-primary">
              {stats ? ((stats.bets.totalWins / stats.bets.totalAmount) * 100).toFixed(1) : '0.0'}%
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">House Edge</p>
            <p className="text-2xl font-bold text-green-500">
              {stats ? (100 - ((stats.bets.totalWins / stats.bets.totalAmount) * 100)).toFixed(1) : '0.0'}%
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="/admin/users"
          className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer group"
        >
          <Users className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold mb-1">Manage Users</p>
          <p className="text-xs text-muted-foreground">View and edit users</p>
        </a>

        <a
          href="/admin/games"
          className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer group"
        >
          <Gamepad2 className="h-8 w-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold mb-1">Manage Games</p>
          <p className="text-xs text-muted-foreground">Add and configure games</p>
        </a>

        <a
          href="/admin/transactions"
          className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer group"
        >
          <Activity className="h-8 w-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold mb-1">Transactions</p>
          <p className="text-xs text-muted-foreground">Monitor all transactions</p>
        </a>

        <a
          href="/admin/bonuses"
          className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer group"
        >
          <Gift className="h-8 w-8 text-pink-500 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-semibold mb-1">Bonuses</p>
          <p className="text-xs text-muted-foreground">Create and manage bonuses</p>
        </a>
      </div>
    </div>
  );
}
