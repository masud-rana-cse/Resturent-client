import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthWrapper({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const isUserAvailable = JSON.parse(localStorage.getItem("user"));
    if (!isUserAvailable) {
      navigate("/signIn");
    }
  }, [navigate]);

  return children;
}

export default AuthWrapper;
