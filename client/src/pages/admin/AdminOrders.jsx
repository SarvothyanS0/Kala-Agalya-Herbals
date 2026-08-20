import { API_URL } from "../../services/api";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { openInvoice } from "../../services/invoiceGenerator";

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

  const getFilterCount = (status) => {
    if (status === "all") return orders.length;
    if (status === "PAID") return orders.filter(o => o.paymentStatus === "PAID").length;
    if (status === "Pending") return orders.filter(o => o.paymentStatus === "PENDING" || (o.orderStatus === "Pending" && o.paymentStatus !== "PAID")).length;
    return orders.filter(o => o.orderStatus === status).length;
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "PAID") return order.paymentStatus === "PAID";
    if (filter === "Pending") return order.paymentStatus === "PENDING" || (order.orderStatus === "Pending" && order.paymentStatus !== "PAID");
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

  const tableColumns = [
    { key: "orderId", label: "Order ID", align: "text-left" },
    { key: "customer", label: "Customer Name", align: "text-left" },
    { key: "contact", label: "Contact & City", align: "text-left" },
    { key: "amount", label: "Amount", align: "text-right" },
    { key: "payment", label: "Payment", align: "text-center" },
    { key: "paymentDate", label: "Payment Date", align: "text-left" },
    { key: "status", label: "Status", align: "text-center" },
    { key: "packed", label: "Packed", align: "text-center" },
    { key: "dispatch", label: "Dispatch", align: "text-center" },
    { key: "delivered", label: "Delivered", align: "text-center" },
    { key: "orderDate", label: "Order Placed", align: "text-left" },
    { key: "actions", label: "Actions", align: "text-center" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A16] mb-1 font-soria">Order Management</h1>
          <p className="text-[#6C685F] text-sm font-inter">Monitor, process, and download customer orders & invoices</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-yellow-500/20 px-4 py-2 rounded-2xl shadow-xs text-xs font-grotesk font-bold text-[#6C685F]">
            Total Orders: <span className="text-yellow-800 text-sm">{orders.length}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl shadow-xs text-xs font-grotesk font-bold text-emerald-800">
            Paid: <span className="text-emerald-700 text-sm">{orders.filter(o => o.paymentStatus === "PAID").length}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-yellow-500/12 p-2 mb-6 flex flex-wrap items-center gap-2 shadow-xs">
        {/* Order-status filter tabs */}
        {["all", "Pending", "Packed", "Shipped", "Delivered"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2.5 rounded-xl font-bold font-grotesk transition-all duration-300 relative overflow-hidden text-xs uppercase tracking-wider ${
              filter === status
                ? "text-black bg-gradient-to-r from-yellow-500 to-amber-600 shadow-gold"
                : "text-[#6C685F] hover:text-[#1C1A16] hover:bg-yellow-500/8"
            }`}
          >
            <span className="relative z-10">
              {status} ({getFilterCount(status)})
            </span>
          </button>
        ))}

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-yellow-500/20 mx-1" />

        {/* Payment-status filter tab — Paid */}
        <button
          onClick={() => setFilter("PAID")}
          className={`px-4 py-2.5 rounded-xl font-bold font-grotesk transition-all duration-300 text-xs uppercase tracking-wider flex items-center gap-1.5 ${
            filter === "PAID"
              ? "text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md"
              : "text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Paid ({orders.filter(o => o.paymentStatus === "PAID").length})
        </button>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl border border-yellow-500/12 overflow-hidden shadow-card relative">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-yellow-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[#6C685F] font-inter text-sm">Retrieving order history...</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-admin-table-scroll w-full">
            <table className="w-full min-w-[1280px] border-collapse">
              <thead className="bg-[#FDFBF7] border-b border-yellow-500/15">
                <tr>
                  {tableColumns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-3.5 py-4 ${col.align} text-[11px] font-bold text-yellow-900 uppercase tracking-wider whitespace-nowrap font-grotesk`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-500/10 font-inter text-sm">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-yellow-500/5 transition-colors group">
                      {/* 1. Order ID */}
                      <td className="px-3.5 py-4 text-left whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-yellow-800 bg-yellow-500/10 px-2.5 py-1 rounded-lg border border-yellow-500/20 inline-block">
                          {order.orderId || (order._id ? order._id.slice(-8).toUpperCase() : "—")}
                        </span>
                      </td>

                      {/* 2. Customer Name (Truncated with Tooltip) */}
                      <td className="px-3.5 py-4 text-left whitespace-nowrap">
                        <div 
                          className="font-bold text-[#1C1A16] max-w-[130px] sm:max-w-[150px] truncate" 
                          title={order.customer?.name || "Customer"}
                        >
                          {order.customer?.name || "Customer"}
                        </div>
                        {order.customer?.email && (
                          <div 
                            className="text-[11px] text-[#9A9690] max-w-[130px] sm:max-w-[150px] truncate" 
                            title={order.customer.email}
                          >
                            {order.customer.email}
                          </div>
                        )}
                      </td>

                      {/* 3. Contact & City */}
                      <td className="px-3.5 py-4 text-left">
                        <div className="text-xs text-[#3a372e] font-semibold whitespace-nowrap font-mono">{order.customer?.phone || "—"}</div>
                        <div 
                          className="text-[11px] text-[#8A867E] max-w-[140px] truncate"
                          title={[order.customer?.address?.district, order.customer?.address?.state].filter(Boolean).join(", ") || "—"}
                        >
                          {[order.customer?.address?.district, order.customer?.address?.state].filter(Boolean).join(", ") || "—"}
                        </div>
                      </td>

                      {/* 4. Amount */}
                      <td className="px-3.5 py-4 text-right whitespace-nowrap">
                        <div className="font-black text-[#1C1A16] font-soria text-base">
                          ₹{(Number(order.totalAmount) || 0).toFixed(0)}
                        </div>
                        <div className="text-[10px] text-[#9A9690]">
                          {(order.items || []).length} item{(order.items || []).length !== 1 ? 's' : ''}
                        </div>
                      </td>

                      {/* 5. Payment Status */}
                      <td className="px-3.5 py-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-grotesk uppercase tracking-wider border ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* 6. Payment Date */}
                      <td className="px-3.5 py-4 text-left whitespace-nowrap">
                        {order.paymentStatus === "PAID" ? (
                          <div className="text-xs">
                            <div className="font-bold text-emerald-700">
                              {new Date(order.paymentDate || order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </div>
                            <div className="text-[10px] text-[#9A9690] mt-0.5">
                              {new Date(order.paymentDate || order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#C5C2BB] font-inter italic">—</span>
                        )}
                      </td>

                      {/* 7. Order Status */}
                      <td className="px-3.5 py-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-grotesk uppercase tracking-wider border ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* 8. Separate Column: Packed Toggle */}
                      <td className="px-3.5 py-4 text-center whitespace-nowrap">
                        <label className="relative inline-flex items-center cursor-pointer group justify-center" title="Toggle Packed State">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={order.orderStatus === "Packed" || order.orderStatus === "Shipped" || order.orderStatus === "Delivered"}
                            onChange={(e) => handleFastUpdate(order._id, e.target.checked ? "Packed" : "Pending")}
                            disabled={order.orderStatus === "Shipped" || order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"}
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 peer-disabled:opacity-40 shadow-xs"></div>
                        </label>
                      </td>

                      {/* 9. Separate Column: Dispatch Toggle */}
                      <td className="px-3.5 py-4 text-center whitespace-nowrap">
                        <label className="relative inline-flex items-center cursor-pointer group justify-center" title="Toggle Dispatch State">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={order.orderStatus === "Shipped" || order.orderStatus === "Delivered"}
                            onChange={(e) => handleFastUpdate(order._id, e.target.checked ? "Shipped" : "Pending")}
                            disabled={order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"}
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-600 peer-disabled:opacity-40 shadow-xs"></div>
                        </label>
                      </td>

                      {/* 10. Separate Column: Delivered Toggle */}
                      <td className="px-3.5 py-4 text-center whitespace-nowrap">
                        <label className="relative inline-flex items-center cursor-pointer group justify-center" title="Toggle Delivered State">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={order.orderStatus === "Delivered"}
                            onChange={(e) => handleFastUpdate(order._id, e.target.checked ? "Delivered" : "Shipped")}
                            disabled={(order.orderStatus !== "Shipped" && order.orderStatus !== "Delivered") || order.orderStatus === "Cancelled"}
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 peer-disabled:opacity-40 shadow-xs"></div>
                        </label>
                      </td>

                      {/* 11. Order Placed Date */}
                      <td className="px-3.5 py-4 text-left text-xs text-[#8A867E] whitespace-nowrap">
                        <div className="font-medium text-[#4A473E]">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                        <div className="text-[10px] text-[#9A9690] mt-0.5">{new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                      </td>

                      {/* 12. Actions */}
                      <td className="px-3.5 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-[#FDFBF7] text-yellow-900 border border-yellow-500/25 rounded-xl hover:bg-yellow-500/15 transition-all font-bold text-[10px] font-grotesk uppercase tracking-wider shadow-xs"
                            title="View Full Order Details"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => openInvoice(order)}
                            className="inline-flex items-center px-2.5 py-1.5 bg-yellow-500/10 text-yellow-800 border border-yellow-500/20 rounded-xl hover:bg-yellow-500/20 transition-all font-bold text-[10px] font-grotesk uppercase tracking-wider"
                            title="Print / Save Invoice PDF"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableColumns.length} className="px-6 py-20 text-center text-[#6C685F]">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-yellow-600/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <p className="text-xl font-bold text-[#1C1A16] font-grotesk mb-1">No Orders Found</p>
                        <p className="text-sm font-inter">Try selecting a different filter above</p>
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
