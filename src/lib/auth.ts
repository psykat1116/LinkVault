import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BackendURL } from "../../data";

export const useAuthCheck = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
    navigate("/auth/signin");
  };

  const isAuthenticated = async () => {
    try {
      await axios.get(`${BackendURL}/api/auth/ping`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
    } catch (error: any) {
      if (error.response.status === 401) {
        logout();
      }
    }
  };

  return { isAuthenticated, logout };
};
