"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, Star } from "lucide-react";

interface Game {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  provider: string;
  minBet: number;
  maxBet: number;
  rtp: number;
  isFeatured: boolean;
  isActive: boolean;
  playCount: number;
  createdAt: string;
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/games?limit=100");
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(search.toLowerCase()) ||
    game.provider.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Game Management</h1>
          <p className="text-muted-foreground">Manage all casino games</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors">
          <Plus className="h-4 w-4" />
          Add Game
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search games or providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Categories</option>
          <option value="1">Slots</option>
          <option value="2">Live Casino</option>
          <option value="4">Crash Games</option>
        </select>
      </div>

      {/* Games Grid */}
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
                  <th className="text-left p-4 text-sm font-medium">Game</th>
                  <th className="text-left p-4 text-sm font-medium">Provider</th>
                  <th className="text-left p-4 text-sm font-medium">RTP</th>
                  <th className="text-left p-4 text-sm font-medium">Bet Range</th>
                  <th className="text-left p-4 text-sm font-medium">Plays</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-right p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game) => (
                  <tr key={game.id} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {game.isFeatured && (
                          <Star className="h-4 w-4 text-primary fill-primary" />
                        )}
                        <div>
                          <p className="font-medium">{game.name}</p>
                          <p className="text-xs text-muted-foreground">{game.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{game.provider}</td>
                    <td className="p-4 text-sm font-medium">{game.rtp}%</td>
                    <td className="p-4 text-sm">
                      ৳{game.minBet} - ৳{game.maxBet}
                    </td>
                    <td className="p-4 text-sm font-medium">{game.playCount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        game.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {game.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-secondary rounded-md transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-md transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-md transition-colors">
                          <Trash2 className="h-4 w-4" />
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Games</p>
          <p className="text-2xl font-bold">{games.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Active Games</p>
          <p className="text-2xl font-bold text-green-500">{games.filter(g => g.isActive).length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Featured Games</p>
          <p className="text-2xl font-bold text-primary">{games.filter(g => g.isFeatured).length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Plays</p>
          <p className="text-2xl font-bold">{games.reduce((acc, g) => acc + g.playCount, 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
