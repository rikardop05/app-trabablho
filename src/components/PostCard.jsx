import { useState } from "react"
import {
  AlertTriangle,
  MessageCircle,
  AlertCircle,
  Trash2,
  MapPin
} from "lucide-react"

import {
  savePosts,
  saveReport,
  loadUser,
  deletePost,
  deleteStory
} from "../utils/storage"

import { categoryToOrg } from "../data/categories"
import { isAdmin } from "../utils/auth"

export default function PostCard({ post, onUpdate, isLast = false }) {
  const [likes, setLikes] = useState(post.likes || 0)
  const [comments, setComments] = useState(post.comments || [])
  const [newComment, setNewComment] = useState("")
  const [showComments, setShowComments] = useState(false)

  const currentUser = loadUser()
  const showDeleteButton = isAdmin(currentUser)

  const handleLike = () => {
    const updatedPost = { ...post, likes: likes + 1 }
    const allPosts = JSON.parse(localStorage.getItem("app_posts_v1")) || []
    const updatedPosts = allPosts.map(p =>
      String(p.id) === String(post.id) ? updatedPost : p
    )

    savePosts(updatedPosts)
    setLikes(likes + 1)
    if (onUpdate) onUpdate()
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const updatedPost = {
      ...post,
      comments: [
        ...comments,
        {
          id: Date.now(),
          user: currentUser?.name || "Anônimo",
          text: newComment.trim()
        }
      ]
    }

    const allPosts = JSON.parse(localStorage.getItem("app_posts_v1")) || []
    const updatedPosts = allPosts.map(p =>
      String(p.id) === String(post.id) ? updatedPost : p
    )

    savePosts(updatedPosts)
    setComments(updatedPost.comments)
    setNewComment("")
    if (onUpdate) onUpdate()
  }

  const handleReport = () => {
    if (window.confirm("Tem certeza que deseja reportar este post para as autoridades?")) {
      const report = {
        id: Date.now(),
        postId: post.id,
        category: post.category,
        org: categoryToOrg[post.category],
        date: new Date().toISOString(),
        user: currentUser?.name || "Anônimo"
      }

      saveReport(report)
      alert(`Denúncia enviada para ${categoryToOrg[post.category]} com sucesso!`)
    }
  }

  const handleDeletePost = () => {
    if (window.confirm("Tem certeza que deseja excluir este post?")) {
      deletePost(post.id)
      if (onUpdate) onUpdate()
    }
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4"
      style={{
        paddingBottom: isLast ? "78px" : "16px"
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start p-4 pb-2">
        <div className="w-full">
          {/* Nome */}
          <span className="block font-semibold text-gray-900 dark:text-white">
            {post.user?.name || "Anônimo"}
          </span>

          {/* Categoria + Localização */}
          <div className="flex justify-between items-center w-full mt-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {post.category}
            </span>

            {post.location && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <MapPin size={14} />
                <span>{post.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lixeira ADMIN */}
        {showDeleteButton && (
          <button
            onClick={handleDeletePost}
            className="ml-3 text-red-500 hover:text-red-700"
            title="Excluir post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* IMAGEM */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full h-48 object-cover rounded-lg mb-3 shadow-md"
        />
      )}

      {/* DESCRIÇÃO */}
      <p className="px-4 text-gray-700 dark:text-gray-300 mb-3">
        {post.caption}
      </p>

      {/* AÇÕES */}
      <div className="px-4 flex items-center gap-4 mb-6">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-pink-600"
        >
          <AlertTriangle size={18} fill={likes > 0 ? "#ef4444" : "none"} />
          <span>{likes}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-pink-600"
        >
          <MessageCircle size={18} />
          <span>{comments.length}</span>
        </button>

        <button
          onClick={handleReport}
          className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
        >
          <AlertCircle size={18} />
          <span>Reportar</span>
        </button>
      </div>

      {/* COMENTÁRIOS */}
      {showComments && (
        <div className="px-4 border-t pt-3">
          <div className="space-y-2 mb-3">
            {comments.map(comment => (
              <div key={comment.id} className="border-b pb-2">
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {comment.user}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {comment.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione um comentário..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-3 py-1 rounded text-sm"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
