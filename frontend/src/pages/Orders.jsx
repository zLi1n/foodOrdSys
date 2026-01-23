import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    api.get("/orders").then(res => setOrders(res.data));
  }, []);

  const getFirstImage = (order) => {
    if (!order.items) return null;
    const item = order.items.find(i => i.image_url);
    return item?.image_url || null;
  };

  const getItemsSummary = (order) => {
    if (!order.items || order.items.length === 0) return "No items";
    return order.items.map(item => `${item.food_name || 'Unknown'} (×${item.quantity})`).join(", ");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f39c12",
      preparing: "#3498db",
      completed: "#27ae60"
    };
    return colors[status] || "#95a5a6";
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "30px", fontSize: "28px" }}>Order History</h2>

      {orders.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "40px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          color: "#666"
        }}>
          <p style={{ fontSize: "16px" }}>No orders yet</p>
        </div>
      ) : (
        <div>
          {orders.map(order => {
            const firstImage = getFirstImage(order);
            const itemsSummary = getItemsSummary(order);
            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                  padding: "15px",
                  marginBottom: "15px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  hover: { backgroundColor: "#ecf0f1" }
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#ecf0f1"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#f8f9fa"}
              >
                {/* Order Image */}
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
                  {firstImage ? (
                    <img 
                      src={firstImage} 
                      width="100%" 
                      height="100%"
                      style={{ objectFit: "cover", borderRadius: "6px" }}
                    />
                  ) : (
                    <span style={{ color: "#999", fontSize: "12px" }}>No Image</span>
                  )}
                </div>

                {/* Order Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 8px 0" }}>
                    Order #{order.id}
                  </p>
                  <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>
                    Items: {itemsSummary}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "12px", color: "#999" }}>
                    {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>

                {/* Total & Status */}
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "18px", fontWeight: "bold", color: "#27ae60", margin: "0 0 8px 0" }}>
                    RM {parseFloat(order.total_amount).toFixed(2)}
                  </p>
                  <p style={{
                    padding: "6px 12px",
                    backgroundColor: getStatusColor(order.status),
                    color: "white",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    margin: "0",
                    textTransform: "capitalize"
                  }}>
                    {order.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "1000"
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "30px",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            position: "relative"
          }}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                fontSize: "18px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              ×
            </button>

            {/* Order Title */}
            <h2 style={{ marginTop: "0", marginBottom: "20px", fontSize: "24px" }}>
              Order #{selectedOrder.id}
            </h2>

            {/* Order Header Info */}
            <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
              <p style={{ margin: "8px 0" }}>
                <strong>Status:</strong> <span style={{ 
                  color: getStatusColor(selectedOrder.status),
                  textTransform: "capitalize",
                  fontWeight: "bold"
                }}>{selectedOrder.status}</span>
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Total Amount:</strong> <span style={{ color: "#27ae60", fontSize: "18px", fontWeight: "bold" }}>
                  RM {parseFloat(selectedOrder.total_amount).toFixed(2)}
                </span>
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Order Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()} {new Date(selectedOrder.created_at).toLocaleTimeString()}
              </p>
            </div>

            {/* Order Items */}
            <h3 style={{ marginBottom: "15px", fontSize: "18px" }}>Items:</h3>
            <div style={{ marginBottom: "20px" }}>
              {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px",
                    marginBottom: "10px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  {/* Item Image */}
                  <div style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#ecf0f1",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        width="100%"
                        height="100%"
                        style={{ objectFit: "cover", borderRadius: "6px" }}
                      />
                    ) : (
                      <span style={{ color: "#999", fontSize: "11px", textAlign: "center" }}>No Img</span>
                    )}
                  </div>

                  {/* Item Details */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "14px", fontWeight: "bold", margin: "0 0 4px 0" }}>
                      {item.food_name || 'Unknown Item'}
                    </p>
                    <p style={{ fontSize: "12px", margin: "2px 0", color: "#666" }}>
                      Qty: <span style={{ fontWeight: "bold" }}>{item.quantity}</span>
                    </p>
                    <p style={{ fontSize: "12px", margin: "2px 0", color: "#666" }}>
                      Price: <span style={{ fontWeight: "bold" }}>RM {parseFloat(item.price || 0).toFixed(2)}</span>
                    </p>
                    {item.additional_notes && (
                      <p style={{ fontSize: "11px", margin: "4px 0", color: "#888", fontStyle: "italic" }}>
                        Note: {item.additional_notes}
                      </p>
                    )}
                  </div>

                  {/* Subtotal */}
                  <div style={{ textAlign: "right", minWidth: "80px" }}>
                    <p style={{ fontSize: "13px", fontWeight: "bold", margin: "0" }}>
                      RM {(item.quantity * parseFloat(item.price || 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button at Bottom */}
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
