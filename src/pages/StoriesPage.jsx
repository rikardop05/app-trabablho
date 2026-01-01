import { useNavigate, useParams } from "react-router-dom"

export default function StoriesPage() {
  const navigate = useNavigate()
  const { userId } = useParams()

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600"
      >
        ← Voltar
      </button>

      <h1 className="text-xl font-bold mb-2">Stories de {userId}</h1>
      <p className="text-gray-500">
        Nenhuma postagem para este usuário.
      </p>
    </div>
  )
}
