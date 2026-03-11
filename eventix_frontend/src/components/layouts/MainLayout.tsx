import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/commons/Sidebar"; // Using your sidebar

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        {" "}
        {/* Margin to offset fixed sidebar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-end">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold">Organizer Account</p>
              <p className="text-xs text-gray-500">Eventix Pro</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              OP
            </div>
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
