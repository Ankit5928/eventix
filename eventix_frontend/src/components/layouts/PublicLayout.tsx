import { Outlet, Link } from "react-router-dom";
import { useAppSelector } from "../../store";
import { RootState } from "../../store";
import { Button } from "../ui/Button";
import Footer from "./footer";
import { Ticket, User, LayoutDashboard, Sparkles } from "lucide-react";

export default function PublicLayout() {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  return (
    <div className="premium-page-container min-h-screen flex flex-col bg-background">
      {/* Background depth for the layout level */}
      <div className="premium-bg-overlay opacity-30" />

      {/* Premium Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-10">
        <div className="container mx-auto h-16 flex items-center justify-between px-6 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-[#FF3333] to-[#990000] rounded-lg flex items-center justify-center shadow-lg shadow-[#FF3333]/20 group-hover:rotate-12 transition-transform duration-500">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Event<span className="text-[#FF3333]">ix</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6 md:gap-8">
            <Link
              to="/my-tickets"
              className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-[#FF3333] transition-all"
            >
              <Ticket className="w-3 h-3" />
              My Tickets
            </Link>

            <div className="h-4 w-px bg-white/10 hidden md:block" />

            {isAuthenticated ? (
              <Button
                variant="premium"
                size="sm"
                asChild
                className="rounded-full px-6 h-9 text-[10px] tracking-widest"
              >
                <Link to="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="w-3 h-3" />
                  Terminal
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Button
                  variant="premium"
                  size="sm"
                  asChild
                  className="rounded-full px-6 h-9 text-[10px] tracking-widest"
                >
                  <Link to="/register" className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    Join
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-24 relative z-10">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}
