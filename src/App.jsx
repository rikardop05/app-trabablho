import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Feed from './pages/Feed'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import Login from './pages/Login'

export default function App() {
  useEffect(() => {
    const saved = localStorage.getItem('dark_mode') === 'true'
    if (saved) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Navbar />
      </div>
    </BrowserRouter>
  )
}
