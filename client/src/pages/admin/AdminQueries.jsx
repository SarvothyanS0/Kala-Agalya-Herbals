import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { API_URL } from "../../services/api";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" | "new" | "resolved"
  const navigate = useNavigate();

  const fetchQueries = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/queries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setQueries(data.queries);
    } catch (err) {
      console.error("Error fetching queries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) { navigate("/admin/login"); return; }
    fetchQueries();
  }, [navigate, fetchQueries]);

  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/queries/${id}/resolve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setQueries(prev => prev.map(q => q._id === id ? { ...q, status: "resolved" } : q));
      }
    } catch (err) {
      console.error("Resolve failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this query?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API_URL}/queries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueries(prev => prev.filter(q => q._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filtered = queries.filter(q => {
    if (filter === "new") return q.status === "new";
    if (filter === "resolved") return q.status === "resolved";
    return true;
  });

  const newCount = queries.filter(q => q.status === "new").length;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A16] mb-1 font-soria">Customer Queries</h1>
          <p className="text-[#6C685F] text-sm font-inter">Questions and messages submitted by customers from the home page</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-yellow-500/20 px-4 py-2 rounded-2xl shadow-xs text-xs font-grotesk font-bold text-[#6C685F]">
            Total: <span className="text-yellow-800 text-sm">{queries.length}</span>
          </div>
          {newCount > 0 && (
            <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-2xl text-xs font-grotesk font-bold text-red-700">
              🔴 New: <span className="text-sm">{newCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: `All (${queries.length})` },
          { key: "new", label: `🔴 New (${newCount})` },
          { key: "resolved", label: `✅ Resolved (${queries.length - newCount})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-grotesk uppercase tracking-wider transition-all ${
              filter === tab.key
                ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-md"
                : "bg-white border border-yellow-500/20 text-[#6C685F] hover:border-yellow-500/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Queries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-20 text-center bg-white rounded-3xl border border-yellow-500/15">
            <div className="animate-spin h-10 w-10 border-4 border-yellow-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-[#6C685F] text-sm">Loading queries...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-3xl border border-yellow-500/15">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-xl font-bold text-[#1C1A16] font-grotesk mb-1">No Queries Found</p>
            <p className="text-sm text-[#6C685F]">
              {filter === "new" ? "All queries have been resolved!" : "No queries yet. They'll appear here when customers submit them."}
            </p>
          </div>
        ) : (
          filtered.map(query => (
            <div
              key={query._id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
                query.status === "new"
                  ? "border-amber-300 border-l-4 border-l-amber-500"
                  : "border-yellow-500/15"
              }`}
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: customer info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="font-bold text-[#1C1A16] text-base font-grotesk">{query.name}</span>
                      {query.status === "new" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-amber-50 border border-amber-200 text-amber-700">🔴 New</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-emerald-50 border border-emerald-200 text-emerald-700">✅ Resolved</span>
                      )}
                    </div>

                    {/* Contact info */}
                    <div className="flex flex-wrap gap-4 text-xs text-[#6C685F] font-inter mb-4">
                      <a href={`tel:${query.phone}`} className="flex items-center gap-1.5 hover:text-yellow-700 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {query.phone}
                      </a>
                      {query.email && (
                        <a href={`mailto:${query.email}`} className="flex items-center gap-1.5 hover:text-yellow-700 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          {query.email}
                        </a>
                      )}
                      <span className="flex items-center gap-1.5 text-[#9A9690]">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(query.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        {" "}{new Date(query.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {/* Message */}
                    <div className="bg-[#FDFBF7] border border-yellow-500/10 rounded-xl p-4">
                      <p className="text-sm text-[#2C2921] font-inter leading-relaxed">{query.message}</p>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    {query.status === "new" && (
                      <button
                        onClick={() => handleResolve(query._id)}
                        className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-100 active:scale-95 transition-all font-grotesk"
                      >
                        ✓ Resolve
                      </button>
                    )}
                    <a
                      href={`https://wa.me/91${query.phone}?text=Hello ${encodeURIComponent(query.name)}, regarding your query on Kala Agalya Herbals:`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-green-100 transition-all font-grotesk text-center"
                    >
                      📲 WhatsApp
                    </a>
                    <button
                      onClick={() => handleDelete(query._id)}
                      className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 active:scale-95 transition-all font-grotesk"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
