import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



 export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("http://localhost:8560/userprofile", { withCredentials: true });
      if (response.data.username) {
        navigate("/profile"); 
      }
    } catch (error) {
      console.log("User is not logged in", error);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "http://localhost:8560/SignIn" : "http://localhost:8560/SignUp";

    try {
      await axios.post(url, { username, password }, { withCredentials: true });

      if (isLogin) {
        setMessage("✅ Login Successful! You will be redirected to your personal page...");
        setTimeout(() => {
          navigate("/profile"); 
        }, 2000);
      } else {
        setMessage("✅ Account created successfully! You can now log in.");
        setIsLogin(true);
      }
    } catch (error) {
      setMessage("❌ " + (error.response?.data?.error || "Something went wrong!"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
      {isLogin ? "Login": "Create an Account"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="user name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300"
        >
       {isLogin ? "Login": "Create an Account"}
        </button>
      </form>

      <p className={`mt-4 text-${isLogin ? "blue" : "green"}-600`}>{message}</p>

      <button
        onClick={toggleMode}
        className="mt-4 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition duration-300"
      >
       {isLogin ? "Don't have an account? Sign up now": "Have an account? Sign in"}
      </button>
    </div>
  );
}


