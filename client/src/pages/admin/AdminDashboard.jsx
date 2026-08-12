import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { API_URL } from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    todayOrders: 0,
    pendingOrders: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [period, setPeriod] = useState("daily");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const headers = { "Authorization": `Bearer ${token}` };

      // Parallel fetch for stats and sales chart
      const [statsRes, chartRes] = await Promise.all([
        fetch(`${API_URL}/admin/orders/dashboard/stats`, { headers }),
        fetch(`${API_URL}/admin/orders/dashboard/sales-chart?period=${period}`, { headers })
      ]);

      const statsData = await statsRes.json();
      const chartData = await chartRes.json();

      if (statsData.success) {
        setStats(statsData.stats);
      }
      if (chartData.success) {
        setSalesData(chartData.salesData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchAllDashboardData();
  }, [navigate, fetchAllDashboardData]);

  return (
    <AdminLayout>
      {loading ? (
        <div className="py-24 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-yellow-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#6C685F] text-sm font-inter">Loading dashboard insights...</p>
        </div>
      ) : (
        <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
         <div>
           <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A16] mb-1 font-soria">
             Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-700">{localStorage.getItem("adminName") || "Admin"}</span>
           </h2>
           <p className="text-[#6C685F] text-sm font-inter">Here's what's happening with your store today.</p>
         </div>
         <div className="flex items-center gap-2">
            <span className="px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-200 text-emerald-800 text-xs font-bold font-grotesk flex items-center gap-2 shadow-xs uppercase tracking-wider">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              System Live
            </span>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Orders", value: stats.totalOrders, color: "from-amber-600 to-yellow-500", icon: "📦" },
          { label: "Total Revenue", value: `₹${stats.totalSales.toFixed(0)}`, color: "from-yellow-600 to-amber-700", icon: "💰" },
          { label: "Today's Orders", value: stats.todayOrders, color: "from-amber-700 to-yellow-600", icon: "📅" },
          { label: "Pending Orders", value: stats.pendingOrders, color: "from-orange-600 to-amber-600", icon: "⏳" }
        ].map((stat, i) => (
          <div key={i} className="relative group p-6 rounded-3xl bg-white border border-yellow-500/12 hover:border-yellow-500/35 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-card-hover overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] border border-yellow-500/15 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-800 font-grotesk uppercase tracking-wider">
                Active
              </span>
            </div>
            <h3 className="text-3xl font-black text-[#1C1A16] mb-1 font-soria group-hover:text-yellow-700 transition-colors">{stat.value}</h3>
            <p className="text-xs text-[#6C685F] font-bold tracking-wider uppercase font-grotesk">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-7 border border-yellow-500/12 shadow-card relative overflow-hidden">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10">
             <div>
               <h3 className="text-xl font-bold text-[#1C1A16] font-grotesk flex items-center gap-2">
                 Sales Overview
                 <span className="text-[10px] text-emerald-800 font-bold px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full font-grotesk uppercase">Realtime</span>
               </h3>
               <p className="text-xs text-[#6C685F] font-inter mt-0.5">Track revenue performance over time</p>
             </div>
             <div className="flex gap-1.5 p-1 bg-[#F5F2EB] rounded-xl border border-yellow-500/15 w-full sm:w-auto">
               {['Daily', 'Monthly'].map((p) => (
                 <button
                   key={p}
                   onClick={() => setPeriod(p.toLowerCase())}
                   className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold font-grotesk uppercase tracking-wider transition-all ${
                     period === p.toLowerCase() 
                     ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-xs" 
                     : "text-[#6C685F] hover:text-[#1C1A16]"
                   }`}
                 >
                   {p}
                 </button>
               ))}
             </div>
           </div>
           
           <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 relative z-10 border-b border-yellow-500/10 pb-2">
              {salesData.length > 0 ? salesData.map((item, index) => {
                const maxSales = Math.max(...salesData.map((d) => d.totalSales));
                const height = (item.totalSales / maxSales) * 100;
                return (
                   <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end">
                      <div className="w-full relative h-full flex items-end justify-center">
                        <div 
                          className="w-full max-w-[40px] bg-gradient-to-t from-yellow-600 via-amber-500 to-yellow-400 rounded-t-md transition-all duration-500 group-hover:brightness-110 shadow-xs"
                          style={{ height: `${Math.max(height, 4)}%` }}
                        >
                           <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1C1A16] text-amber-300 text-[11px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-yellow-500/20 pointer-events-none z-20 font-grotesk">
                             ₹{item.totalSales}
                           </div>
                        </div>
                      </div>
                      <p className="text-[10px] uppercase tracking-wider text-[#9A9690] mt-3 font-bold font-grotesk whitespace-nowrap">
                        {period === "monthly"
                           ? `${item._id.month}/${String(item._id.year).slice(-2)}`
                           : `${item._id.day}/${item._id.month}`}
                      </p>
                   </div>
                )
              }) : (
                 <div className="w-full h-full flex items-center justify-center text-[#9A9690] text-sm font-inter">
                   No sales data recorded for this period.
                 </div>
              )}
           </div>
        </div>

        <div className="bg-white rounded-3xl p-7 border border-yellow-500/12 shadow-card flex flex-col justify-between">
           <div>
             <h3 className="text-xl font-bold text-[#1C1A16] mb-1 font-grotesk">Quick Actions</h3>
             <p className="text-xs text-[#6C685F] font-inter mb-6">Common administrative tasks</p>
           </div>
           
           <div className="grid gap-3.5 flex-1">
             <Link to="/admin/products" className="group flex items-center gap-4 p-4 rounded-2xl bg-[#FDFBF7] border border-yellow-500/15 hover:border-yellow-500/40 hover:bg-yellow-500/8 transition-all cursor-pointer shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center text-yellow-800 group-hover:scale-110 transition-transform">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <div>
                   <h4 className="font-bold text-[#1C1A16] group-hover:text-yellow-700 transition-colors uppercase text-xs tracking-wider font-grotesk">Add / Edit Product</h4>
                   <p className="text-[11px] text-[#6C685F] font-inter">Manage sizes and pricing</p>
                </div>
             </Link>

             <Link to="/admin/orders" className="group flex items-center gap-4 p-4 rounded-2xl bg-[#FDFBF7] border border-yellow-500/15 hover:border-yellow-500/40 hover:bg-yellow-500/8 transition-all cursor-pointer shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-800 group-hover:scale-110 transition-transform">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>
                </div>
                <div>
                   <h4 className="font-bold text-[#1C1A16] group-hover:text-amber-700 transition-colors uppercase text-xs tracking-wider font-grotesk">Process Orders</h4>
                   <p className="text-[11px] text-[#6C685F] font-inter">View pending customer shipments</p>
                </div>
             </Link>

             <Link to="/admin/reviews" className="group flex items-center gap-4 p-4 rounded-2xl bg-[#FDFBF7] border border-yellow-500/15 hover:border-yellow-500/40 hover:bg-yellow-500/8 transition-all cursor-pointer shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-yellow-600/15 flex items-center justify-center text-yellow-800 group-hover:scale-110 transition-transform">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                </div>
                <div>
                   <h4 className="font-bold text-[#1C1A16] group-hover:text-yellow-700 transition-colors uppercase text-xs tracking-wider font-grotesk">Moderate Reviews</h4>
                   <p className="text-[11px] text-[#6C685F] font-inter">Approve or delete feedback</p>
                </div>
             </Link>
           </div>
        </div>
      </div>
        </>
      )}
    </AdminLayout>
  );
}
