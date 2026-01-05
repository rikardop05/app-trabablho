import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveUser, loadUsers, clearAllData, unifyStorage } from '../utils/storage'

export default function Login() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
      
    if (!name.trim()) {
      alert('Por favor, insira seu nome')
      return
    }
      
    unifyStorage()
    clearAllData()
      
    const users = loadUsers()
    console.log('Usuários existentes:', users)
    console.log('Nome informado:', name.trim())
    console.log('Email informado:', email.trim())
      
    let user = users.find(u => u.email === email.trim())
      
    if (!user) {
      console.log('Nenhum usuário encontrado com o email:', email.trim())
      user = users.find(u => u.name === name.trim())
      console.log('Buscando usuário pelo nome:', user)
    }
      
    if (!user) {
      console.log('Criando novo usuário')
      user = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim() || `${name.trim().toLowerCase()}@email.com`
      }
    } else {
      console.log('Usuário existente encontrado:', user)
    }
      
    saveUser(user)
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