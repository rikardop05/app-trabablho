import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"

import Feed from "./pages/Feed"
import Upload from "./pages/Upload"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import StoriesPage from "./pages/StoriesPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas COM menu */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Feed />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Rotas SEM menu (fullscreen) */}
        <Route path="/stories/:userId" element={<StoriesPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
