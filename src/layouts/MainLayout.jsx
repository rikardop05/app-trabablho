import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Outlet />
      <Navbar />
    </div>
  )
}
