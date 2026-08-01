import { useState, useEffect, useCallback } from "react";
import { useToast } from "../../components/Alert";
import AdminLayout from "./AdminLayout";
import Avatar from "../../components/Avatar";
import { API_URL } from "../../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/users/admin/all`, {
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

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  const formatAddress = (addr) => {
    if (!addr) return null;
    const parts = [addr.street, addr.city, addr.state, addr.zipCode, addr.country].filter(Boolean);
    return parts.length ? parts.join(", ") : null;
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A16] mb-1 font-soria">User Management</h1>
          <p className="text-[#6C685F] text-sm font-inter">View and manage registered customer information</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-3xl font-black text-yellow-800 font-soria">{users.length}</div>
            <div className="text-[10px] text-[#9A9690] font-bold uppercase tracking-widest font-grotesk">Total Customers</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm font-inter">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-800/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-premium pl-10 py-2.5 text-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-yellow-500/12 rounded-3xl overflow-hidden shadow-card relative">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-yellow-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[#6C685F] font-inter text-sm">Loading customer data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center text-[#6C685F] text-sm font-inter">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#FDFBF7] border-b border-yellow-500/12">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap font-grotesk">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap font-grotesk">Contact Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap font-grotesk">Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap font-grotesk">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap text-center font-grotesk">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap text-right font-grotesk">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap text-right font-grotesk">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-500/10 font-inter">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-yellow-500/4 transition-colors group">
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} name={user.name} size="sm" />
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-[#1C1A16] group-hover:text-yellow-700 transition-colors truncate max-w-[140px] font-grotesk">{user.name}</div>
                          <div className="text-xs text-[#9A9690] truncate max-w-[140px]">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-[#4A473E] font-medium whitespace-nowrap">
                        {user.phone || <span className="text-[#9A9690] italic">No phone</span>}
                      </div>
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4">
                      {formatAddress(user.address) ? (
                        <div className="text-xs text-[#6C685F] max-w-[200px] leading-relaxed truncate">
                          {formatAddress(user.address)}
                        </div>
                      ) : (
                        <span className="text-xs text-[#9A9690] italic">No address saved</span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-[#9A9690] whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </div>
                    </td>

                    {/* Account Type */}
                    <td className="px-6 py-4 text-center font-grotesk">
                      {user.isGoogleUser ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Google
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                          🔑 Local
                        </span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 text-right font-grotesk">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === "admin"
                          ? "bg-red-50 text-red-800 border border-red-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* View Details */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-3.5 py-1.5 bg-[#FDFBF7] text-yellow-800 border border-yellow-500/25 rounded-xl hover:bg-yellow-500/15 transition-all font-bold text-[10px] font-grotesk uppercase tracking-wider whitespace-nowrap"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white border border-yellow-500/20 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#FDFBF7] px-8 py-5 border-b border-yellow-500/12 flex items-center justify-between font-grotesk">
              <h2 className="text-base font-bold text-[#1C1A16] uppercase tracking-wider">User Profile</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-[#9A9690] hover:text-red-600 transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto font-inter">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <Avatar src={selectedUser.avatar} name={selectedUser.name} size="lg" />
                <div>
                  <h3 className="text-xl font-bold text-[#1C1A16] font-grotesk">{selectedUser.name}</h3>
                  <p className="text-sm text-[#6C685F]">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2 font-grotesk">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      selectedUser.role === "admin"
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    }`}>{selectedUser.role}</span>
                    {selectedUser.isGoogleUser ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">Google Account</span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Local Account</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Rows */}
              {[
                { label: "Account ID", value: selectedUser._id },
                { label: "Phone", value: selectedUser.phone || "Not added" },
                {
                  label: "Joined On",
                  value: new Date(selectedUser.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "long", year: "numeric"
                  })
                },
              ].map(({ label, value }) => (
                <div key={label} className="border-b border-yellow-500/10 pb-4">
                  <div className="text-[10px] font-bold text-yellow-800 uppercase tracking-wider font-grotesk mb-1">{label}</div>
                  <div className="text-sm text-[#4A473E] break-all">{value}</div>
                </div>
              ))}

              {/* Address */}
              <div className="border-b border-yellow-500/10 pb-4">
                <div className="text-[10px] font-bold text-yellow-800 uppercase tracking-wider font-grotesk mb-2">Saved Address</div>
                {formatAddress(selectedUser.address) ? (
                  <div className="text-sm text-[#4A473E] leading-relaxed">{formatAddress(selectedUser.address)}</div>
                ) : (
                  <div className="text-sm text-[#9A9690] italic">No address saved</div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 bg-[#FDFBF7] border-t border-yellow-500/12">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-[#6C685F] hover:text-[#1C1A16] bg-white border border-yellow-500/20 rounded-xl transition-all font-grotesk"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
