import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import AuthModal from "../auth/AuthModal";
import Button from "../commons/Button";

const PublicLayout = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Eventix
          </Link>
          <div className="flex gap-4">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-sm font-semibold text-gray-700 hover:text-blue-600"
            >
              Log In
            </button>
            <Button variant="primary" onClick={() => setIsAuthOpen(true)}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default PublicLayout;
