import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { API_URL } from "./services/api";

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

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/admin/orders/dashboard/stats`, {
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSalesChart = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/admin/orders/dashboard/sales-chart?period=${period}`,
        { 
          headers: { 
            "Authorization": `Bearer ${token}` 
          } 
        }
      );
      const data = await response.json();
      if (data.success) {
        setSalesData(data.salesData);
      }
    } catch (error) {
      console.error("Error fetching sales chart:", error);
    }
  }, [period]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchDashboardData();
  }, [navigate, fetchDashboardData]);

  useEffect(() => {
    if(stats.totalOrders > 0) fetchSalesChart();
  }, [stats.totalOrders, fetchSalesChart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0802] text-yellow-500">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.5)]"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
         <div>
           <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {localStorage.getItem("adminName")}</h2>
           <p className="text-gray-400">Here's what's happening with your store today.</p>
         </div>
         <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-yellow-900/20 rounded-full border border-yellow-500/30 text-yellow-400 text-sm font-mono flex items-center gap-2">
              <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse shadow-[0_0_10px_#84cc16]"></span>
              System Online
            </span>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Orders", value: stats.totalOrders, color: "from-blue-600 to-blue-400", icon: "📦" },
          { label: "Total Revenue", value: `₹${stats.totalSales.toFixed(0)}`, color: "from-yellow-600 to-amber-500", icon: "💰" },
          { label: "Today's Orders", value: stats.todayOrders, color: "from-purple-600 to-violet-400", icon: "📅" },
          { label: "Pending Orders", value: stats.pendingOrders, color: "from-orange-600 to-amber-400", icon: "⏳" }
        ].map((stat, i) => (
          <div key={i} className="relative group p-6 rounded-2xl bg-[#15120a] border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full group-hover:scale-110 transition-transform duration-500`}></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl border border-white/10 group-hover:border-white/20 transition-colors">
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-gradient-to-r ${stat.color} text-white opacity-80`}>
                    +12%
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">{stat.value}</h3>
                <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#15120a] rounded-2xl p-6 border border-yellow-500/10 shadow-lg relative overflow-hidden">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10">
             <h3 className="text-xl font-bold text-white flex items-center gap-2">
               Sales Overview
               <span className="text-xs text-gray-500 font-normal px-2 py-1 bg-white/5 rounded">Live</span>
             </h3>
             <div className="flex gap-2 p-1 bg-black/40 rounded-lg w-full sm:w-auto overflow-x-auto">
               {['Daily', 'Monthly'].map((p) => (
                 <button
                   key={p}
                   onClick={() => setPeriod(p.toLowerCase())}
                   className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                     period === p.toLowerCase() 
                     ? "bg-yellow-600 text-white shadow-lg" 
                     : "text-gray-400 hover:text-white"
                   }`}
                 >
                   {p}
                 </button>
               ))}
             </div>
           </div>
           
           <div className="h-64 flex items-end justify-between gap-1 sm:gap-4 px-2 relative z-10">
              {salesData.length > 0 ? salesData.map((item, index) => {
                const maxSales = Math.max(...salesData.map((d) => d.totalSales));
                const height = (item.totalSales / maxSales) * 100;
                return (
                   <div key={index} className="flex-1 flex flex-col items-center group">
                      <div className="w-full relative h-full flex items-end">
                        <div 
                          className="w-full bg-gradient-to-t from-yellow-900/50 to-yellow-500/50 rounded-t-sm transition-all duration-500 group-hover:to-yellow-400 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                          style={{ height: `${height || 1}%` }}
                        >
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700 pointer-events-none z-20">
                             ₹{item.totalSales}
                           </div>
                        </div>
                      </div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-3 font-medium whitespace-nowrap">
                        {period === "monthly"
                           ? `${item._id.month}/${String(item._id.year).slice(-2)}`
                           : `${item._id.day}/${item._id.month}`}
                      </p>
                   </div>
                )
              }) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-600">
                   No sales data available for this period.
                 </div>
              )}
           </div>

           <div className="absolute inset-0 pointer-events-none opacity-5">
               {[...Array(5)].map((_, i) => (
                  <div key={i} className="active w-full border-t border-white h-1/5"></div>
               ))}
           </div>
        </div>

        <div className="bg-[#15120a] rounded-2xl p-6 border border-yellow-500/10 relative overflow-hidden flex flex-col">
           <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
            <div className="grid gap-4 flex-1">
              <Link to="/admin/products" className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-yellow-900/10 hover:border-yellow-500/40 transition-all cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/5 transition-colors"></div>
                 <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_#eab30866] transition-all relative z-10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                 </div>
                 <div className="relative z-10">
                    <h4 className="font-bold text-gray-200 group-hover:text-yellow-400 transition-colors uppercase text-xs tracking-wider">Add Product</h4>
                    <p className="text-[10px] text-gray-500 uppercase">Manage inventory details</p>
                  </div>
              </Link>

              <Link to="/admin/orders" className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-blue-900/10 hover:border-blue-500/40 transition-all cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors"></div>
                 <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_#3b82f666] transition-all relative z-10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>
                 </div>
                 <div className="relative z-10">
                    <h4 className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors uppercase text-xs tracking-wider">Process Orders</h4>
                    <p className="text-[10px] text-gray-500 uppercase">Check pending shipments</p>
                 </div>
              </Link>

              <Link to="/admin/reviews" className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-purple-900/10 hover:border-purple-500/40 transition-all cursor-pointer overflow-hidden">
                 <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors"></div>
                 <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:shadow-[0_0_15px_#a855f766] transition-all relative z-10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                 </div>
                 <div className="relative z-10">
                    <h4 className="font-bold text-gray-200 group-hover:text-purple-400 transition-colors uppercase text-xs tracking-wider">Moderation</h4>
                    <p className="text-[10px] text-gray-500 uppercase">Manage customer reviews</p>
                 </div>
              </Link>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
}
