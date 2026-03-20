import { useState, useEffect } from "react";
import { useToast } from "./Alert";
import AdminLayout from "./AdminLayout";
import Avatar from "./Avatar";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:5000/api/users/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      addToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-500 text-sm">View and manage registered customer information</p>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-2xl font-bold text-yellow-500">{users.length}</div>
          <div className="text-[10px] text-gray-600 uppercase tracking-widest">Total Customers</div>
        </div>
      </div>

      <div className="bg-[#15120a] border border-yellow-900/20 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading customer data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0d0b03] border-b border-yellow-900/10">
                  <th className="px-6 py-4 text-[10px] font-bold text-yellow-500/60 uppercase tracking-widest whitespace-nowrap">User Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-yellow-500/60 uppercase tracking-widest whitespace-nowrap">Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-yellow-500/60 uppercase tracking-widest whitespace-nowrap">Join Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-yellow-500/60 uppercase tracking-widest text-right whitespace-nowrap">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-900/10">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-yellow-500/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} name={user.name} size="sm" />
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors truncate">{user.name}</div>
                          <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400 whitespace-nowrap">{user.phone || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-400 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${user.role === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
