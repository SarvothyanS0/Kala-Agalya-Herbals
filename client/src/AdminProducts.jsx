import { API_URL, BASE_URL } from "./services/api";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "./Alert";
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

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchProducts();
  }, [navigate, fetchProducts]);

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1A16] mb-1 font-soria">Product Management</h1>
          <p className="text-[#6C685F] text-sm font-inter">Create and update your herbal oil inventory</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="group relative px-6 py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-extrabold font-grotesk rounded-xl shadow-gold hover:shadow-gold-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 overflow-hidden w-full sm:w-auto justify-center uppercase tracking-wider text-xs"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="relative z-10">Add New Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-3xl border border-yellow-500/12 overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-56 bg-gradient-to-b from-[#FDFBF7] to-[#F5F2EB] flex items-center justify-center relative overflow-hidden p-6 border-b border-yellow-500/10">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].startsWith("http") || product.images[0].startsWith("data:image") ? product.images[0] : `${BASE_URL.replace(/\/api$/, "")}${product.images[0]}`}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <svg className="w-20 h-20 text-yellow-600/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              <div className="absolute top-4 right-4 z-20">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold font-grotesk tracking-wider uppercase shadow-xs ${product.isActive ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                  {product.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>
            <div className="p-6 relative font-inter">
              <h3 className="text-xl font-bold text-[#1C1A16] mb-1 font-soria group-hover:text-yellow-700 transition-colors">{product.name}</h3>
              <p className="text-xs text-[#6C685F] mb-5 line-clamp-2 h-8">{product.description}</p>

              <div className="space-y-2.5 mb-6 bg-[#FDFBF7] p-4 rounded-2xl border border-yellow-500/12">
                {product.sizes.map((sizeInfo, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-[#1C1A16] font-bold bg-white px-2 py-0.5 rounded border border-yellow-500/10 font-grotesk">{sizeInfo.size}</span>
                    <div className="flex gap-3 items-center">
                      <div className="flex items-center gap-1.5">
                        {sizeInfo.mrp && sizeInfo.mrp > sizeInfo.price && (
                          <span className="text-[#9A9690] line-through text-[10px]">₹{sizeInfo.mrp}</span>
                        )}
                        <span className="text-yellow-800 font-bold font-soria text-sm">₹{sizeInfo.price}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-grotesk uppercase ${sizeInfo.stock < 10 ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-yellow-500/10 text-yellow-800 border border-yellow-500/20'}`}>
                        {sizeInfo.stock} left
                      </span>
                    </div>
                  </div>
                ))}
                {product.gstPercentage > 0 && (
                  <div className="flex justify-between items-center text-[10px] pt-2 border-t border-yellow-500/10 font-grotesk">
                    <span className="text-[#6C685F] uppercase font-bold">GST</span>
                    <span className="text-yellow-800 font-bold">{product.gstPercentage}%</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2 border-t border-yellow-500/10 font-grotesk">
                <button
                  onClick={() => openEditModal(product)}
                  className="flex-1 py-2.5 bg-[#F5F2EB] text-yellow-800 border border-yellow-500/25 rounded-xl text-xs font-bold hover:bg-yellow-500/15 transition-all duration-300 uppercase tracking-wider"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-all duration-300 uppercase tracking-wider"
                >
                  Delete
                </button>
              </div>
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
                            className="absolute inset-0 bg-red-600/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-yellow-500/12">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-xs font-bold text-yellow-800 uppercase tracking-wider font-grotesk">Sizes & Inventory</label>
                  <button
                    type="button"
                    onClick={addSize}
                    className="text-[10px] bg-yellow-500/12 text-yellow-900 border border-yellow-500/30 px-3 py-1 rounded-lg hover:bg-yellow-500 hover:text-black transition-all font-bold uppercase font-grotesk"
                  >
                    + Add Size
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.sizes.map((sizeInfo, index) => (
                    <div key={index} className="space-y-3 p-4 bg-white border border-yellow-500/15 rounded-2xl relative group/size shadow-xs">
                      {formData.sizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSize(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md z-10"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-[#6C685F] uppercase font-bold font-grotesk">Size (e.g. 100ml)</label>
                          <input
                            type="text"
                            value={sizeInfo.size}
                            onChange={(e) => updateSize(index, "size", e.target.value)}
                            className="input-premium py-2 px-3 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6C685F] uppercase font-bold font-grotesk">MRP (₹)</label>
                          <input
                            type="number"
                            value={sizeInfo.mrp || ""}
                            onChange={(e) => updateSize(index, "mrp", e.target.value)}
                            className="input-premium py-2 px-3 text-xs"
                            placeholder="e.g. 249"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-yellow-800 uppercase font-bold font-grotesk">Selling Price (₹)</label>
                          <input
                            type="number"
                            value={sizeInfo.price}
                            onChange={(e) => updateSize(index, "price", e.target.value)}
                            className="input-premium py-2 px-3 text-xs font-bold text-yellow-800"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#6C685F] uppercase font-bold font-grotesk">Stock Qty</label>
                          <input
                            type="number"
                            value={sizeInfo.stock}
                            onChange={(e) => updateSize(index, "stock", e.target.value)}
                            className="input-premium py-2 px-3 text-xs"
                            required
                          />
                        </div>
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


