import { useState } from "react";
import { Link } from "react-router-dom";  // Import Link from react-router-dom
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://audiencesnap-r385.onrender.com/auth/login", {
        email,
        password,
      });

      // 🔑 SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // redirect
      window.location.href = "https://audiencesnap-r385.onrender.com/dashboard";
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px 24px",
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2016/09/29/14/06/background-1702930_1280.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
          padding: "40px 48px",
          maxWidth: "400px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          color: "#1f2937",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "16px",
            textAlign: "center",
            textShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "14px 18px",
            borderRadius: "12px",
            border: "1.8px solid #667eea",
            fontSize: "16px",
            outline: "none",
            transition: "border-color 0.3s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#764ba2")}
          onBlur={(e) => (e.target.style.borderColor = "#667eea")}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "14px 18px",
            borderRadius: "12px",
            border: "1.8px solid #667eea",
            fontSize: "16px",
            outline: "none",
            transition: "border-color 0.3s ease",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#764ba2")}
          onBlur={(e) => (e.target.style.borderColor = "#667eea")}
        />

        <button
          type="submit"
          style={{
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            fontWeight: "700",
            fontSize: "18px",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(102, 126, 234, 0.6)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(102, 126, 234, 0.8)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(102, 126, 234, 0.6)";
          }}
        >
          Login
        </button>

        {/* Add registration link here */}
        <p style={{ textAlign: "center", marginTop: "10px", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#667eea", fontWeight: "600", textDecoration: "underline" }}
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
