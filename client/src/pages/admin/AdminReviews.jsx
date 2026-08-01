import { API_URL, BASE_URL } from "../../services/api";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../components/Alert";
import AdminLayout from "./AdminLayout";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async (id) => {
    if (!window.confirm("CRITICAL: Are you sure you want to delete this review? This action cannot be undone.")) return;

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
        addToast("Review deleted successfully", "success");
        fetchReviews();
      } else {
        addToast("Failed to delete review", "error");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      addToast("Failed to delete review", "error");
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A16] mb-1 font-soria">Review Moderation</h1>
          <p className="text-[#6C685F] text-sm font-inter">Monitor and manage customer feedback across products</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl border border-yellow-500/12 flex items-center gap-3.5 shadow-xs">
          <div className="bg-yellow-500/15 p-2 rounded-xl">
            <svg className="w-5 h-5 text-yellow-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
          <div>
            <p className="text-[10px] text-[#9A9690] font-bold uppercase tracking-widest leading-none mb-1 font-grotesk">Total Reviews</p>
            <p className="text-2xl font-black text-[#1C1A16] leading-none font-soria">{reviews.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="py-32 text-center">
            <div className="animate-spin h-10 w-10 border-4 border-yellow-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[#6C685F] text-sm font-bold uppercase tracking-widest font-grotesk">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-yellow-500/30">
            <svg className="w-16 h-16 text-yellow-600/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <p className="text-[#1C1A16] text-lg font-bold font-grotesk mb-1">No feedback received yet</p>
            <p className="text-[#6C685F] text-sm font-inter">Customer reviews will appear here once submitted.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white p-7 rounded-3xl border border-yellow-500/12 shadow-card relative overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between gap-8 items-start">
                <div className="flex-1 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-2xl flex items-center justify-center text-white text-lg font-bold font-grotesk shadow-sm">
                      {review.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1C1A16] text-lg font-grotesk group-hover:text-yellow-700 transition-colors">{review.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex text-yellow-500 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A9690] font-grotesk block">Associated Product</span>
                      <span className="text-xs text-yellow-800 font-bold font-grotesk uppercase">{review.product?.name || "Herbal Oil SKU"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-4 items-center md:items-end w-full md:w-auto">
                  {review.image && (
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border border-yellow-500/15 overflow-hidden bg-[#FDFBF7] p-1 flex-shrink-0">
                      <img
                        src={`${BASE_URL.replace(/\/api$/, "")}${review.image}`}
                        alt="Review Attachment"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold font-grotesk uppercase text-xs tracking-wider hover:bg-red-100 transition-all shadow-xs"
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
