import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      email === "student@campus.com" &&
      password === "student123"
    ) {
      navigate("/student/dashboard");
    } else if (
      email === "admin@campus.com" &&
      password === "admin123"
    ) {
      navigate("/admin/dashboard");
    } else {
      alert("Invalid email or password");
    }
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

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <div className="demo-login">

          <p>Demo Student</p>

          <small>
            student@campus.com / student123
          </small>

          <p>Demo Admin</p>

          <small>
            admin@campus.com / admin123
          </small>

        </div>

      </div>

    </div>
  );
}

export default Login;