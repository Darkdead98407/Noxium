// src/pages/Login.jsx
import "../styles/Login.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import Loader from "../components/Loader";


export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Si ya está autenticado, lo mandamos al Dashboard
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="login-container">
      <h1>Inicia sesión con Discord</h1>
      <a
        href="http://localhost:5000/auth/discord"
        className="btn-login"
      >
        Iniciar sesión con Discord
      </a>
    </div>
  );
}
