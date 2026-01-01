import { Link, useLocation } from "react-router-dom"
import { Home, PlusSquare, User } from "lucide-react"

export default function Navbar() {
  const { pathname } = useLocation()

  const item = (path) =>
    `flex flex-col items-center gap-1 ${
      pathname === path
        ? "text-pink-600"
        : "text-gray-500 dark:text-gray-300"
    }`

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-900 px-8 py-3 rounded-full shadow-lg">
      <div className="flex gap-10">
        <Link to="/" className={item("/")}>
          <Home size={22} />
          <span className="text-xs">Home</span>
        </Link>

        <Link to="/upload" className={item("/upload")}>
          <PlusSquare size={22} />
          <span className="text-xs">Novo</span>
        </Link>

        <Link to="/profile" className={item("/profile")}>
          <User size={22} />
          <span className="text-xs">Perfil</span>
        </Link>
      </div>
    </nav>
  )
}
