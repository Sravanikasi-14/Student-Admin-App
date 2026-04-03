import { useState } from "react";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      
       await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      {
        email,
        password,
        role: "student",
      }
    );

      alert("Registered successfully!");
    } catch (err) {
      console.log(err.response?.data); // 👈 ADD THIS
      alert("Registration failed ❌");
    }
  }
  
  return (
    <div>
      <h1>Register</h1>

      <input
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>

      <p>
        Already user? <a href="/">Login</a>
      </p>
    </div>
  );
}

export default Register;