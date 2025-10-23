import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import "../styles/home.css"
import Loader from "../components/Loader";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="home-container"><Loader/></div>;
  }

  return (
    <div className="home-container">
      {user ? (
        <>
          <h1>Bienvenido, {user.username}#{user.discriminator}</h1>
          <p>Ya estás conectado con Discord 🚀</p>
          <Link to="/dashboard" className="btn-dashboard">Ir al Dashboard</Link>
        </>
      ) : (
        <>
          <h1>Bienvenido a Noxium</h1>
          <p>Tu bot de Discord con panel de control.</p>
        </>
      )}
    </div>
  );
}
