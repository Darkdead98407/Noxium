// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ServerSettings from "./pages/ServerSettings";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/app.css";

// Asegúrate de que el componente ProtectedRoute también esté en este archivo
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    // Coloca la clase en un div que envuelve toda la aplicación
    <div className="app-container">
        <BrowserRouter>
      <AuthProvider>        
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/guild/:id/settings" element={
                <ProtectedRoute>
                  <ServerSettings />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
          </AuthProvider>
        </BrowserRouter>
    </div>
  );
}

export default App;