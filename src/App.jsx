import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"

import MainLayout from "./layouts/MainLayout"

import Feed from "./pages/Feed"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import Stories from "./pages/Stories"
import PostDetail from "./pages/PostDetail"
import Upload from "./pages/Upload"

import { loadCurrentUserId, loadUser } from "./utils/storage"

/**
 * AuthGuard CORRETO
 * - currentUserId é a ÚNICA fonte de autenticação
 * - loadUser é apenas dado complementar
 */
function AuthGuard({ children }) {
  const [ready, setReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const userId = loadCurrentUserId()
    setIsAuthenticated(Boolean(userId))
    setReady(true)
  }, [])

  if (!ready) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          element={
            <AuthGuard>
              <MainLayout />
            </AuthGuard>
          }
        >
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/stories/:userId" element={<Stories />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/upload" element={<Upload />} />
        </Route>

        {/* Fallback seguro */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
