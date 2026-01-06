import { useEffect, useState } from "react"
import { loadUser, saveUser, clearUser, loadPosts, loadUsers } from "../utils/storage"
import { compressImage } from "../utils/imageUtils"
import { useNavigate, useParams } from "react-router-dom"
import { Sun, Moon, LogOut, Upload, Edit2 } from "lucide-react"
import BioEditModal from "../components/BioEditModal"

export default function Profile() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const currentUser = loadUser()
      
  const [user, setUser] = useState(() => {
    if (userId) {
      const users = loadUsers()
      return users.find(u => u.id === userId) || currentUser
    }
    return currentUser
  })

  const [dark, setDark] = useState(
    localStorage.getItem("dark_mode") === "true"
  )
  const [isBioEditModalOpen, setIsBioEditModalOpen] = useState(false)

  const posts = loadPosts()
    .filter(post => post.user?.id === user?.id)
    .slice(0, 6)

  const isCurrentUser = !userId || userId === currentUser?.id

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
        maxSize: 0
      })

      const updated = { ...user, avatar: compressedAvatar }
      saveUser(updated)
      setUser(updated)
    } catch (error) {
      console.error("Failed to compress avatar:", error)
    }
  }

  const handleSaveBio = (newBio) => {
    const updated = { ...user, bio: newBio }
    saveUser(updated)
    setUser(updated)
    setIsBioEditModalOpen(false)
  }

  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <div className="flex flex-col p-4 pb-24 relative">
      {/* Theme + Logout */}
      <div className="absolute top-4 right-4 flex gap-2" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <button
          onClick={() => setDark(!dark)}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {dark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          onClick={() => {
            clearUser()
            navigate("/login")
          }}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center w-full max-w-md mx-auto mt-12 px-4">
        <img
          src={user.avatar || "https://i.pravatar.cc/150"}
          className="w-[140px] h-[140px] sm:w-[150px] sm:h-[150px] rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
        />

        <div className="text-center mt-6 w-full">
          <h2 className="text-2xl font-semibold dark:text-white">
            {user.name || "Usuário"}
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Perfil público
          </p>

          {isCurrentUser && (
            <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
              Alterar foto
              <Upload className="w-4 h-4" />
              <input type="file" hidden accept="image/*" onChange={uploadAvatar} />
            </label>
          )}

          {/* Bio header */}
          <div className="mt-8 max-w-sm mx-auto w-full flex items-center justify-center px-1">
            {isCurrentUser && (
              <button
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                onClick={() => setIsBioEditModalOpen(true)}
              >
                Editar Bio
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bio content */}
          <div className="mt-20 max-w-sm mx-auto w-full rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 leading-relaxed" style={{ marginTop: '35px' }}>
            {user.bio || "Nenhuma bio adicionada ainda."}
          </div>
        </div>
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-3 gap-2 mt-10 w-full max-w-md mx-auto">
        {posts.map(post => (
          <div key={post.id} className="aspect-square rounded-lg overflow-hidden relative">
            <img
              src={post.image}
              className="w-full h-full object-cover"
              onClick={() => navigate(`/post/${post.id}`)}
            />
          </div>
        ))}
      </div>

      {isBioEditModalOpen && (
        <BioEditModal
          user={user}
          onSave={handleSaveBio}
          onClose={() => setIsBioEditModalOpen(false)}
        />
      )}
    </div>
  )
}
