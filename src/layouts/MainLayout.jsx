import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Conteúdo */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900" style={{ padding: '30px 150px 250px 150px' }} data-mobile-padding="true" data-desktop-padding="30px 150px 250px 150px">
        <Outlet />
      </main>

      {/* Navbar fora de qualquer container */}
      <Navbar />
    </div>
  )
}
