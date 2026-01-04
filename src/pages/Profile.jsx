import { useEffect, useState } from "react"
import { loadUser, saveUser, clearUser, loadPosts, loadUsers } from "../utils/storage"
import { compressImage } from "../utils/imageUtils"
import { useNavigate, useParams } from "react-router-dom"
import { Sun, Moon, LogOut, Upload, Edit2 } from "lucide-react"

export default function Profile() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [user, setUser] = useState(() => {
    if (userId) {
      const users = loadUsers()
      return users.find(u => u.id === userId) || loadUser()
    }
    return loadUser()
  })
  const [dark, setDark] = useState(
    localStorage.getItem("dark_mode") === "true"
  )
  const posts = loadPosts().filter(post => post.user.id === user?.id).slice(0, 6)
  const isCurrentUser = !userId || userId === loadUser()?.id

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("dark_mode", dark)
  }, [dark])

  const uploadAvatar = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const compressedAvatar = await compressImage(file, {
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.9,
        maxSize: 0 // No size limit for avatars
      })
      
      const updated = { ...user, avatar: compressedAvatar }
      saveUser(updated)
      setUser(updated)
    } catch (error) {
      console.error('Failed to compress avatar:', error)
    }
  }

  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <div className="flex flex-col p-4 pb-24 relative" style={{ position: 'relative' }}>
      {/* Theme Toggle and Logout Buttons */}
      <div className="absolute top-4 right-4 flex gap-2" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <button
          onClick={() => setDark(!dark)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label={dark ? "Modo Claro" : "Modo Escuro"}
        >
          {dark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-800 dark:text-white" />}
        </button>
        <button
          onClick={() => {
            clearUser()
            navigate("/login")
          }}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md mt-12">
        <img
          src={user.avatar || "https://i.pravatar.cc/150"}
          className="w-[150px] h-[150px] rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
        />

        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold dark:text-white">{user.name || "Usuário"}</h2>
          <p className="text-gray-500 text-sm mt-1">Bio do usuário</p>

          {isCurrentUser && (
            <label className="text-sm text-blue-600 cursor-pointer block mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-between gap-4">
              Alterar foto
              <Upload className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={uploadAvatar}
              />
            </label>
          )}
          <div className="mt-4 flex items-center justify-between gap-4">
            <span className="text-gray-500 text-sm">Bio do usuário</span>
            {isCurrentUser && <Edit2 className="w-5 h-5 text-gray-500 cursor-pointer" />}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 mt-8 w-full max-w-md">
        {posts.map((post) => (
          <div key={post.id} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md relative">
            <img
              src={post.image}
              className="w-full h-full object-cover rounded-lg"
              alt={`Post ${post.id}`}
              onClick={() => navigate(`/post/${post.id}`)}
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <span>👍</span>
              <span>{post.likes || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
