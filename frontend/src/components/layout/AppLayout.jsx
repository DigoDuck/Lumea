import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Aurora from "../Aurora";

export default function AppLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white/80">
      
      {/* 1. Camada de Fundo (Aurora) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={["#9252ff", "#bc6bf6", "#7d19f8"]}
          amplitude={1}
          blend={0.75}
        />
        {/* Overlay para suavizar e dar o tom "Light Mode" */}
        <div className="absolute inset-0 bg-white/45 backdrop-blur-[20px]" />
      </div>
      
      <div className="relative z-10 flex h-screen">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}