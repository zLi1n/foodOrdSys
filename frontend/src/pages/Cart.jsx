import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/cart/items").then(res => {
      setItems(res.data);

      if (res.data.length > 0) {
        setOrderId(res.data[0].order_id);
      }
    });
  }, []);

  const updateQty = async (itemId, qty) => {
    if (qty < 1) return;

    try {
      const res = await api.put(`/cart/items/${itemId}`, {
        quantity: qty
      });

      setItems(items =>
        items.map(i => (i.id === itemId ? res.data : i))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (itemId) => {
    if (!confirm("Remove item from cart?")) return;

    await api.delete(`/cart/items/${itemId}`);
    setItems(items => items.filter(i => i.id !== itemId));
  };

  const totalAmount = items.reduce(
    (sum, i) => sum + i.quantity * parseFloat(i.food.price),
    0
  );

  const placeOrder = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      await api.post(`/orders/${orderId}/confirm`);
      alert("Order placed successfully");
      setItems([]);
      setOrderId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "30px", fontSize: "28px" }}>Shopping Cart</h2>

      {items.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          color: "#666"
        }}>
          <p style={{ fontSize: "16px" }}>Your cart is empty</p>
        </div>
      )}

      {/* Cart Items */}
      <div style={{ marginBottom: "30px" }}>
        {items.map(i => (
          <div
            key={i.id}
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "flex-start",
              marginBottom: "15px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e0e0e0"
            }}
          >
            {/* Image Container - Fixed width to maintain alignment */}
            <div style={{
              width: "100px",
              height: "100px",
              backgroundColor: "#ecf0f1",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              {i.food.image_url ? (
                <img 
                  src={i.food.image_url} 
                  width="100%" 
                  height="100%"
                  style={{ objectFit: "cover", borderRadius: "6px" }}
                />
              ) : (
                <span style={{ color: "#999", fontSize: "12px" }}>No Image</span>
              )}
            </div>

            {/* Info Section */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 8px 0" }}>
                  {i.food.name}
                </p>
                <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>
                  Price: <span style={{ fontWeight: "bold", color: "#27ae60" }}>RM {parseFloat(i.food.price).toFixed(2)}</span>
                </p>
                {i.additional_notes && (
                  <p style={{ margin: "4px 0", color: "#888", fontSize: "12px", fontStyle: "italic" }}>
                    Note: {i.additional_notes}
                  </p>
                )}
                <p style={{ margin: "8px 0", fontSize: "14px", fontWeight: "bold", color: "#2c3e50" }}>
                  Subtotal: RM {(i.quantity * parseFloat(i.food.price)).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "white",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ddd"
            }}>
              <button 
                onClick={() => updateQty(i.id, i.quantity - 1)}
                style={{
                  width: "32px",
                  height: "32px",
                  padding: "0",
                  backgroundColor: "#ecf0f1",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
              >
                −
              </button>
              <span style={{ width: "30px", textAlign: "center", fontWeight: "bold" }}>
                {i.quantity}
              </span>
              <button 
                onClick={() => updateQty(i.id, i.quantity + 1)}
                style={{
                  width: "32px",
                  height: "32px",
                  padding: "0",
                  backgroundColor: "#ecf0f1",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold"
                }}
              >
                +
              </button>
            </div>

            {/* Delete Button */}
            <button 
              onClick={() => removeItem(i.id)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px"
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      {items.length > 0 && (
        <div style={{
          backgroundColor: "#ecf0f1",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#2c3e50"
          }}>
            <span>Total Amount:</span>
            <span style={{ fontSize: "24px", color: "#27ae60" }}>
              RM {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Place Order Button */}
      {items.length > 0 && (
        <button
          onClick={placeOrder}
          disabled={!orderId || loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: orderId && !loading ? "#27ae60" : "#95a5a6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: orderId && !loading ? "pointer" : "not-allowed",
            transition: "background-color 0.3s ease"
          }}
        >
          {loading ? "Placing Order..." : "Confirm Order"}
        </button>
      )}
    </div>
  );
}
