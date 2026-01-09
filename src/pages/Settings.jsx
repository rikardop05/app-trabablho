import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { clearUser } from "../utils/storage"
import { Sun, Moon, LogOut } from "lucide-react"

export default function Settings() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)

  // Carrega tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem("dark_mode") === "true"
    setDark(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme)
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    localStorage.setItem("dark_mode", next)
    document.documentElement.classList.toggle("dark", next)
  }

  function handleLogout() {
    clearUser()
    navigate("/login", { replace: true })
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Configurações</h1>

      {/* Tema */}
      <div className="flex items-center justify-between border rounded-lg p-4">
        <div className="flex items-center gap-3">
          {dark ? <Moon size={20} /> : <Sun size={20} />}
          <span className="font-medium">
            {dark ? "Modo escuro" : "Modo claro"}
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700"
        >
          Alternar
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
      >
        <LogOut size={18} />
        Sair da conta
      </button>
    </div>
  )
}
