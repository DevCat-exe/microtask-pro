'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  Trash2, 
  Loader2,
  Search,
  ChevronDown
} from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ManageUsersPage() {
  const { data: users, error, isLoading, mutate } = useSWR('/api/admin/users', fetcher);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredUsers = users?.filter((user: any) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setDeletingId(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        mutate();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success('Role updated successfully');
        mutate();
      } else {
        toast.error('Failed to update role');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load users. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Manage Users</h1>
          <p className="text-text-secondary">View and manage platform users</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden dark:bg-bg-card-dark">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-bg-dark">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text">Coins</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers?.map((user: any) => (
                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-bg-dark">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.photoUrl || '/default-avatar.png'} 
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-text">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="appearance-none bg-transparent pr-8 py-1 text-sm font-medium capitalize"
                      >
                        <option value="worker">Worker</option>
                        <option value="buyer">Buyer</option>
                        <option value="admin">Admin</option>
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-primary">{user.coins}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={deletingId === user._id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {deletingId === user._id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}