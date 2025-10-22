"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";

interface Bonus {
  id: number;
  name: string;
  code: string;
  type: string;
  amount: number;
  percentage: number;
  maxAmount: number;
  wageringRequirement: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
}

export default function BonusesPage() {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchBonuses();
  }, [typeFilter]);

  const fetchBonuses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: "50" });
      if (typeFilter !== "all") params.append("type", typeFilter);
      
      const response = await fetch(`/api/admin/bonuses?${params}`);
      const data = await response.json();
      setBonuses(data);
    } catch (error) {
      console.error("Failed to fetch bonuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'bg-blue-500/10 text-blue-500';
      case 'deposit': return 'bg-green-500/10 text-green-500';
      case 'cashback': return 'bg-purple-500/10 text-purple-500';
      case 'free_spins': return 'bg-pink-500/10 text-pink-500';
      case 'referral': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-secondary text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bonus Management</h1>
          <p className="text-muted-foreground">Create and manage promotional bonuses</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors">
          <Plus className="h-4 w-4" />
          Create Bonus
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Types</option>
          <option value="welcome">Welcome</option>
          <option value="deposit">Deposit</option>
          <option value="cashback">Cashback</option>
          <option value="free_spins">Free Spins</option>
          <option value="referral">Referral</option>
        </select>
      </div>

      {/* Bonuses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          bonuses.map((bonus) => (
            <div key={bonus.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">{bonus.name}</h3>
                  <code className="text-xs bg-secondary px-2 py-1 rounded">{bonus.code}</code>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(bonus.type)}`}>
                  {bonus.type}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-sm font-bold">
                    {bonus.percentage > 0 ? `${bonus.percentage}%` : `৳${bonus.amount}`}
                  </span>
                </div>
                {bonus.maxAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Max Amount</span>
                    <span className="text-sm font-bold">৳{bonus.maxAmount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Wagering</span>
                  <span className="text-sm font-bold">{bonus.wageringRequirement}x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`text-sm font-medium ${bonus.isActive ? 'text-green-500' : 'text-red-500'}`}>
                    {bonus.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground mb-4">
                <p>Valid: {new Date(bonus.validFrom).toLocaleDateString()} - {new Date(bonus.validUntil).toLocaleDateString()}</p>
              </div>

              {bonus.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bonus.description}</p>
              )}

              <div className="flex gap-2">
                <button className="flex-1 bg-secondary hover:bg-secondary/80 py-2 rounded-md text-sm font-medium transition-colors">
                  <Edit className="h-4 w-4 inline mr-1" />
                  Edit
                </button>
                <button className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-md text-sm font-medium transition-colors">
                  <Trash2 className="h-4 w-4 inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
