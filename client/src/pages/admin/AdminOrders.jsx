import { API_URL } from "../../services/api";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/admin/orders`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchOrders();
  }, [navigate, fetchOrders]);

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-amber-50 text-amber-800 border-amber-200",
      Packed: "bg-blue-50 text-blue-800 border-blue-200",
      Shipped: "bg-purple-50 text-purple-800 border-purple-200",
      Delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
      Cancelled: "bg-red-50 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getPaymentStatusColor = (status) => {
    return status === "PAID"
      ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
      : "text-amber-800 bg-amber-50 border border-amber-200";
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.orderStatus === filter;
  });

  const handleFastUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      }
    } catch (err) {
      console.error("Fast update failed", err);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A16] mb-1 font-soria">Order Management</h1>
        <p className="text-[#6C685F] text-sm font-inter">Monitor and process incoming customer orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-yellow-500/12 p-2 mb-8 flex flex-wrap gap-2 shadow-xs">
        {["all", "Pending", "Packed", "Shipped", "Delivered"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2.5 rounded-xl font-bold font-grotesk transition-all duration-300 relative overflow-hidden text-xs uppercase tracking-wider ${filter === status
                ? "text-black bg-gradient-to-r from-yellow-500 to-amber-600 shadow-gold"
                : "text-[#6C685F] hover:text-[#1C1A16] hover:bg-yellow-500/8"
              }`}
          >
            <span className="relative z-10">
              {status} {status === "all" ? `(${orders.length})` : `(${orders.filter(o => o.orderStatus === status).length})`}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-yellow-500/12 overflow-hidden shadow-card relative">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-yellow-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[#6C685F] font-inter text-sm">Retrieving order history...</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-admin-table-scroll w-full">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-[#FDFBF7] border-b border-yellow-500/12">
                <tr>
                  {["Order ID", "Customer Name", "Contact", "Amount", "Payment", "Status", "Fast Action", "Date", "Details"].map((head) => (
                    <th key={head} className={`px-6 py-4 text-left text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap font-grotesk ${head === 'Fast Action' ? 'text-center' : ''}`}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-500/10 font-inter">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-yellow-500/4 transition-colors group">
                      <td className="px-6 py-4 text-xs font-mono font-bold text-yellow-700 whitespace-nowrap">
                        {order.orderId || order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#1C1A16] whitespace-nowrap">
                        {order.customer.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-[#4A473E] font-medium whitespace-nowrap">{order.customer.phone}</div>
                        <div className="text-[11px] text-[#9A9690] truncate max-w-[150px]">{order.customer.address.district}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-[#1C1A16] font-soria whitespace-nowrap">
                        ₹{order.totalAmount.toFixed(0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold font-grotesk uppercase tracking-wider border ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold font-grotesk uppercase tracking-wider border ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col items-center gap-2">
                          <label className="relative inline-flex items-center cursor-pointer group">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={order.orderStatus === "Shipped" || order.orderStatus === "Delivered"}
                              onChange={(e) => handleFastUpdate(order._id, e.target.checked ? "Shipped" : "Pending")}
                              disabled={order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600 peer-disabled:opacity-50"></div>
                            <span className="ml-2 text-[10px] font-bold text-[#6C685F] uppercase tracking-wider font-grotesk w-16 text-center">
                              Dispatched
                            </span>
                          </label>

                          {(order.orderStatus === "Shipped") && (
                            <button
                              onClick={() => handleFastUpdate(order._id, "Delivered")}
                              className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[9px] font-bold font-grotesk uppercase tracking-wider hover:bg-emerald-100 transition-all w-24 text-center mt-1"
                            >
                              Mark Delivered
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#9A9690] whitespace-nowrap border-l border-yellow-500/10">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FDFBF7] text-yellow-800 border border-yellow-500/25 rounded-xl hover:bg-yellow-500/15 transition-all font-bold text-[10px] font-grotesk uppercase tracking-wider"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-20 text-center text-[#6C685F]">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-yellow-600/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <p className="text-xl font-bold text-[#1C1A16] font-grotesk mb-1">No Orders Found</p>
                        <p className="text-sm font-inter">Try selecting a different status filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


