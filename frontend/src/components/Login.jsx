import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import api from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await api.post("http://localhost:3000/login", {
        email,
        password,
      });
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") navigate("/admin");
      else if (role === "design") navigate("/design");
      else if (role === "production") navigate("/production");
      else if (role === "sales") navigate("/sales");

      setError("");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        {/* ICON */}
        <div className="flex justify-center mb-4 text-blue-600 text-3xl">
          <FaCar />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
          CMS Login
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Car Manufacturing System
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
