import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5"
    }}>
      <form onSubmit={submit} style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h1 style={{
          textAlign: "center",
          marginBottom: "10px",
          color: "#2c3e50",
          fontSize: "28px"
        }}>
          🍔 FoodOrder
        </h1>

        <h2 style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#666",
          fontSize: "20px",
          fontWeight: "normal"
        }}>
          Welcome Back
        </h2>

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

        <div style={{ marginBottom: "15px" }}>
          <label style={{
            display: "block",
            marginBottom: "6px",
            color: "#333",
            fontWeight: "600",
            fontSize: "14px"
          }}>
            Email Address
          </label>
          <input 
            type="email"
            placeholder="you@example.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
              transition: "all 0.3s ease"
            }}
            onFocus={e => e.target.style.borderColor = "#3498db"}
            onBlur={e => e.target.style.borderColor = "#ddd"}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            marginBottom: "6px",
            color: "#333",
            fontWeight: "600",
            fontSize: "14px"
          }}>
            Password
          </label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
              transition: "all 0.3s ease"
            }}
            onFocus={e => e.target.style.borderColor = "#3498db"}
            onBlur={e => e.target.style.borderColor = "#ddd"}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#95a5a6" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={e => !loading && (e.target.style.backgroundColor = "#2980b9")}
          onMouseLeave={e => !loading && (e.target.style.backgroundColor = "#3498db")}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#666",
          fontSize: "14px"
        }}>
          Don't have an account?{" "}
          <Link 
            to="/register" 
            style={{
              color: "#3498db",
              textDecoration: "none",
              fontWeight: "bold"
            }}
            onMouseEnter={e => e.target.style.textDecoration = "underline"}
            onMouseLeave={e => e.target.style.textDecoration = "none"}
          >
            Sign up
          </Link>
        </div>

        <div style={{
          textAlign: "center",
          marginTop: "15px"
        }}>
          <Link 
            to="/forgot-password" 
            style={{
              color: "#95a5a6",
              textDecoration: "none",
              fontSize: "12px"
            }}
            onMouseEnter={e => e.target.style.color = "#3498db"}
            onMouseLeave={e => e.target.style.color = "#95a5a6"}
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
}
