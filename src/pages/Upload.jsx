import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  loadPosts,
  savePosts,
  loadUser,
  loadStories,
  saveStories
} from '../utils/storage'
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

    const maxSize = 20 * 1024 * 1024
    if (file.size > maxSize) {
      setError('A imagem é muito grande. Selecione uma menor que 20MB')
      return
    }

    try {
      const compressedImage = await compressImage(file, {
        maxWidth: 2000,
        maxHeight: 2000,
        quality: 0.9,
        maxSize: 0
      })
      setImage(compressedImage)
    } catch (error) {
      setError('Falha ao processar a imagem.')
      console.error(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!caption.trim()) return setError('Adicione uma descrição')
    if (!image) return setError('Selecione uma imagem')
    if (!category) return setError('Selecione uma categoria')

    setIsUploading(true)

    const newPost = {
      id: Date.now().toString(),
      user: { id: user.id, name: user.name },
      image,
      caption: caption.trim(),
      category,
      location: location.trim() || null,
      likes: 0,
      comments: []
    }

    savePosts([newPost, ...(loadPosts() || [])])
    saveStories([newPost, ...(loadStories() || [])])

    setTimeout(() => {
      setIsUploading(false)
      navigate('/feed', { replace: true })
    }, 400)
  }

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-64px)] overflow-y-auto p-4 pb-32">
      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Nova Denúncia
      </h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Imagem */}
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
            <img
              src={image}
              alt="Preview"
              className="mt-3 w-full max-h-[40vh] object-contain rounded-lg"
            />
          )}
        </div>

        {/* Descrição */}
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

        {/* Categoria */}
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
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Localização */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Localização (opcional)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Ex: Av. Paulista, 1578 - SP"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2 rounded bg-pink-600 text-white hover:bg-pink-700 transition ${
            isUploading ? 'opacity-50' : ''
          }`}
        >
          {isUploading ? 'Publicando...' : 'Publicar Denúncia'}
        </button>
      </form>
    </div>
  )
}
