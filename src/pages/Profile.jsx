import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadUser, clearUser, loadReports, loadPosts } from '../utils/storage'
import { categoryToOrg } from '../data/categories'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [reports, setReports] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = loadUser()
    if (currentUser) {
      setUser(currentUser)
      const userPosts = loadPosts().filter(post => post.user?.id === currentUser.id)
      setUserPosts(userPosts)
      setReports(loadReports().filter(r => r.user === currentUser.name))
    }
  }, [])

  const handleLogout = () => {
    clearUser()
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Faça login para ver seu perfil</p>
      </div>
    )
  }

  return (
    <div className="p-4 pb-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{user.email || 'usuário@email.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Suas Denúncias</h2>
        {userPosts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Você ainda não fez nenhuma denúncia</p>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">{userPosts.length} denúncia(s) feita(s)</p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Relatório de Denúncias</h2>
        
        {reports.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Nenhuma denúncia oficial registrada</p>
        ) : (
          <div className="space-y-3">
            {reports.map(report => (
              <div key={report.id} className="border-b pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{report.org}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{report.category}</p>
                    <p className="text-xs text-gray-500">{new Date(report.date).toLocaleString()}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Enviado</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}