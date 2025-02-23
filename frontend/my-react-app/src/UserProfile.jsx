import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8560/userprofile", { withCredentials: true });
      setUser(response.data);
    } catch (error) {
        console.log("Error fetching user data", error);
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8560/Logout", {}, { withCredentials: true });
      navigate("/"); 
    } catch (error) {
        console.log("Error logging out", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg text-center">
     <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personal Page</h2>

      {user ? (
        <>
          <p className="text-lg text-gray-700">Hello <span className="font-bold text-blue-600">{user.username}</span> 👋</p>
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300"
          >
          Log out
          </button>
        </>
      ) : (
        <p className="text-gray-500">⏳ Download data...</p>
      )}
    </div>
  );
}

export default UserProfile;
