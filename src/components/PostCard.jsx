import { useState } from 'react'
import { AlertTriangle, MessageCircle, AlertCircle } from 'lucide-react'
import { savePosts, saveReport, loadUser } from '../utils/storage'
import { categoryToOrg } from '../data/categories'

export default function PostCard({ post, onUpdate, isLast = false }) {
  const [likes, setLikes] = useState(post.likes || 0)
  const [comments, setComments] = useState(post.comments || [])
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  const user = loadUser()

  const handleLike = () => {
    const updatedPost = { ...post, likes: likes + 1 }
    const allPosts = JSON.parse(localStorage.getItem('app_posts_v1')) || []
    const updatedPosts = allPosts.map(p => p.id.toString() === post.id.toString() ? updatedPost : p)
    savePosts(updatedPosts)
    setLikes(likes + 1)
    if (onUpdate) onUpdate()
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    const updatedPost = {
      ...post,
      comments: [...comments, {
        id: Date.now(),
        user: user?.name || 'Anônimo',
        text: newComment.trim()
      }]
    }
    
    const allPosts = JSON.parse(localStorage.getItem('app_posts_v1')) || []
    const updatedPosts = allPosts.map(p => p.id.toString() === post.id.toString() ? updatedPost : p)
    savePosts(updatedPosts)
    setComments(updatedPost.comments)
    setNewComment('')
    if (onUpdate) onUpdate()
  }

  const handleReport = () => {
    if (window.confirm('Tem certeza que deseja reportar este post para as autoridades?')) {
      const report = {
        id: Date.now(),
        postId: post.id,
        category: post.category,
        org: categoryToOrg[post.category],
        date: new Date().toISOString(),
        user: user?.name || 'Anônimo'
      }
      
      saveReport(report)
      alert(`Denúncia enviada para ${categoryToOrg[post.category]} com sucesso!`)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 px-0" style={{ paddingBottom: isLast ? '78px' : '16px', paddingLeft: '0px', paddingRight: '0px' }}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-semibold text-gray-900 dark:text-white">{post.user?.name || 'Anônimo'}</span>
          {post.category && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {post.category}
            </div>
          )}
        </div>
      </div>

      {post.image && (
        <img src={post.image} alt="Post" className="w-full h-48 object-cover rounded-lg mb-3 shadow-md" />
      )}

      <p className="text-gray-700 dark:text-gray-300 mb-3">{post.caption}</p>

      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-pink-600"
        >
          <AlertTriangle size={18} fill={likes > 0 ? '#ef4444' : 'none'} />
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

      {showComments && (
        <div className="mt- border-t pt-3">
          <div className="space-y-2 mb-3">
            {comments.map(comment => (
              <div key={comment.id} className="border-b pb-2">
                <div className="font-medium text-sm text-gray-900 dark:text-white">{comment.user}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{comment.text}</div>
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
            <button type="submit" className="bg-pink-600 text-white px-3 py-1 rounded text-sm">
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  )
}