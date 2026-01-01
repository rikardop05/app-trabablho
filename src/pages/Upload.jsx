import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadPosts, savePosts, loadUser } from '../utils/storage'
import { categories } from '../data/categories'

export default function Upload() {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()
  
  const user = useMemo(() => {
    const existingUser = loadUser()
    return existingUser || { id: Math.random().toString(36).substr(2, 9), name: 'Usuário' }
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (!file.type.match('image.*')) {
      setError('Por favor, selecione um arquivo de imagem')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 5MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (!caption.trim()) {
      setError('Por favor, adicione uma descrição')
      return
    }
    
    if (!image) {
      setError('Por favor, selecione uma imagem')
      return
    }
    
    if (!category) {
      setError('Por favor, selecione uma categoria')
      return
    }
    
    setIsUploading(true)
    
    const newPost = {
      id: Date.now(),
      user: {
        id: user.id,
        name: user.name
      },
      image,
      caption: caption.trim(),
      category,
      likes: 0,
      comments: []
    }
    
    const existingPosts = loadPosts() || []
    const updatedPosts = [newPost, ...existingPosts]
    
    savePosts(updatedPosts)
    
    setTimeout(() => {
      setIsUploading(false)
      navigate('/')
    }, 500)
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Nova Denúncia</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {image && (
            <img src={image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
            placeholder="Descreva o problema ambiental..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 ${isUploading ? 'opacity-50' : ''}`}
        >
          {isUploading ? 'Publicando...' : 'Publicar Denúncia'}
        </button>
      </form>
    </div>
  )
}