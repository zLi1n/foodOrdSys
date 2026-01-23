import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (e) {
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    navigate("/login");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 20px",
      backgroundColor: "#2c3e50",
      color: "white",
      marginBottom: "20px",
      borderBottom: "4px solid #3498db",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      {/* Logo/Brand */}
      <Link 
        to="/" 
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textDecoration: "none",
          color: "#3498db",
          marginRight: "30px"
        }}
      >
        🍔 FoodOrder
      </Link>

      {/* Links */}
      <div style={{
        display: "flex",
        gap: "15px",
        alignItems: "center",
        flex: 1
      }}>
        {/* Always show Foods link */}
        <Link 
          to="/" 
          style={{
            textDecoration: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = "#3498db";
            e.target.style.color = "white";
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = "transparent";
          }}
        >
          Foods
        </Link>

        {/* Guest Links */}
        {!token && (
          <>
            <Link 
              to="/login" 
              style={{
                textDecoration: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.target.style.backgroundColor = "#3498db"}
              onMouseLeave={e => e.target.style.backgroundColor = "transparent"}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{
                textDecoration: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.target.style.backgroundColor = "#3498db"}
              onMouseLeave={e => e.target.style.backgroundColor = "transparent"}
            >
              Register
            </Link>
          </>
        )}

        {/* User Links */}
        {token && user?.role === 0 && (
          <>
            <Link 
              to="/cart" 
              style={{
                textDecoration: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.target.style.backgroundColor = "#27ae60"}
              onMouseLeave={e => e.target.style.backgroundColor = "transparent"}
            >
              🛒 Cart
            </Link>
            <Link 
              to="/orders" 
              style={{
                textDecoration: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.target.style.backgroundColor = "#27ae60"}
              onMouseLeave={e => e.target.style.backgroundColor = "transparent"}
            >
              📦 Orders
            </Link>
          </>
        )}

        {/* Admin Links */}
        {token && user?.role === 1 && (
          <>
            <Link 
              to="/admin/orders" 
              style={{
                textDecoration: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.target.style.backgroundColor = "#f39c12"}
              onMouseLeave={e => e.target.style.backgroundColor = "transparent"}
            >
              📋 Orders
            </Link>
            <Link 
              to="/admin/foods" 
              style={{
                textDecoration: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.target.style.backgroundColor = "#f39c12"}
              onMouseLeave={e => e.target.style.backgroundColor = "transparent"}
            >
              🍽️ Foods
            </Link>
            <Link 
              to="/admin/food-types" 
              style={{
                textDecoration: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.target.style.backgroundColor = "#f39c12"}
              onMouseLeave={e => e.target.style.backgroundColor = "transparent"}
            >
              🏷️ Types
            </Link>
          </>
        )}
      </div>

      {/* User Info & Logout */}
      {token && (
        <div style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          marginLeft: "20px",
          paddingLeft: "20px",
          borderLeft: "2px solid #95a5a6"
        }}>
          <span style={{ fontSize: "14px", color: "#ecf0f1" }}>
            {user?.name || "User"}
          </span>
          <button 
            onClick={logout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={e => e.target.style.backgroundColor = "#c0392b"}
            onMouseLeave={e => e.target.style.backgroundColor = "#e74c3c"}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
