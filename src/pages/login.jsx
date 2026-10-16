import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setAuth } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await api.auth.login({ email, password });
      setAuth(response.token, response.user);

      if (response.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      const msg = error.message || "Invalid email or password";
      setErrorMessage(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          🏫
        </div>

        <h1>CampusConnect</h1>

        <p className="login-subtitle">
          Campus Complaint & Lost and Found System
        </p>

        {errorMessage && (
          <div style={{
            color: "#dc2626",
            background: "#fee2e2",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize: "14px",
            textAlign: "center"
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="demo-login">

          <p
            style={{ cursor: "pointer" }}
            onClick={() => fillDemo("student@campus.com", "student123")}
            title="Click to fill"
          >
            Demo Student
          </p>

          <small
            style={{ cursor: "pointer" }}
            onClick={() => fillDemo("student@campus.com", "student123")}
          >
            student@campus.com / student123
          </small>

          <p
            style={{ cursor: "pointer", marginTop: "12px" }}
            onClick={() => fillDemo("admin@campus.com", "admin123")}
            title="Click to fill"
          >
            Demo Admin
          </p>

          <small
            style={{ cursor: "pointer" }}
            onClick={() => fillDemo("admin@campus.com", "admin123")}
          >
            admin@campus.com / admin123
          </small>

        </div>

      </div>

    </div>
  );
}

export default Login;