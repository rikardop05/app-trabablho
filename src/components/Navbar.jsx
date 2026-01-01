import { Link } from 'react-router-dom'
import { Home, Plus, User } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 shadow-lg">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className="flex flex-col items-center justify-center h-full w-full text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors">
          <Home size={24} strokeWidth={2} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/upload" className="flex flex-col items-center justify-center h-full w-full text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors">
          <Plus size={24} strokeWidth={2} />
          <span className="text-xs mt-1">Novo</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center h-full w-full text-gray-600 dark:text-gray-300 hover:text-pink-600 transition-colors">
          <User size={24} strokeWidth={2} />
          <span className="text-xs mt-1">Perfil</span>
        </Link>
      </div>
    </nav>
  )
}