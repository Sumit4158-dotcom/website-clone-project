"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Provider {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
  gameCount: number;
  createdAt: string;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/providers?limit=50");
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Provider Management</h1>
          <p className="text-muted-foreground">Manage game providers and studios</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors">
          <Plus className="h-4 w-4" />
          Add Provider
        </button>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          providers.map((provider) => (
            <div key={provider.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{provider.name}</h3>
                  <p className="text-xs text-muted-foreground">{provider.slug}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  provider.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {provider.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                  <span className="text-sm text-muted-foreground">Games</span>
                  <span className="text-lg font-bold text-primary">{provider.gameCount}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground mb-4">
                <p>Added: {new Date(provider.createdAt).toLocaleDateString()}</p>
              </div>

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
