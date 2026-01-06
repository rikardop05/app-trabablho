import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveUser, loadUsers, clearAllData, unifyStorage, saveUsers, saveCurrentUserId } from '../utils/storage'

export default function Login() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('checkpoint: handleSubmit called')
      
    if (!name.trim()) {
      console.log('checkpoint: name is empty')
      alert('Por favor, insira seu nome')
      return
    }
      
    unifyStorage()
    console.log('checkpoint: unifyStorage called')
       
    const users = loadUsers()
    console.log('checkpoint: users loaded', users)
    console.log('Nome informado:', name.trim())
    console.log('Email informado:', email.trim())
       
    let user = users.find(u => u.email === email.trim())
    console.log('checkpoint: user found by email', user)
       
    if (!user) {
      console.log('Nenhum usuário encontrado com o email:', email.trim())
      user = users.find(u => u.name === name.trim())
      console.log('checkpoint: user found by name', user)
    }
       
    if (!user) {
      console.log('checkpoint: creating new user')
      user = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim() || `${name.trim().toLowerCase()}@email.com`,
        avatar: null,
        bio: '',
        createdAt: new Date().toISOString()
      }
      saveUsers([...users, user])
      console.log('checkpoint: new user created', user)
    } else {
      console.log('checkpoint: existing user found', user)
    }
      
    console.log('checkpoint: saving user', user)
    saveUser(user)
    saveCurrentUserId(user.id)
    console.log('checkpoint: navigating to home')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-center mb-4">
            <img src="/Screenshot 2025-12-30 143028.png" alt="Logo" className="h-16 w-auto rounded-full" />
          </div>
          <h1 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
            Sistema de Denúncias Ambientais
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Seu Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Digite seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Email (opcional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="seu@email.com"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}