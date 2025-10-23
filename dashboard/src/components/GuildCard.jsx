import { Link } from "react-router-dom";
import "./../styles/guild-card.css";

export default function GuildCard({ guild }) {
  return (
    <div className="guild-card">
      <img
        src={
          guild.icon
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
            : "/vite.svg"
        }
        alt={guild.name}
        className="guild-icon"
      />
      <h3>{guild.name}</h3>
      <Link to={`/dashboard/guild/${guild.id}/settings`} className="btn-config">
        Configurar
      </Link>
    </div>
  );
}
