import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminFoodTypes() {
  const [types, setTypes] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/food-types").then(res => setTypes(res.data));
  }, []);

  const createType = async () => {
    if (!name.trim()) {
      setError("Please enter a food type name");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/admin/food-types", { 
        name, 
      });
      setTypes([...types, res.data]);
      setName("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create food type");
    } finally {
      setLoading(false);
    }
  };

  const updateType = async (id, updatedName) => {
    if (!updatedName.trim()) return;
    setLoading(true);

    try {
      const res = await api.put(`/admin/food-types/${id}`, {
        name: updatedName,
      });

      setTypes(types.map(t => t.id === id ? res.data : t));
      setEditingId(null);
      setName(""); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update food type");
    } finally {
      setLoading(false);
    }
  };


  const deleteType = async (id) => {
    alert("Deleting this food type will also delete all foods under this type and any order items referencing those foods. This action cannot be undone.");
    if (!confirm("Are you sure you want to permanently delete this food type and all associated data?")) return;
    setLoading(true);
    try {
      await api.delete(`/admin/food-types/${id}`);
      setTypes(types.filter(t => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete food type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "30px", fontSize: "28px" }}>Food Types Management</h2>

      {error && (
        <div style={{
          backgroundColor: "#fee",
          color: "#c33",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "20px",
          fontSize: "14px",
          border: "1px solid #fcc"
        }}>
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      <div style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "30px",
        border: "1px solid #e0e0e0"
      }}>
        <h3 style={{ marginTop: "0", marginBottom: "15px" }}>
          {editingId ? "Edit Food Type" : "Add New Food Type"}
        </h3>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Name *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Rice, Noodles, Beverages"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => {
              if (editingId) {
                updateType(editingId, name);
              } else {
                createType();
              }
            }}
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: loading ? "#95a5a6" : "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold"
            }}
          >
            {loading ? "Saving..." : editingId ? "Update" : "Add Type"}
          </button>
          {editingId && (
            <button 
              onClick={() => {
                setEditingId(null);
                setName("");
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Food Types Table */}
      <div>
        <h3 style={{ marginBottom: "15px" }}>All Food Types ({types.length})</h3>
        {types.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            color: "#666"
          }}>
            No food types yet. Create one above!
          </div>
        ) : (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#2c3e50", color: "white" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Name</th>               
                <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map((t, idx) => (
                <tr 
                  key={t.id}
                  style={{
                    borderBottom: "1px solid #e0e0e0",
                    backgroundColor: idx % 2 === 0 ? "#f8f9fa" : "white"
                  }}
                >
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{t.name}</td>
                 
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <button
                      onClick={() => {
                        setEditingId(t.id);
                        setName(t.name);
                      }}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#3498db",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "8px",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteType(t.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
