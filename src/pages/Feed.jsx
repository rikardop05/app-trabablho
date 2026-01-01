import { useState, useEffect } from 'react'
import { loadPosts, loadUser } from '../utils/storage'
import PostCard from '../components/PostCard'
import { categories } from '../data/categories'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('all')
  const user = loadUser()

  useEffect(() => {
    const unsubscribe = () => {
      const stored = loadPosts()
      setPosts(stored)
    }
    
    unsubscribe()
    window.addEventListener('posts_updated', unsubscribe)
    
    return () => {
      window.removeEventListener('posts_updated', unsubscribe)
    }
  }, [])

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter)

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Feed de Denúncias</h1>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Todas Categorias</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma denúncia encontrada para esta categoria
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} onUpdate={() => setPosts(loadPosts())} />
          ))}
        </div>
      )}
    </div>
  )
}