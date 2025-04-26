import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();  // ✅ Correct, and we'll use it properly
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const res = await axios.post("https://user-service-10h5.onrender.com/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",  // Very important
        },
      });

      const token = res.data.access_token;
      localStorage.setItem("token", token);
      alert("Login successful!");

      navigate("/"); // ✅ Properly using useNavigate()
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-6 transform hover:scale-105 transition-transform duration-300"
      >
        <h2 className="text-3xl font-bold text-center text-gray-700">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
