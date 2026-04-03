import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);

      const payload = JSON.parse(atob(res.data.token.split(".")[1]));

      if (payload.role === "admin") navigate("/admin");
      else navigate("/student");

    } catch {
      alert("Login failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-80 text-white">

        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome Back
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-white/30 placeholder-white outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded bg-white/30 placeholder-white outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-white text-blue-600 py-2 rounded font-semibold hover:bg-gray-200"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          New user? <a href="/register" className="underline">Register</a>
        </p>

      </div>
    </div>
  );
}

export default Login;