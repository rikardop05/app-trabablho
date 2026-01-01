import { useNavigate } from "react-router-dom"
import { loadUser } from "../utils/storage"

const mockUsers = [
  { id: 1, name: "Ana" },
  { id: 2, name: "Carlos" },
  { id: 3, name: "Julia" },
  { id: 4, name: "Marcos" },
]

export default function StoriesBar() {
  const navigate = useNavigate()
  const user = loadUser()

  return (
    <div className="flex justify-center gap-6 overflow-x-auto py-4">
      {[{ id: "me", name: "Você" }, ...mockUsers].map((u) => (
        <button
          key={u.id}
          onClick={() => navigate(`/stories/${u.id}`)}
          className="flex flex-col items-center min-w-[80px]"
        >
          <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-pink-500 to-yellow-400">
            <img
              src={
                u.id === "me" && user?.avatar
                  ? user.avatar
                  : `https://i.pravatar.cc/150?u=${u.id}`
              }
              className="w-full h-full rounded-full object-cover bg-white"
            />
          </div>
          <span className="text-sm mt-2 text-gray-700 dark:text-gray-300">{u.name}</span>
        </button>
      ))}
    </div>
  )
}
