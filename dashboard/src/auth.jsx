import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const navigate = useNavigate();
  const location = useLocation();

  // Función para hacer peticiones autenticadas
  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers
    });
  };

  // Verificar usuario con token
  const fetchUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const startTime = Date.now();
    let finished = false;

    try {
      const res = await authenticatedFetch('/api/user');
      
      if (res.ok) {
        const data = await res.json();
        console.log("Usuario autenticado:", data.user);
        setUser(data.user);
      } else if (res.status === 401 || res.status === 403) {
        console.log("Token inválido, removiendo...");
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      }

    } catch (error) {
      console.error("Error verificando usuario:", error);
      setUser(null);
    } finally {
      finished = true;
      const elapsed = Date.now() - startTime;
      const minDuration = 1500; // 1.5s mínimo
      const remaining = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        if (finished) {
          setLoading(false);
        }
      }, remaining);
    }
  };

  // Manejar token de la URL (después del callback de Discord)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      console.log("Token recibido de Discord callback");
      localStorage.setItem('auth_token', urlToken);
      setToken(urlToken);
      
      // Limpiar URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location]);

  // Verificar usuario cuando cambie el token
  useEffect(() => {
    fetchUser();
  }, [token]);

  const logout = async () => {
    try {
      if (token) {
        await authenticatedFetch('/api/logout', { method: 'POST' });
      }
      
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      // Limpiar de todas formas
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      navigate("/login");
    }
  };

  const value = {
    user,
    loading,
    logout,
    token,
    authenticatedFetch // Exportar para usar en otros componentes
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};