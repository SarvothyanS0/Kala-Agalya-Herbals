import { API_URL } from "../../services/api";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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

  // ── Multi-Field Search Matcher (Name, Order ID, Phone, Date & Time) ──
  const matchesSearch = (order, query) => {
    if (!query || !query.trim()) return true;
    const q = query.toLowerCase().trim();

    // 1. Order ID & Database ID
    if (order.orderId && order.orderId.toLowerCase().includes(q)) return true;
    if (order._id && order._id.toString().toLowerCase().includes(q)) return true;

    // 2. Customer Name & Contact Information
    if (order.customer?.name && order.customer.name.toLowerCase().includes(q)) return true;
    if (order.customer?.email && order.customer.email.toLowerCase().includes(q)) return true;
    if (order.customer?.phone && order.customer.phone.toLowerCase().includes(q)) return true;
    if (order.customer?.altPhone && order.customer.altPhone.toLowerCase().includes(q)) return true;
    if (order.customer?.address?.district && order.customer.address.district.toLowerCase().includes(q)) return true;
    if (order.customer?.address?.state && order.customer.address.state.toLowerCase().includes(q)) return true;
    if (order.customer?.address?.pincode && order.customer.address.pincode.toLowerCase().includes(q)) return true;

    // 3. Payment ID / Transaction Ref
    if (order.paymentId && order.paymentId.toLowerCase().includes(q)) return true;

    // 4. Order Status or Payment Status
    if (order.orderStatus && order.orderStatus.toLowerCase().includes(q)) return true;
    if (order.paymentStatus && order.paymentStatus.toLowerCase().includes(q)) return true;

    // 5. Order Created Date & Time
    if (order.createdAt) {
      const created = new Date(order.createdAt);
      const str1 = created.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toLowerCase(); // "20 aug 2026"
      const str2 = created.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }).toLowerCase(); // "20 august 2026"
      const str3 = created.toLocaleDateString("en-IN").toLowerCase(); // "20/08/2026"
      const strIso = created.toISOString().toLowerCase(); // "2026-08-20"
      const time12 = created.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }).toLowerCase(); // "08:30 pm"
      const time24 = created.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }).toLowerCase(); // "20:30"
      
      if (
        str1.includes(q) ||
        str2.includes(q) ||
        str3.includes(q) ||
        strIso.includes(q) ||
        time12.includes(q) ||
        time24.includes(q)
      ) {
        return true;
      }
    }

    // 6. Payment Confirmed Date & Time
    if (order.paymentDate) {
      const pay = new Date(order.paymentDate);
      const str1 = pay.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toLowerCase();
      const str2 = pay.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }).toLowerCase();
      const str3 = pay.toLocaleDateString("en-IN").toLowerCase();
      const strIso = pay.toISOString().toLowerCase();
      const time12 = pay.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }).toLowerCase();
      const time24 = pay.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }).toLowerCase();

      if (
        str1.includes(q) ||
        str2.includes(q) ||
        str3.includes(q) ||
        strIso.includes(q) ||
        time12.includes(q) ||
        time24.includes(q)
      ) {
        return true;
      }
    }

    // 7. Product Item Names
    if (order.items && Array.isArray(order.items)) {
      if (order.items.some(item => item.name && item.name.toLowerCase().includes(q))) {
        return true;
      }
    }

    return false;
  };

  const filteredOrders = orders.filter((order) => {
    // Tab filter
    let statusMatch = false;
    if (filter === "all") statusMatch = true;
    else if (filter === "PAID") statusMatch = order.paymentStatus === "PAID";
    else if (filter === "Pending") statusMatch = order.paymentStatus === "PENDING" || (order.orderStatus === "Pending" && order.paymentStatus !== "PAID");
    else statusMatch = order.orderStatus === filter;

    if (!statusMatch) return false;

    // Search query filter
    return matchesSearch(order, searchQuery);
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
      {/* Header section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A16] mb-1 font-soria">Order Management</h1>
          <p className="text-[#6C685F] text-sm font-inter">Search, monitor, process, and download customer orders & invoices</p>
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

      {/* Search & Filter Controls Card */}
      <div className="bg-white rounded-3xl border border-yellow-500/15 p-4 sm:p-5 mb-6 shadow-xs space-y-4">
        {/* ── Search Bar ── */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-yellow-700">
            <svg className="w-5 h-5 text-yellow-600/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, order ID, phone, date (e.g. 20 Aug, 20/08), or time (e.g. 08:30 PM)..."
            className="w-full pl-11 pr-10 py-3.5 bg-[#FDFBF7] border border-yellow-500/20 rounded-2xl text-sm font-inter text-[#1C1A16] placeholder-[#9A9690] focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-600 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9A9690] hover:text-[#1C1A16] transition-colors"
              title="Clear search"
            >
              <svg className="w-5 h-5 bg-yellow-500/15 hover:bg-yellow-500/30 p-1 rounded-full text-yellow-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Filter Tabs & Status Strip ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-yellow-500/10">
          <div className="flex flex-wrap items-center gap-2">
            {/* Order-status filter tabs */}
            {["all", "Pending", "Packed", "Shipped", "Delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl font-bold font-grotesk transition-all duration-300 relative overflow-hidden text-xs uppercase tracking-wider ${
                  filter === status
                    ? "text-black bg-gradient-to-r from-yellow-500 to-amber-600 shadow-gold"
                    : "text-[#6C685F] hover:text-[#1C1A16] hover:bg-yellow-500/8 border border-transparent"
                }`}
              >
                <span className="relative z-10">
                  {status} ({getFilterCount(status)})
                </span>
              </button>
            ))}

            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-yellow-500/20 mx-1" />

            {/* Payment-status filter tab — Paid */}
            <button
              onClick={() => setFilter("PAID")}
              className={`px-4 py-2 rounded-xl font-bold font-grotesk transition-all duration-300 text-xs uppercase tracking-wider flex items-center gap-1.5 ${
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

          {/* Active Search / Match Summary Badge */}
          {searchQuery && (
            <div className="text-xs font-inter text-[#6C685F] flex items-center gap-2">
              <span>
                Found <strong className="text-yellow-800 font-bold">{filteredOrders.length}</strong> matching order{filteredOrders.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-[11px] text-yellow-700 hover:underline font-bold font-grotesk uppercase tracking-wider"
              >
                Reset
              </button>
            </div>
          )}
        </div>
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
                        <label 
                          className={`relative inline-flex items-center justify-center ${
                            order.orderStatus === "Shipped" || order.orderStatus === "Delivered" || order.orderStatus === "Cancelled" 
                              ? "cursor-not-allowed opacity-40" 
                              : "cursor-pointer"
                          }`}
                          title={
                            order.orderStatus === "Shipped" || order.orderStatus === "Delivered" 
                              ? "Already dispatched / delivered" 
                              : order.orderStatus === "Cancelled" 
                                ? "Order cancelled" 
                                : "Toggle Packed state"
                          }
                        >
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={order.orderStatus === "Packed" || order.orderStatus === "Shipped" || order.orderStatus === "Delivered"}
                            onChange={(e) => handleFastUpdate(order._id, e.target.checked ? "Packed" : "Pending")}
                            disabled={order.orderStatus === "Shipped" || order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"}
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 shadow-xs"></div>
                        </label>
                      </td>

                      {/* 9. Separate Column: Dispatch Toggle (Accessible ONLY after Packed) */}
                      <td className="px-3.5 py-4 text-center whitespace-nowrap">
                        <label 
                          className={`relative inline-flex items-center justify-center ${
                            (order.orderStatus !== "Packed" && order.orderStatus !== "Shipped") || order.orderStatus === "Delivered" || order.orderStatus === "Cancelled" 
                              ? "cursor-not-allowed opacity-35" 
                              : "cursor-pointer"
                          }`}
                          title={
                            order.orderStatus === "Pending" 
                              ? "Must pack the order first to dispatch" 
                              : order.orderStatus === "Delivered" 
                                ? "Already delivered" 
                                : order.orderStatus === "Cancelled"
                                  ? "Order cancelled"
                                  : "Toggle Dispatch state"
                          }
                        >
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={order.orderStatus === "Shipped" || order.orderStatus === "Delivered"}
                            onChange={(e) => handleFastUpdate(order._id, e.target.checked ? "Shipped" : "Packed")}
                            disabled={(order.orderStatus !== "Packed" && order.orderStatus !== "Shipped") || order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"}
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-600 shadow-xs"></div>
                        </label>
                      </td>

                      {/* 10. Separate Column: Delivered Toggle (Accessible ONLY after Dispatch) */}
                      <td className="px-3.5 py-4 text-center whitespace-nowrap">
                        <label 
                          className={`relative inline-flex items-center justify-center ${
                            (order.orderStatus !== "Shipped" && order.orderStatus !== "Delivered") || order.orderStatus === "Cancelled" 
                              ? "cursor-not-allowed opacity-35" 
                              : "cursor-pointer"
                          }`}
                          title={
                            order.orderStatus === "Pending" || order.orderStatus === "Packed" 
                              ? "Must dispatch order first to mark as delivered" 
                              : order.orderStatus === "Cancelled"
                                ? "Order cancelled"
                                : "Toggle Delivered state"
                          }
                        >
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={order.orderStatus === "Delivered"}
                            onChange={(e) => handleFastUpdate(order._id, e.target.checked ? "Delivered" : "Shipped")}
                            disabled={(order.orderStatus !== "Shipped" && order.orderStatus !== "Delivered") || order.orderStatus === "Cancelled"}
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 shadow-xs"></div>
                        </label>
                      </td>

                      {/* 11. Order Placed Date */}
                      <td className="px-3.5 py-4 text-left text-xs text-[#8A867E] whitespace-nowrap">
                        <div className="font-medium text-[#4A473E]">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                        <div className="text-[10px] text-[#9A9690] mt-0.5">{new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                      </td>

                      {/* 12. Actions */}
                      <td className="px-3.5 py-4 whitespace-nowrap text-center">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="inline-flex items-center px-3.5 py-1.5 bg-[#FDFBF7] text-yellow-900 border border-yellow-500/25 rounded-xl hover:bg-yellow-500/15 transition-all font-bold text-[10px] font-grotesk uppercase tracking-wider shadow-xs"
                          title="View Full Order Details"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableColumns.length} className="px-6 py-20 text-center text-[#6C685F]">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-yellow-600/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <p className="text-xl font-bold text-[#1C1A16] font-grotesk mb-1">
                          {searchQuery ? "No Orders Matching Search" : "No Orders Found"}
                        </p>
                        <p className="text-sm font-inter">
                          {searchQuery
                            ? `No orders found matching "${searchQuery}". Try a different name, order ID, date, or time.`
                            : "Try selecting a different filter above"}
                        </p>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="mt-4 px-4 py-2 bg-yellow-500/10 text-yellow-800 border border-yellow-500/25 rounded-xl font-grotesk text-xs font-bold uppercase tracking-wider hover:bg-yellow-500/20 transition-all"
                          >
                            Clear Search
                          </button>
                        )}
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
