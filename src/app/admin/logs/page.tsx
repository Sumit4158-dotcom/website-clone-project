"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Download } from "lucide-react";

interface AdminLog {
  id: number;
  adminId: number;
  action: string;
  entityType: string;
  entityId?: number;
  oldData?: string;
  newData?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, entityFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: "100" });
      if (actionFilter !== "all") params.append("action", actionFilter);
      if (entityFilter !== "all") params.append("entityType", entityFilter);
      
      const response = await fetch(`/api/admin/logs?${params}`);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('create') || action.includes('add')) return 'text-green-500 bg-green-500/10';
    if (action.includes('update') || action.includes('edit')) return 'text-blue-500 bg-blue-500/10';
    if (action.includes('delete') || action.includes('remove')) return 'text-red-500 bg-red-500/10';
    return 'text-muted-foreground bg-secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Activity Logs</h1>
          <p className="text-muted-foreground">Track all admin activities and changes</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors">
          <Download className="h-4 w-4" />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Entities</option>
          <option value="user">Users</option>
          <option value="game">Games</option>
          <option value="transaction">Transactions</option>
          <option value="bonus">Bonuses</option>
          <option value="category">Categories</option>
          <option value="provider">Providers</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <p className="text-muted-foreground mb-2">No activity logs found</p>
            <p className="text-sm text-muted-foreground">Admin actions will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">ID</th>
                  <th className="text-left p-4 text-sm font-medium">Action</th>
                  <th className="text-left p-4 text-sm font-medium">Entity</th>
                  <th className="text-left p-4 text-sm font-medium">Admin</th>
                  <th className="text-left p-4 text-sm font-medium">IP Address</th>
                  <th className="text-left p-4 text-sm font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-4 text-sm font-mono">#{log.id}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <div>
                        <p className="font-medium">{log.entityType}</p>
                        {log.entityId && <p className="text-xs text-muted-foreground">ID: {log.entityId}</p>}
                      </div>
                    </td>
                    <td className="p-4 text-sm">Admin #{log.adminId}</td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">{log.ipAddress || '-'}</td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
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
