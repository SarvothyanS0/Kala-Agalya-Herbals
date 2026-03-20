const API_URL = "https://kala-agalya-herbals.onrender.com/api";

export const createOrder = async (orderData) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  });
  const data = await res.json();
  
  // Storing the ID for the next payment step
  if (data.success && data.order && data.order._id) {
    localStorage.setItem("lastOrderId", data.order._id);
  }
  
  return data;
};
