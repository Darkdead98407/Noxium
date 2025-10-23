import { useEffect, useState } from "react";
import { useAuth } from "../auth";
import GuildCard from "../components/GuildCard";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { user, authenticatedFetch } = useAuth();
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuilds = async () => {
      try {
        const res = await authenticatedFetch('/api/guilds');
        
        if (res.ok) {
          const data = await res.json();
          console.log("Guilds cargados:", data);
          setGuilds(data);
        } else {
          console.error("Error cargando guilds:", res.status);
          setGuilds([]);
        }
      } catch (err) {
        console.error("Error cargando servidores:", err);
        setGuilds([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadGuilds();
    } else {
      setLoading(false);
    }
  }, [user, authenticatedFetch]);

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.username}!</p>
      <div className="guilds-list">
        {guilds.length > 0 ? (
          guilds.map(guild => (
            <GuildCard key={guild.id} guild={guild} />
          ))
        ) : (
          <p>No se encontraron servidores compartidos con el bot.</p>
        )}
      </div>
    </div>
  );
}