import { API_URL } from "../../services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Alert";
import AdminLayout from "./AdminLayout";

export default function AdminReports() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Set default dates (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
  }, [navigate]);

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      addToast("Please select both start and end dates", "error");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/admin/orders/reports/data?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setReport(data.report);
      } else {
        addToast(data.message || "Failed to fetch data", "error");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      addToast("Failed to fetch report", "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (!report || !report.orders || report.orders.length === 0) {
      addToast("No data to download", "error");
      return;
    }

    // Create CSV content
    const headers = [
      "Order ID",
      "Customer Name",
      "Phone",
      "Address",
      "District",
      "State",
      "Pincode",
      "Products",
      "Total Amount",
      "Payment Status",
      "Order Status",
      "Dispatched",
      "Order Date",
    ];

    const rows = report.orders.map((order) => {
      const products = order.items
        ? order.items
            .map((item) => `${item.name || "Unknown Product"} (${item.size || "N/A"}) x${item.quantity || 0}`)
            .join("; ")
        : "";

      const door = order.customer?.address?.door || "";
      const street = order.customer?.address?.street || "";
      const landmark = order.customer?.address?.landmark || "";
      const addressParts = [door, street, landmark].filter(Boolean);
      const address = addressParts.join(", ") || "N/A";

      return [
        order.orderId || order._id,
        order.customer?.name || "N/A",
        order.customer?.phone || "N/A",
        address,
        order.customer?.address?.district || "N/A",
        order.customer?.address?.state || "N/A",
        order.customer?.address?.pincode || "N/A",
        products,
        order.totalAmount || 0,
        order.paymentStatus || "N/A",
        order.orderStatus || "N/A",
        ["Shipped", "Delivered"].includes(order.orderStatus) ? "Yes" : "No",
        order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "N/A",
      ];
    });

    // Convert to CSV
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${startDate}_to_${endDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Report downloaded successfully", "success");
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A16] mb-1 font-soria">Sales Analytics</h1>
        <p className="text-[#6C685F] text-sm font-inter">Generate detailed reports and track performance metrics</p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-3xl border border-yellow-500/12 shadow-card p-6 sm:p-8 mb-8 relative overflow-hidden">
        <h2 className="text-xl font-bold text-[#1C1A16] mb-6 flex items-center gap-2 font-grotesk">
          <svg className="w-5 h-5 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Select Report Period
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-inter">
          <div>
            <label className="block text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2 font-grotesk">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-premium py-2.5 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2 font-grotesk">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-premium py-2.5 text-xs"
            />
          </div>
          <div className="flex items-end gap-3 font-grotesk">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-xl font-bold hover:from-yellow-400 hover:to-amber-500 transition-all uppercase tracking-wider shadow-gold disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Generate Report
                  </>
                )}
              </span>
            </button>
            {report && (
              <button
                onClick={downloadExcel}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Download CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border border-yellow-500/12 rounded-3xl shadow-card p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9A9690] text-xs font-bold uppercase tracking-wider font-grotesk">Total Orders</p>
                  <h3 className="text-4xl font-black mt-1 text-[#1C1A16] font-soria">{report.totalOrders}</h3>
                </div>
                <div className="bg-yellow-500/15 text-yellow-800 rounded-2xl p-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-yellow-500/12 rounded-3xl shadow-card p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#9A9690] text-xs font-bold uppercase tracking-wider font-grotesk">Total Revenue</p>
                  <h3 className="text-4xl font-black mt-1 text-[#1C1A16] font-soria">₹{report.totalSales.toFixed(0)}</h3>
                </div>
                <div className="bg-emerald-50 text-emerald-800 rounded-2xl p-4 border border-emerald-200">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Best Selling Products */}
          <div className="bg-white border border-yellow-500/12 rounded-3xl shadow-card p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-bold text-[#1C1A16] tracking-wide mb-6 flex items-center gap-3 font-grotesk">
              <svg className="w-5 h-5 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Top Performing Products
            </h2>
            <div className="space-y-4">
              {report.bestSelling && report.bestSelling.length > 0 ? (
                report.bestSelling.map((product, index) => {
                  const nameParts = (product.name || "").split(" - ");
                  const productName = nameParts[0] || product.name || "Unknown Product";
                  const bottleSize = nameParts[1] || "";
                  const maxQty = report.bestSelling[0]?.quantity || 1;
                  const quantity = product.quantity || 0;
                  const revenue = product.revenue || 0;
                  const barWidth = Math.max((quantity / maxQty) * 100, 8);

                  return (
                    <div
                      key={index}
                      className="bg-[#FDFBF7] rounded-2xl border border-yellow-500/12 hover:border-yellow-500/30 transition-all group overflow-hidden"
                    >
                      <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-inter">
                        {/* Rank + Name */}
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-grotesk shrink-0 ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-gold' : 'bg-yellow-500/15 text-yellow-900 border border-yellow-500/20'}`}>
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-[#1C1A16] group-hover:text-yellow-700 transition-colors uppercase text-sm font-grotesk">{productName}</p>
                            {bottleSize && (
                              <p className="text-xs text-[#6C685F] mt-0.5 flex items-center gap-1.5 font-grotesk">
                                Bottle Size: <span className="text-yellow-800 font-bold">{bottleSize}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          {/* Pieces Sold */}
                          <div className="bg-white border border-yellow-500/15 rounded-xl px-4 py-2.5 text-center min-w-[90px]">
                            <p className="text-[9px] text-[#9A9690] uppercase tracking-wider font-bold font-grotesk mb-0.5">Pieces Sold</p>
                            <p className="text-xl font-bold text-yellow-800 font-soria leading-none">{quantity}</p>
                          </div>
                          {/* Revenue */}
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 text-center min-w-[110px]">
                            <p className="text-[9px] text-emerald-700 uppercase tracking-wider font-bold font-grotesk mb-0.5">Revenue</p>
                            <p className="text-xl font-bold text-emerald-800 font-soria leading-none">₹{revenue.toFixed(0)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1 bg-yellow-500/10">
                        <div
                          className="h-full rounded-r-full transition-all duration-700 bg-gradient-to-r from-yellow-500 to-amber-600"
                          style={{ width: `${barWidth}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-[#6C685F] py-8 italic text-sm font-inter">No sales data available for this period.</p>
              )}
            </div>
          </div>

          {/* Total Product Sales Detail */}
          <div className="bg-white border border-yellow-500/12 rounded-3xl shadow-card p-6 sm:p-8 mb-8 overflow-hidden">
            <h2 className="text-xl font-bold text-[#1C1A16] tracking-wide mb-6 flex items-center gap-3 font-grotesk">
              <svg className="w-5 h-5 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Total Product Sales Detail
            </h2>
            <div className="overflow-x-auto custom-admin-table-scroll w-full">
              <table className="w-full text-left font-inter">
                <thead className="bg-[#FDFBF7] border-b border-yellow-500/12">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap font-grotesk">Product Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap font-grotesk">Size</th>
                    <th className="px-6 py-4 text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap text-center font-grotesk">Units Sold</th>
                    <th className="px-6 py-4 text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap text-right font-grotesk">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-500/10">
                  {report.bestSelling && report.bestSelling.length > 0 ? (
                    report.bestSelling.map((product, index) => {
                      const nameParts = (product.name || "").split(" - ");
                      const productName = nameParts[0] || product.name || "Unknown Product";
                      const bottleSize = nameParts[1] || "-";
                      const quantity = product.quantity || 0;
                      const revenue = product.revenue || 0;
                      
                      return (
                        <tr key={index} className="hover:bg-yellow-500/4 transition-colors group">
                          <td className="px-6 py-4 text-sm font-bold text-[#1C1A16] group-hover:text-yellow-700 transition-colors uppercase whitespace-nowrap font-grotesk">
                            {productName}
                          </td>
                          <td className="px-6 py-4 text-xs text-yellow-800 font-bold whitespace-nowrap font-grotesk">
                            {bottleSize}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-[#FDFBF7] border border-yellow-500/15 rounded-lg px-3 py-1 text-yellow-900 font-mono text-sm font-bold inline-block">
                              {quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-emerald-800 font-mono font-bold text-sm bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1 inline-block">
                              ₹{revenue.toFixed(0)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-[#6C685F] text-sm italic">
                        No product sales data available for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-yellow-500/12 rounded-3xl shadow-card relative" style={{overflow: 'hidden'}}>
            <div className="px-6 sm:px-8 py-5 bg-[#FDFBF7] border-b border-yellow-500/12">
              <h2 className="text-xs font-bold text-yellow-800 uppercase tracking-widest font-grotesk">Detailed Order History</h2>
            </div>
            <div className="overflow-x-auto custom-admin-table-scroll w-full">
              <table className="w-full font-inter min-w-[900px]">
                <thead className="bg-[#FDFBF7] border-b border-yellow-500/10">
                  <tr>
                  {["Order ID", "Customer", "Amount", "Dispatched", "Payment Status", "Order Status", "Date"].map((head) => (
                    <th key={head} className="px-6 sm:px-8 py-4 text-left text-xs font-bold text-yellow-800 uppercase tracking-widest whitespace-nowrap font-grotesk">{head}</th>
                  ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-500/10">
                  {report.orders.map((order) => (
                    <tr key={order._id} className="hover:bg-yellow-500/4 transition-colors group">
                      <td className="px-6 sm:px-8 py-4 text-xs font-mono font-bold text-yellow-700 whitespace-nowrap">
                        {order.orderId || (order._id && order._id.slice(-8).toUpperCase()) || "N/A"}
                      </td>
                      <td className="px-6 sm:px-8 py-4 text-sm text-[#1C1A16] font-bold whitespace-nowrap">{order.customer?.name || "N/A"}</td>
                      <td className="px-6 sm:px-8 py-4 text-sm font-bold text-[#1C1A16] font-soria whitespace-nowrap">
                        ₹{(order.totalAmount || 0).toFixed(0)}
                      </td>

                      {/* Dispatched Column */}
                      <td className="px-6 sm:px-8 py-4 whitespace-nowrap">
                        {["Shipped", "Delivered"].includes(order.orderStatus) ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-grotesk uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Dispatched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-grotesk uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                            Not Dispatched
                          </span>
                        )}
                      </td>

                      {/* Payment Status Column */}
                      <td className="px-6 sm:px-8 py-4 whitespace-nowrap">
                        {order.paymentStatus === "PAID" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-grotesk uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-grotesk uppercase tracking-wider bg-red-50 text-red-800 border border-red-200">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Order Status Column */}
                      <td className="px-6 sm:px-8 py-4 whitespace-nowrap font-grotesk">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            order.orderStatus === "Delivered"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : order.orderStatus === "Cancelled"
                              ? "bg-red-50 text-red-800 border-red-200"
                              : order.orderStatus === "Shipped"
                              ? "bg-purple-50 text-purple-800 border-purple-200"
                              : order.orderStatus === "Packed"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      <td className="px-6 sm:px-8 py-4 text-xs text-[#9A9690] whitespace-nowrap">
                        <div className="font-medium">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                        <div className="text-[10px] mt-0.5">{new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!report && !loading && (
        <div className="bg-white rounded-3xl border border-dashed border-yellow-500/30 p-16 sm:p-24 text-center mt-8 shadow-card">
          <svg className="w-16 h-16 text-yellow-600/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-2xl font-bold text-[#1C1A16] mb-1 font-grotesk">Analytics Ready</h3>
          <p className="text-[#6C685F] text-sm font-inter">Adjust your date range above and click "Generate Report" to see results.</p>
        </div>
      )}
    </AdminLayout>
  );
}


