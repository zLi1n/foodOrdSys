import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

export default function Foods() {
  const [foodTypes, setFoodTypes] = useState([]);
  const [activeType, setActiveType] = useState(null);
  const typeRefs = useRef({});

  useEffect(() => {
    api.get("/foods").then(res => {
      setFoodTypes(res.data);
      if (res.data.length > 0) {
      setActiveType("all");
    }
    });
  }, []);

  const addToCart = async (food_id) => {
    try {
      await api.post("/cart/items", { food_id, quantity: 1 });
      alert("Added to cart!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const scrollToType = (typeId) => {
    setActiveType(typeId);
    typeRefs.current[typeId]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Menu</h1>

      {/* Sub Navigation for Food Types */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "30px",
        overflowX: "auto",
        paddingBottom: "10px",
        borderBottom: "2px solid #ecf0f1"
      }}>
        <button onClick={() => setActiveType("all")}
        style={{
          padding: "10px 20px",
          backgroundColor: activeType === "all" ? "#3498db" : "#ecf0f1",
          color: activeType === "all" ? "white" : "#333",
          border: "none",
          borderRadius: "20px",
          cursor: "pointer",
          fontWeight: activeType === "all" ? "bold" : "normal"
        }}
      >All</button>

        {foodTypes.filter(type => activeType === "all" || activeType === type.id).map(type => (
          <button
            key={type.id}
            onClick={() => scrollToType(type.id)}
            style={{
              padding: "10px 20px",
              backgroundColor: activeType === type.id ? "#3498db" : "#ecf0f1",
              color: activeType === type.id ? "white" : "#333",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontWeight: activeType === type.id ? "bold" : "normal",
              transition: "all 0.3s ease"
            }}
          >
            {type.name}
          </button>
        ))}
      </div>

      {/* Food Items by Type */}
      {foodTypes.filter(type => activeType === "all" || activeType === type.id).map(type => (
        <div 
          key={type.id} 
          ref={el => typeRefs.current[type.id] = el}
          style={{ marginBottom: "40px", scrollMarginTop: "100px" }}
        >
          <h3>{type.name}</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px" }}>
            {type.foods.map(food => (
              <div key={food.id} style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "12px",
                textAlign: "center"
              }}>
                <div style={{
                  width: "100%",
                  height: "120px",
                  backgroundColor: "#ecf0f1",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "8px",
                  overflow: "hidden"
                }}>
                  {food.image_url ? (
                    <img src={food.image_url} width="100%" height="100%" style={{ objectFit: "cover" }} />
                  ) : (
                    <span style={{ color: "#999", fontSize: "12px", textAlign: "center" }}>No Image</span>
                  )}
                </div>

                <p style={{ fontWeight: "bold", margin: "8px 0" }}>{food.name}</p>
                <p style={{ color: "#27ae60", fontSize: "18px", margin: "4px 0" }}>RM {food.price}</p>
                {food.description && <p style={{ fontSize: "12px", color: "#666", margin: "4px 0" }}>{food.description}</p>}

                <button onClick={() => addToCart(food.id)} style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}>
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
