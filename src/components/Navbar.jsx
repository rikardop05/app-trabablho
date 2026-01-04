import { Link, useLocation } from "react-router-dom"
import { Home, PlusCircle, User } from "lucide-react"

export default function Navbar() {
  const location = useLocation()

  if (location.pathname === "/login") return null

  const isActive = (path) => location.pathname === path

  const itemStyle = (path) => ({
    flex: 1,
    textAlign: "center",
    padding: "8px",
    backgroundColor: isActive(path) ? "#374151" : "#1F2937",
    color: "#FFFFFF", // FORÇA TEXTO BRANCO
    textDecoration: "none",
  })

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "64px",
        display: "flex",
        backgroundColor: "#111827",
        zIndex: 9999,
      }}
    >
      <Link to="/" style={itemStyle("/")}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Home size={24} color="white" />
          <span style={{ fontSize: "12px", color: "white" }}>Home</span>
        </div>
      </Link>

      <Link to="/upload" style={itemStyle("/upload")}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <PlusCircle size={24} color="white" />
          <span style={{ fontSize: "12px", color: "white" }}>Novo</span>
        </div>
      </Link>

      <Link to="/profile" style={itemStyle("/profile")}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <User size={24} color="white" />
          <span style={{ fontSize: "12px", color: "white" }}>Perfil</span>
        </div>
      </Link>
    </div>
  )
}
