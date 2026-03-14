import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "../commons/Button";
import Input from "../commons/Input";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = "login",
}) => {
  const [view, setView] = useState(initialView);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {view === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            {view === "login"
              ? "Manage your events and tickets."
              : "Start organizing your events today."}
          </p>

          <form className="space-y-4">
            {view === "register" && (
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" placeholder="John" />
                <Input label="Last Name" placeholder="Doe" />
              </div>
            )}
            <Input label="Email" type="email" placeholder="email@example.com" />
            <Input label="Password" type="password" placeholder="••••••••" />

            <Button variant="primary" className="w-full py-3">
              {view === "login" ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">
              {view === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <button
              onClick={() => setView(view === "login" ? "register" : "login")}
              className="ml-1 text-blue-600 font-semibold hover:underline"
            >
              {view === "login" ? "Register" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
