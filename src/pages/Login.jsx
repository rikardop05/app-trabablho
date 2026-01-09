import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  saveUser,
  loadUsers,
  unifyStorage,
  saveUsers,
  saveCurrentUserId
} from "../utils/storage"

export default function Login() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      alert("Por favor, insira seu nome")
      return
    }

    unifyStorage()

    const users = loadUsers()

    let user = users.find(u => u.email === email.trim())

    if (!user) {
      user = users.find(u => u.name === name.trim())
    }

    if (!user) {
      user = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim() || `${name.trim().toLowerCase()}@email.com`,
        avatar: null,
        bio: "",
        createdAt: new Date().toISOString()
      }
      saveUsers([...users, user])
    }

    saveUser(user)
    saveCurrentUserId(user.id)
    navigate("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-6 py-8 space-y-12">
          
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/Screenshot 2025-12-30 143028.png"
              alt="Logo"
              className="h-14 w-14 rounded-full object-cover"
            />
          </div>

          {/* Título */}
          <h1 className="text-center text-lg font-semibold text-gray-900 dark:text-white leading-snug">
            Sistema de Denúncias Ambientais
          </h1>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="flex flex-col items-center">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Seu nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="block mx-auto w-full max-w-[260px] border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="block mx-auto w-full max-w-[260px] border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="block mx-auto w-full max-w-[260px] py-2 rounded-md text-sm font-medium bg-pink-600 text-white hover:bg-pink-700 transition"
            >
              Entrar
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
