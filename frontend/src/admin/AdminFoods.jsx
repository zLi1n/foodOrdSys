import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [types, setTypes] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    food_type_id: "",
    description: "",
    stock_quantity: ""
  });

  useEffect(() => {
    api.get("/admin/foods").then(res => setFoods(res.data)); // admin list
    api.get("/food-types").then(res => setTypes(res.data));
  }, []);

  const resetForm = () => {
    setForm({ name: "", price: "", food_type_id: "", description: "", stock_quantity: "" });
    setImage(null);
    setEditing(null);
  };

  const submitFood = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("food_type_id", form.food_type_id);
      formData.append("description", form.description);
      formData.append("stock_quantity", form.stock_quantity);
      if (image) formData.append("image", image);

      let res;
      if (editing) {
        res = await api.post(`/admin/foods/${editing.id}?_method=PUT`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        setFoods(foods.map(f => f.id === editing.id ? res.data : f));
      } else {
        res = await api.post("/admin/foods", formData, { headers: { "Content-Type": "multipart/form-data" } });
        setFoods([...foods, res.data]);
      }

      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save food");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (f) => {
    setEditing(f);
    setForm({
      name: f.name || "",
      price: f.price || "",
      food_type_id: f.food_type_id || "",
      description: f.description || "",
      stock_quantity: f.stock_quantity ?? ""
    });
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeFood = async (id) => {
    if (!confirm("Delete this food item?")) return;
    try {
      await api.delete(`/admin/foods/${id}`);
      setFoods(foods.filter(f => f.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete food");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 18 }}>Admin Foods</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20 }}>
        {/* List */}
        <div>
          <div style={{ marginBottom: 12, color: "#666" }}>Total foods: {foods.length}</div>
          <div style={{ display: "grid", gap: 12 }}>
            {foods.map(f => (
              <div key={f.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, border: "1px solid #eee", borderRadius: 8, background: "white" }}>
                <div style={{ width: 80, height: 60, background: "#f3f4f6", borderRadius: 6, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {f.image_url ? <img src={f.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#999" }}>No Image</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{f.name}</div>
                  <div style={{ color: "#27ae60", fontWeight: 700 }}>RM {parseFloat(f.price).toFixed(2)}</div>
                  <div style={{ color: "#666", fontSize: 13 }}>{f.description || "-"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ marginBottom: 8 }}>
                    {f.stock_quantity !== null ? <span style={{ color: "#333" }}>Stock: {f.stock_quantity}</span> : <span style={{ color: "#999" }}>Unlimited</span>}
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => startEdit(f)} style={{ padding: "6px 10px", background: "#3498db", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Edit</button>
                    <button onClick={() => removeFood(f.id)} style={{ padding: "6px 10px", background: "#e74c3c", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ background: "white", padding: 16, borderRadius: 8, border: "1px solid #eee" }}>
          <h3 style={{ marginTop: 0 }}>{editing ? "Edit Food" : "Add Food"}</h3>

          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: "95%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Price</label>
            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={{ width: "95%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Type</label>
            <select value={form.food_type_id} onChange={e => setForm({ ...form, food_type_id: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
              <option value="">Select type</option>
              {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: "95%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} rows={3} />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Stock Quantity (leave blank for unlimited)</label>
            <input type="number" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })} style={{ width: "95%", padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Image</label>
            <input type="file" onChange={e => setImage(e.target.files[0])} />
            {image && <div style={{ marginTop: 8 }}><small>{image.name}</small></div>}
            {editing?.image_url && !image && <div style={{ marginTop: 8 }}><img src={editing.image_url} width="120" style={{ borderRadius: 6 }} alt="current" /></div>}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submitFood} disabled={loading} style={{ flex: 1, padding: 10, background: loading ? "#95a5a6" : "#27ae60", color: "white", border: "none", borderRadius: 6, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Saving..." : editing ? "Update Food" : "Add Food"}</button>
            <button onClick={resetForm} style={{ padding: 10, background: "#95a5a6", color: "white", border: "none", borderRadius: 6 }}>{editing ? "Cancel" : "Clear"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
