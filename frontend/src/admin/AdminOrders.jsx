import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/admin/orders").then(res => setOrders(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    setOrders(prev =>
      prev.map(o => o.id === id ? { ...o, status } : o)
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f39c12",
      preparing: "#3498db",
      completed: "#27ae60",
      canceled: "#e74c3c"
    };
    return colors[status] || "#95a5a6";
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#2c3e50", marginBottom: "30px", fontSize: "28px", fontWeight: "600" }}>
        Admin Orders
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d", fontSize: "16px" }}>
          No orders found
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {orders.map(order => (
            <div
              key={order.id}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ecf0f1",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "box-shadow 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)"}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "15px" }}>
                <div>
                  <h3 style={{ color: "#2c3e50", margin: "0 0 10px 0", fontSize: "18px" }}>
                    Order #{order.id}
                  </h3>
                  <p style={{ margin: "5px 0", color: "#34495e" }}>
                    <strong>Customer:</strong> {order.user?.name}
                  </p>
                  <p style={{ margin: "5px 0", color: "#34495e" }}>
                    <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()} 
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "5px 0", fontSize: "24px", fontWeight: "600", color: "#27ae60" }}>
                    RM {Number(order.total_amount).toFixed(2)}
                  </p>
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: getStatusColor(order.status),
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      marginTop: "10px",
                      textTransform: "uppercase"
                    }}
                  >
                    {order.status}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #ecf0f1", paddingTop: "15px", marginBottom: "15px" }}>
                <p style={{ color: "#2c3e50", fontWeight: "600", marginBottom: "10px" }}>Items:</p>
                <div style={{ display: "grid", gap: "8px" }}>
                  {order.items?.map(item => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "5px",
                        fontSize: "14px"
                      }}
                    >
                      <span>{item.food?.name}</span>
                      <span style={{ color: "#7f8c8d" }}>
                        x{item.quantity} @ RM {Number(item.food?.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: "1px solid #ecf0f1", paddingTop: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#2c3e50", fontWeight: "600", fontSize: "14px" }}>
                  Update Status:
                </label>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #bdc3c7",
                    borderRadius: "5px",
                    fontSize: "14px",
                    backgroundColor: "#fff",
                    color: "#2c3e50",
                    cursor: "pointer",
                    transition: "border-color 0.3s ease"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3498db"}
                  onBlur={(e) => e.target.style.borderColor = "#bdc3c7"}
                >
                  <option value="preparing">Preparing</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
