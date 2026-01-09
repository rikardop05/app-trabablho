import { useNavigate } from "react-router-dom"
import { loadUser, loadStories, loadUsers } from "../utils/storage"
import { getUserAvatar } from "../utils/imageUtils"

export default function StoriesBar() {
  const navigate = useNavigate()

  const user = loadUser()
  const stories = loadStories() || []
  const users = loadUsers() || []

  // remove duplicação do usuário logado e filtra admin
  const allUsers = [
    user,
    ...users.filter((u) => u.id !== user?.id && u.role !== 'admin'),
  ].filter(Boolean).filter(u => u.role !== 'admin')

  const getUserStories = (userId) =>
    stories.filter((story) => story.user?.id === userId)

  return (
    <div className="flex justify-start gap-10 py-6 bg-transparent overflow-x-auto w-full max-w-none px-0 sm:px-4">
      {allUsers.map((u) => {
        const userStories = getUserStories(u.id)
        const hasStories = userStories.length > 0

        return (
          <button
            key={u.id}
            onClick={() =>
              navigate(u.id === user?.id ? "/profile" : `/stories/${u.id}`)
            }
            className="flex flex-col items-center bg-transparent border-none outline-none"
          >
            {/* BORDA DEGRADÊ VERDE */}
            <div className="w-[150px] h-[150px] rounded-full p-[3px]" style={{ background: 'linear-gradient(to bottom right, #d1d5db, #374151)' }}>
              {/* anel interno */}
              <div className="w-full h-full rounded-full bg-[#1f2937] p-[4px]" style={{ width: '150px', height: '150px' }}>
                <img
                  src={
                    u.avatar
                      ? getUserAvatar(u)
                      : hasStories
                      ? userStories[0].image
                      : getUserAvatar(u)
                  }
                  alt={u.name || "Usuário"}
                  className="w-full h-full rounded-full object-cover"
                  style={{ width: '150px', height: '150px' }}
                />
              </div>
            </div>

            {/* TEXTO SEMPRE BRANCO + MAIS ESPAÇO */}
            <span
              className="text-sm font-medium mt-4"
              style={{ marginTop: '1rem', color: document.documentElement.classList.contains('dark') ? 'white' : 'black' }}
            >
              {u.name || "Usuário"}
            </span>
          </button>
        )
      })}
    </div>
  )
}
