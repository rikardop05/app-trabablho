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

import { loadCurrentUserId } from "./utils/storage"

function AuthGuard({ children }) {
  const [ready, setReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    setAuthenticated(Boolean(loadCurrentUserId()))
    setReady(true)
  }, [])

  if (!ready) return null

  return authenticated
    ? children
    : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

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

        {/* qualquer coisa cai no feed */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
