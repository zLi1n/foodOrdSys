import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    date_of_birth: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldLabels = {
    name: "Full Name",
    email: "Email Address",
    password: "Password",
    password_confirmation: "Confirm Password",
    date_of_birth: "Date of Birth",
    phone_number: "Phone Number",
  };

  const fieldTypes = {
    name: "text",
    email: "email",
    password: "password",
    password_confirmation: "password",
    date_of_birth: "date",
    phone_number: "tel",
  };

  const placeholders = {
    name: "John Doe",
    email: "you@example.com",
    password: "At least 8 characters, 1 uppercase,1 lowercase, 1 number, 1 special char",
    password_confirmation: "Re-enter your password",
    date_of_birth: "YYYY-MM-DD",
    phone_number: "0123456789",
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "20px"
    }}>
      <form onSubmit={submit} style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "500px"
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
          Create Account
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

        {Object.keys(form).map((key) => (
          <div key={key} style={{ marginBottom: "15px" }}>
            <label style={{
              display: "block",
              marginBottom: "6px",
              color: "#333",
              fontWeight: "600",
              fontSize: "14px"
            }}>
              {fieldLabels[key]}
            </label>
            <input
              type={fieldTypes[key]}
              placeholder={placeholders[key]}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
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
        ))}

        <button 
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            backgroundColor: loading ? "#95a5a6" : "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={e => !loading && (e.target.style.backgroundColor = "#229954")}
          onMouseLeave={e => !loading && (e.target.style.backgroundColor = "#27ae60")}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <div style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#666",
          fontSize: "14px"
        }}>
          Already have an account?{" "}
          <Link 
            to="/login" 
            style={{
              color: "#3498db",
              textDecoration: "none",
              fontWeight: "bold"
            }}
            onMouseEnter={e => e.target.style.textDecoration = "underline"}
            onMouseLeave={e => e.target.style.textDecoration = "none"}
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
