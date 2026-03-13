import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/Button";
import Sidebar from "../commons/Sidebar";
import NotificationToast from "../commons/NotificationToast";
import Footer from "./footer";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0000] flex flex-col">
      {/* Mobile Header - Only visible on small screens */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0A0000] sticky top-0 z-[60]">
        <span className="text-xl font-black tracking-tighter text-white uppercase italic">
          Event<span className="text-[#FF3333]">ix</span>
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/5"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar Container */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0
          `}
        >
          <Sidebar />
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area - THE FIX IS HERE (md:pl-64) */}
        <main className="flex-1 w-full min-w-0 md:pl-64 bg-[#0A0000] flex flex-col">
          <div className="p-4 md:p-10 flex-1">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </div>

          <Footer />
        </main>
      </div>

      <NotificationToast />
    </div>
  );
}