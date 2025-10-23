import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";

export default function ServerSettings() {
  const { id } = useParams();
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/guild/${id}/settings`)
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error cargando configuración:", err);
        setMessage("Error al cargar la configuración.");
        setIsLoading(false);
      });
  }, [id]);

  const handleSave = () => {
    setIsSaving(true);
    setMessage("");

    fetch(`/api/guild/${id}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
      .then(res => res.json())
      .then(data => {
        setMessage("Configuración guardada exitosamente.");
        setIsSaving(false);
      })
      .catch(err => {
        console.error("Error guardando:", err);
        setMessage("Error al guardar la configuración.");
        setIsSaving(false);
      });
  };

  if (isLoading) return <Loader/>;
  if (!settings) return <p>No se encontró la configuración del servidor.</p>;

  return (
    <div className="server-settings-container">
      <h1>Configuración del servidor</h1>
      <p>ID: {id}</p>

      <label>
        Prefijo:
        <input
          type="text"
          value={settings.prefix || ""}
          onChange={e => setSettings({ ...settings, prefix: e.target.value })}
        />
      </label>

      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Guardando..." : "Guardar"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}