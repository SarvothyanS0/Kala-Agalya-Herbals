import { API_URL, BASE_URL } from "../../services/api";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../components/Alert";
import AdminLayout from "./AdminLayout";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchReviews = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      addToast("Failed to fetch reviews", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchReviews();
  }, [navigate, fetchReviews]);

  const handleDelete = async (id, category = "") => {
    const sectionName = category === "dandruff" ? "Dandruff Review" : "Review";
    if (!window.confirm(`CRITICAL: Are you sure you want to delete this ${sectionName}? This action cannot be undone.`)) return;

    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${API_URL}/reviews/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      const data = await response.json();
      if (data.success) {
        addToast(`${sectionName} deleted successfully`, "success");
        fetchReviews();
      } else {
        addToast("Failed to delete review", "error");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      addToast("Failed to delete review", "error");
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (activeTab === "all") return true;
    if (activeTab === "dandruff") return r.category === "dandruff";
    return r.category !== "dandruff";
  });

  const dandruffCount = reviews.filter(r => r.category === "dandruff").length;
  const hairOilCount  = reviews.filter(r => r.category !== "dandruff").length;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A16] mb-1 font-soria">Review Moderation</h1>
          <p className="text-[#6C685F] text-sm font-inter">Monitor and manage customer feedback for Hair Oil & Dandruff Care</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-yellow-500/12 flex items-center gap-3 shadow-xs">
            <div className="bg-yellow-500/15 p-2 rounded-xl text-yellow-800 font-bold text-xs font-grotesk">Total</div>
            <div>
              <p className="text-[10px] text-[#9A9690] font-bold uppercase tracking-widest leading-none mb-1 font-grotesk">Reviews</p>
              <p className="text-xl font-black text-[#1C1A16] leading-none font-soria">{reviews.length}</p>
            </div>
          </div>
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-emerald-500/20 flex items-center gap-3 shadow-xs">
            <div className="bg-emerald-500/15 p-2 rounded-xl text-emerald-800 font-bold text-xs font-grotesk">🌱 Dandruff</div>
            <div>
              <p className="text-[10px] text-emerald-700/70 font-bold uppercase tracking-widest leading-none mb-1 font-grotesk">Reviews</p>
              <p className="text-xl font-black text-emerald-900 leading-none font-soria">{dandruffCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-yellow-500/12 pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-5 py-2.5 rounded-xl font-bold font-grotesk text-xs uppercase tracking-wider transition-all ${
            activeTab === "all"
              ? "bg-yellow-500 text-black shadow-sm"
              : "bg-white text-[#6C685F] hover:bg-yellow-50 border border-yellow-500/10"
          }`}
        >
          All Feedback ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab("hair_oil")}
          className={`px-5 py-2.5 rounded-xl font-bold font-grotesk text-xs uppercase tracking-wider transition-all ${
            activeTab === "hair_oil"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-white text-[#6C685F] hover:bg-yellow-50 border border-yellow-500/10"
          }`}
        >
          Hair Oil Reviews ({hairOilCount})
        </button>
        <button
          onClick={() => setActiveTab("dandruff")}
          className={`px-5 py-2.5 rounded-xl font-bold font-grotesk text-xs uppercase tracking-wider transition-all ${
            activeTab === "dandruff"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white text-[#6C685F] hover:bg-emerald-50 border border-emerald-500/20"
          }`}
        >
          🌿 Dandruff Section Reviews ({dandruffCount})
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="py-32 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-yellow-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[#6C685F] text-sm font-bold uppercase tracking-widest font-grotesk">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-yellow-500/30">
            <svg className="w-16 h-16 text-yellow-600/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <p className="text-[#1C1A16] text-lg font-bold font-grotesk mb-1">No feedback received in this section</p>
            <p className="text-[#6C685F] text-sm font-inter">Customer reviews will appear here once submitted.</p>
          </div>
        ) : (
          filteredReviews.map((review) => {
            const isDandruff = review.category === "dandruff";
            return (
              <div key={review._id} className={`bg-white p-7 rounded-3xl border shadow-card relative overflow-hidden group hover:shadow-card-hover transition-all duration-300 ${isDandruff ? "border-emerald-500/20" : "border-yellow-500/12"}`}>
                <div className="flex flex-col md:flex-row justify-between gap-8 items-start">
                  <div className="flex-1 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold font-grotesk shadow-sm ${isDandruff ? "bg-gradient-to-br from-emerald-600 to-teal-800" : "bg-gradient-to-br from-yellow-600 to-amber-700"}`}>
                        {review.name ? review.name[0].toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[#1C1A16] text-lg font-grotesk group-hover:text-yellow-700 transition-colors">{review.name}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-grotesk border ${isDandruff ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-amber-50 text-amber-800 border-amber-300"}`}>
                            {isDandruff ? "🌿 Dandruff Care" : "✨ Hair Oil"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex text-yellow-500 text-sm">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < (review.rating || 5) ? "★" : "☆"}</span>
                            ))}
                          </div>
                          <span className="text-[10px] text-[#9A9690] font-bold uppercase tracking-wider font-grotesk">• {new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-800/60 mb-1.5 block font-grotesk">Customer Feedback</span>
                      <p className="text-[#4A473E] leading-relaxed text-base font-inter">&ldquo;{review.comment}&rdquo;</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-yellow-500/10">
                      <div className="bg-[#FDFBF7] px-3.5 py-1.5 rounded-xl border border-yellow-500/15">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A9690] font-grotesk block">Category / Product</span>
                        <span className="text-xs text-yellow-800 font-bold font-grotesk uppercase">{isDandruff ? "Dandruff Scalp Care Formula" : (review.product?.name || "Herbal Hair Oil SKU")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-4 items-center md:items-end w-full md:w-auto">
                    {review.image && (
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border border-yellow-500/15 overflow-hidden bg-[#FDFBF7] p-1 flex-shrink-0">
                        <img
                          src={review.image.startsWith("data:") || review.image.startsWith("http") ? review.image : `${BASE_URL.replace(/\/api$/, "")}${review.image}`}
                          alt="Review Attachment"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(review._id, review.category)}
                      className="flex-1 md:flex-none px-5 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold font-grotesk uppercase text-xs tracking-wider hover:bg-red-100 transition-all shadow-xs"
                    >
                      Delete Review
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}
