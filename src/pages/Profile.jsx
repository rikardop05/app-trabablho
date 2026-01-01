import { useEffect, useState } from "react"
import { loadUser, saveUser, clearUser, loadPosts } from "../utils/storage"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(loadUser())
  const [dark, setDark] = useState(
    localStorage.getItem("dark_mode") === "true"
  )
  const posts = loadPosts().slice(0, 6)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("dark_mode", dark)
  }, [dark])

  const uploadAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const updated = { ...user, avatar: reader.result }
      saveUser(updated)
      setUser(updated)
    }
    reader.readAsDataURL(file)
  }

  if (!user) return null

  return (
    <div className="p-4 pb-32">
      {/* Header */}
      <div className="flex items-center gap-6">
        <img
          src={user.avatar || "https://i.pravatar.cc/150"}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div>
          <h2 className="text-xl font-bold">{user.name || "Usuário"}</h2>
          <p className="text-gray-500 text-sm">Bio do usuário</p>

          <label className="text-sm text-blue-600 cursor-pointer block mt-2">
            Alterar foto
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={uploadAvatar}
            />
          </label>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 mt-6">
        {posts.map((post) => (
          <img
            key={post.id}
            src={post.image}
            className="aspect-square object-cover"
          />
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 space-y-3">
        <button
          onClick={() => setDark(!dark)}
          className="w-full bg-gray-200 dark:bg-gray-700 py-2 rounded"
        >
          {dark ? "Modo Claro" : "Modo Escuro"}
        </button>

        <button
          onClick={() => {
            clearUser()
            navigate("/login")
          }}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
