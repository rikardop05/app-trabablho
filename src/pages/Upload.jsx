import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadPosts, savePosts, loadUser, loadStories, saveStories, MAX_STORAGE_SIZE } from '../utils/storage'
import { compressImage } from '../utils/imageUtils'
import { categories } from '../data/categories'

export default function Upload() {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()
  
  const user = useMemo(() => {
    const existingUser = loadUser()
    return existingUser || { id: Date.now().toString(), name: 'Usuário' }
  }, [])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (!file.type.match('image.*')) {
      setError('Por favor, selecione um arquivo de imagem')
      return
    }

    // Check file size (20MB limit before compression)
    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      setError('A imagem é muito grande. Por favor, selecione uma imagem menor que 20MB')
      return
    }
    
    try {
      console.log('Original file:', file.name, file.size, file.type)
      // Compress image before setting state
      const compressedImage = await compressImage(file, {
        maxWidth: 2000,
        maxHeight: 2000,
        quality: 0.9,
        maxSize: 0 // No size limit
      })
      console.log('Compressed image size:', compressedImage.length)
      setImage(compressedImage)
    } catch (error) {
      setError('Falha ao processar a imagem. Por favor, tente outra imagem.')
      console.error('Image compression error:', error)
    }
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
      id: Date.now().toString(),
      user: {
        id: user.id,
        name: user.name
      },
      image,
      caption: caption.trim(),
      category,
      location: location.trim() || null,
      likes: 0,
      comments: []
    }

    const existingPosts = loadPosts() || []
    const updatedPosts = [newPost, ...existingPosts]

    console.log('Saving post with image size:', newPost.image.length)
    savePosts(updatedPosts)
    console.log('Posts saved:', loadPosts().length)

    const existingStories = loadStories() || []
    const updatedStories = [newPost, ...existingStories]
    console.log('Saving stories:', updatedStories.length)
    saveStories(updatedStories)
    console.log('Stories saved:', loadStories().length)

    setTimeout(() => {
      setIsUploading(false)
      navigate('/')
    }, 500)
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-24">
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

        <div>
          <label className="block text-sm font-medium mb-1">Localização (opcional)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Ex: Av. Paulista, 1578 - SP"
          />
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