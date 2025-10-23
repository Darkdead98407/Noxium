import "./../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content" style={{ textAlign: "center", marginTop: "2rem" }}>
      <p className="footer-text">© {new Date().getFullYear()} Noxium. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
