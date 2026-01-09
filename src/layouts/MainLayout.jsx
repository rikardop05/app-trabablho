import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      
      {/* Área principal */}
      <main className="flex-1 w-full pt-6 pb-28">
        
        {/* CONTAINER RESPONSIVO REAL */}
        <div
          className="
            w-full
            px-0
            sm:px-2
            lg:px-0
            flex
            justify-center
          "
        >

          {/* CANVAS DO CONTEÚDO */}
          <div
            className="
              w-full
              max-w-[1500px]
              bg-gray-50
              dark:bg-gray-900
            "
          >
            <Outlet />
          </div>
        </div>

      </main>

      {/* Navbar fixa */}
      <Navbar />
    </div>
  )
}

