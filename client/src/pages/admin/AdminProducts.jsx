import { API_URL, BASE_URL } from "../../services/api";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../components/Alert";
import AdminLayout from "./AdminLayout";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gstPercentage: 0,
    sizes: [
      { size: "100ml", mrp: 0, price: 0, stock: 0 },
      { size: "200ml", mrp: 0, price: 0, stock: 0 },
      { size: "500ml", mrp: 0, price: 0, stock: 0 },
    ],
    images: [],      // Array of File objects
    imageUrls: [],   // Array of display URLs
    isActive: true,
  });

  // Banners State
  const [banners, setBanners] = useState([]);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [isSubmittingBanner, setIsSubmittingBanner] = useState(false);
  const [bannerFormData, setBannerFormData] = useState({
    title: "Website Launching Offer",
    subtitle: "200ml Launch Deal - Save Big!",
    linkUrl: "#product"
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      addToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const fetchBanners = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${API_URL}/banners/admin`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setBanners(data.banners);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchProducts();
    fetchBanners();
  }, [navigate, fetchProducts, fetchBanners]);

  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerFile) {
      addToast("Please select an offer banner image to upload", "warning");
      return;
    }

    setIsSubmittingBanner(true);
    const token = localStorage.getItem("adminToken");
    const fd = new FormData();
    fd.append("title", bannerFormData.title);
    fd.append("subtitle", bannerFormData.subtitle);
    fd.append("linkUrl", bannerFormData.linkUrl);
    fd.append("image", bannerFile);

    try {
      const res = await fetch(`${API_URL}/banners`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (res.ok || data.success) {
        addToast("Offer banner uploaded & published to home page! 🚀", "success");
        setShowBannerModal(false);
        setBannerFile(null);
        setBannerPreview(null);
        setBannerFormData({ title: "Website Launching Offer", subtitle: "200ml Launch Deal - Save Big!", linkUrl: "#product" });
        fetchBanners();
      } else {
        addToast(data.message || "Failed to upload banner", "error");
      }
    } catch (err) {
      console.error("Banner upload error:", err);
      addToast("Failed to upload offer banner", "error");
    } finally {
      setIsSubmittingBanner(false);
    }
  };

  const handleToggleBanner = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/banners/${id}/toggle`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        addToast(data.message, "success");
        fetchBanners();
      } else addToast("Failed to update status", "error");
    } catch { addToast("Error updating banner status", "error"); }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer banner?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_URL}/banners/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        addToast("Offer banner deleted successfully", "success");
        fetchBanners();
      } else addToast("Failed to delete banner", "error");
    } catch { addToast("Error deleting banner", "error"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("sizes", JSON.stringify(formData.sizes));
    submitData.append("gstPercentage", formData.gstPercentage);
    submitData.append("isActive", formData.isActive);

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach(file => {
        submitData.append("images", file);
      });
    }

    try {
      const url = editingProduct
        ? `${API_URL}/products/${editingProduct._id}`
        : `${API_URL}/products`;

      const response = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: submitData,
      });

      const data = await response.json();
      if (data.success) {
        addToast(editingProduct ? "Product updated successfully" : "Product created successfully", "success");
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        addToast(data.message || "Operation failed", "error");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      addToast("Failed to save product", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      const data = await response.json();
      if (data.success) {
        addToast("Product deleted successfully", "success");
        fetchProducts();
      } else {
        addToast("Failed to delete product", "error");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      addToast("Failed to delete product", "error");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      gstPercentage: product.gstPercentage || 0,
      sizes: product.sizes,
      images: [],
      imageUrls: product.images || [],
      isActive: product.isActive,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      gstPercentage: 0,
      sizes: [
        { size: "100ml", mrp: 0, price: 0, stock: 0 },
        { size: "200ml", mrp: 0, price: 0, stock: 0 },
        { size: "500ml", mrp: 0, price: 0, stock: 0 },
      ],
      images: [],
      imageUrls: [],
      isActive: true,
    });
  };

  const updateSize = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = (field === "size" || value === "") ? value : Number(value);
    setFormData({ ...formData, sizes: newSizes });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: "", mrp: 0, price: 0, offerPrice: null, stock: 0 }]
    });
  };

  const removeSize = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes });
  };

  return (
    <AdminLayout>
      {loading ? (
        <div className="py-24 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-yellow-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#6C685F] font-inter text-sm">Loading product catalog...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A16] mb-1 font-soria">Product & Banner Management</h1>
              <p className="text-[#6C685F] text-sm font-inter">Manage herbal oil inventory & upload homepage promotional offer banners</p>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowBannerModal(true)}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold font-grotesk rounded-xl shadow-gold hover:shadow-gold-lg transition-all flex items-center gap-2 uppercase tracking-wider text-xs"
              >
                <span>🔥 Upload Offer Banner</span>
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-extrabold font-grotesk rounded-xl shadow-gold hover:shadow-gold-lg transition-all flex items-center gap-2 uppercase tracking-wider text-xs"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* ══ OFFER BANNERS MANAGEMENT SECTION ════════════════════ */}
          <div className="mb-12 bg-white p-7 rounded-3xl border border-yellow-500/20 shadow-card">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-yellow-500/12 pb-5 mb-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-yellow-500/15 text-yellow-800 text-[10px] font-extrabold font-grotesk uppercase tracking-widest inline-block mb-1">
                  🔥 Promotional Banners
                </span>
                <h3 className="text-2xl font-bold text-[#1C1A16] font-soria">Homepage Launch Offer Banners</h3>
                <p className="text-[#6C685F] text-xs font-inter mt-0.5">Upload launch offers & discount banners to display on the live website</p>
              </div>
              <button
                onClick={() => setShowBannerModal(true)}
                className="px-4 py-2 bg-yellow-500/15 text-yellow-900 border border-yellow-500/30 rounded-xl font-bold font-grotesk text-xs uppercase tracking-wider hover:bg-yellow-500/25 transition-colors"
              >
                + Add Offer Poster
              </button>
            </div>

            {banners.length === 0 ? (
              <div className="text-center py-10 bg-[#FDFBF7] rounded-2xl border border-dashed border-yellow-500/30">
                <p className="text-sm text-[#6C685F] font-inter mb-3">No promotional offer banners uploaded yet.</p>
                <button
                  onClick={() => setShowBannerModal(true)}
                  className="px-5 py-2 bg-yellow-500 text-black font-bold font-grotesk text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-400"
                >
                  Upload Offer Poster Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((b) => (
                  <div key={b._id} className="bg-[#FDFBF7] rounded-2xl border border-yellow-500/20 overflow-hidden shadow-sm flex flex-col justify-between group">
                    <div className="relative h-48 bg-black/5 overflow-hidden p-2 flex items-center justify-center">
                      <img
                        src={b.image.startsWith("data:") || b.image.startsWith("http") ? b.image : `${BASE_URL.replace(/\/api$/, "")}${b.image}`}
                        alt={b.title}
                        className="max-h-full max-w-full object-contain"
                      />
                      <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase font-grotesk tracking-wider border shadow-xs ${b.isActive ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-gray-100 text-gray-700 border-gray-300"}`}>
                        {b.isActive ? "● Active on Website" : "○ Hidden"}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 font-inter border-t border-yellow-500/10 bg-white">
                      <h4 className="font-bold text-[#1C1A16] text-base font-grotesk leading-snug">{b.title}</h4>
                      <p className="text-xs text-[#6C685F] line-clamp-1">{b.subtitle}</p>

                      <div className="pt-3 flex items-center justify-between gap-2 border-t border-yellow-500/10">
                        <button
                          onClick={() => handleToggleBanner(b._id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold font-grotesk uppercase tracking-wider transition-colors ${
                            b.isActive
                              ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                              : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                          }`}
                        >
                          {b.isActive ? "Hide Banner" : "Show on Website"}
                        </button>

                        <button
                          onClick={() => handleDeleteBanner(b._id)}
                          className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-[11px] font-bold font-grotesk uppercase tracking-wider transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Products Section Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#1C1A16] font-soria">Product Catalog Items</h3>
            <p className="text-[#6C685F] text-xs font-inter mt-0.5">Manage bottle sizes, pricing, MRP discounts, and inventory stock</p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between ${
                  !product.isActive ? "opacity-75 border-gray-200" : "border-yellow-500/12"
                }`}
              >
                <div>
                  <div className="relative h-64 bg-gradient-to-b from-[#FDFBF7] to-[#F5F2EB] p-4 flex items-center justify-center border-b border-yellow-500/10 group">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].startsWith("data:") || product.images[0].startsWith("http") ? product.images[0] : `${BASE_URL.replace(/\/api$/, "")}${product.images[0]}`}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-4xl text-yellow-600/30 font-soria">Kala Agalya</div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase font-grotesk tracking-widest ${
                        product.isActive ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}>
                        {product.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1C1A16] font-grotesk mb-2">{product.name}</h3>
                    <p className="text-[#6C685F] text-xs font-inter line-clamp-2 mb-4 leading-relaxed">{product.description}</p>

                    <div className="space-y-2 border-t border-yellow-500/10 pt-4">
                      <span className="text-[10px] font-extrabold text-yellow-800 uppercase tracking-widest block font-grotesk">Sizes & Pricing</span>
                      <div className="grid grid-cols-1 gap-2">
                        {product.sizes.map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-[#FDFBF7] px-3.5 py-2 rounded-xl text-xs font-inter border border-yellow-500/10">
                            <span className="font-bold text-[#1C1A16] font-grotesk">{s.size}</span>
                            <div className="flex items-center gap-2">
                              {s.mrp && s.mrp > s.price && (
                                <span className="line-through text-[#9A9690] text-[11px]">₹{s.mrp}</span>
                              )}
                              <span className="font-bold text-yellow-800 font-grotesk text-sm">₹{s.price}</span>
                              <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-grotesk">Stock: {s.stock}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 px-4 py-2.5 bg-yellow-50 text-yellow-900 border border-yellow-200 rounded-xl text-xs font-bold font-grotesk uppercase tracking-wider hover:bg-yellow-100 transition-colors text-center"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold font-grotesk uppercase tracking-wider hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-yellow-500/30">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <p className="text-[#6C685F] mb-3 font-inter text-sm">No products found in inventory.</p>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="text-yellow-800 font-bold underline font-grotesk uppercase tracking-wider text-xs"
              >
                Add your first product
              </button>
            </div>
          )}

          {/* Add/Edit Product Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 z-[60] animate-fadeIn overflow-y-auto">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-auto border border-yellow-500/20 relative overflow-hidden">
                <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-yellow-500/12 px-6 py-4 flex justify-between items-center z-10">
                  <h2 className="text-xl font-bold text-[#1C1A16] font-grotesk tracking-wide">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-[#9A9690] hover:text-red-600 transition-colors p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 font-inter">
                  <div>
                    <label className="block text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2 font-grotesk">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-premium"
                      placeholder="e.g. Kala Agalya Herbal Hair Oil"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2 font-grotesk">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-premium h-24 resize-none"
                      placeholder="Describe the product benefits..."
                      required
                    />
                  </div>

                  {/* GST Percentage */}
                  <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-yellow-500/12">
                    <label className="block text-xs font-bold text-yellow-800 uppercase tracking-wider mb-3 font-grotesk">GST Percentage (%)</label>
                    <div className="flex gap-2.5 flex-wrap">
                      {[0, 5, 12, 18, 28].map(gst => (
                        <button
                          key={gst}
                          type="button"
                          onClick={() => setFormData({ ...formData, gstPercentage: gst })}
                          className={`px-4 py-2 rounded-xl text-xs font-bold font-grotesk border transition-all ${
                            formData.gstPercentage === gst
                              ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black border-yellow-500 shadow-gold'
                              : 'bg-white text-[#6C685F] border-yellow-500/20 hover:border-yellow-500/50 hover:text-[#1C1A16]'
                          }`}
                        >
                          {gst}%
                        </button>
                      ))}
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.gstPercentage}
                        onChange={(e) => setFormData({ ...formData, gstPercentage: Number(e.target.value) })}
                        className="w-20 px-3 py-2 bg-white border border-yellow-500/20 rounded-xl text-[#1C1A16] text-xs outline-none focus:border-yellow-600 text-center font-bold font-grotesk"
                        placeholder="Custom"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2 font-grotesk">Product Images (Up to 5)</label>
                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) {
                            setFormData({
                              ...formData,
                              images: [...formData.images, ...files].slice(0, 5),
                              imageUrls: [...formData.imageUrls, ...files.map(f => URL.createObjectURL(f))].slice(0, 5)
                            });
                          }
                        }}
                        className="block w-full text-xs text-[#6C685F] file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-yellow-500/10 file:text-yellow-800 hover:file:bg-yellow-500/20 transition-all cursor-pointer font-grotesk"
                      />
                      {(formData.imageUrls.length > 0) && (
                        <div className="flex flex-wrap gap-3">
                          {formData.imageUrls.map((url, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-2xl border border-yellow-500/20 overflow-hidden bg-[#FDFBF7] flex-shrink-0 group p-1">
                              <img
                                src={url.startsWith("blob") || url.startsWith("http") || url.startsWith("data:image") ? url : `${BASE_URL.replace(/\/api$/, "")}${url}`}
                                alt={`Preview ${idx}`}
                                className="w-full h-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newUrls = formData.imageUrls.filter((_, i) => i !== idx);
                                  const newImages = formData.images.filter((_, i) => i !== idx);
                                  setFormData({ ...formData, imageUrls: newUrls, images: newImages });
                                }}
                                className="absolute inset-0 bg-red-600/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl text-xs font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-xs font-bold text-yellow-800 uppercase tracking-wider font-grotesk">Sizes & Pricing</label>
                      <button
                        type="button"
                        onClick={addSize}
                        className="text-xs font-bold text-yellow-700 hover:text-yellow-900 font-grotesk flex items-center gap-1"
                      >
                        + Add Size Variant
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.sizes.map((s, idx) => (
                        <div key={idx} className="bg-[#FDFBF7] p-4 rounded-2xl border border-yellow-500/12 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                          <div>
                            <span className="text-[10px] font-bold text-gray-500 block mb-1 font-grotesk uppercase">Size</span>
                            <input
                              type="text"
                              value={s.size}
                              onChange={(e) => updateSize(idx, "size", e.target.value)}
                              placeholder="e.g. 100ml"
                              className="w-full px-3 py-2 bg-white border border-yellow-500/20 rounded-xl text-xs font-bold font-grotesk"
                              required
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-500 block mb-1 font-grotesk uppercase">MRP (₹)</span>
                            <input
                              type="number"
                              value={s.mrp || ""}
                              onChange={(e) => updateSize(idx, "mrp", e.target.value)}
                              placeholder="MRP"
                              className="w-full px-3 py-2 bg-white border border-yellow-500/20 rounded-xl text-xs font-bold font-grotesk"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-500 block mb-1 font-grotesk uppercase">Selling Price (₹)</span>
                            <input
                              type="number"
                              value={s.price || ""}
                              onChange={(e) => updateSize(idx, "price", e.target.value)}
                              placeholder="Price"
                              className="w-full px-3 py-2 bg-white border border-yellow-500/20 rounded-xl text-xs font-bold font-grotesk"
                              required
                            />
                          </div>
                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <span className="text-[10px] font-bold text-gray-500 block mb-1 font-grotesk uppercase">Stock</span>
                              <input
                                type="number"
                                value={s.stock || 0}
                                onChange={(e) => updateSize(idx, "stock", e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-yellow-500/20 rounded-xl text-xs font-bold font-grotesk"
                              />
                            </div>
                            {formData.sizes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSize(idx)}
                                className="mt-4 p-2 text-red-600 hover:bg-red-50 rounded-xl"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

              <div className="flex items-center gap-3 bg-[#FDFBF7] p-4 rounded-2xl border border-yellow-500/12">
                <input
                  type="checkbox"
                  id="active-check"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 accent-yellow-600 rounded cursor-pointer"
                />
                <label htmlFor="active-check" className="text-xs font-bold text-[#1C1A16] cursor-pointer uppercase tracking-wider font-grotesk">Set Product as Active</label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 font-grotesk">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 bg-[#F5F2EB] text-[#6C685F] border border-yellow-500/20 rounded-xl font-bold hover:bg-yellow-500/10 transition-colors text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-xl font-bold hover:from-yellow-400 hover:to-amber-500 transition-all text-xs uppercase tracking-wider shadow-gold"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </AdminLayout>
  );
}


