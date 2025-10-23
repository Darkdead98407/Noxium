import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import "./../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">Noxium</Link>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="user-info">
              {user.username}#{user.discriminator}
            </span>
            <button onClick={logout} className="btn-logout">Salir</button>
          </>
        ) : (
          <Link to="/login" className="btn-login">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}
