import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setCredentials } from "../../store/slices/authSlice";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import {
  AlertCircle,
  Shield,
  Mail,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import apiClient from "../../service/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { token, userId, organizationIds, role } = response.data;

      dispatch(
        setCredentials({
          token,
          user: {
            id: String(userId),
            email: email,
            roles: role ? [role] : [],
            currentOrganizationId:
              organizationIds && organizationIds.length > 0
                ? organizationIds[0]
                : 0,
          },
          organizationIds: organizationIds ? organizationIds.map(String) : [],
        }),
      );
      navigate("/dashboard");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Invalid credentials.";
      setError(
        typeof errMsg === "string" ? errMsg : "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const eventImages = [
    {
      src: "https://images.unsplash.com/photo-1682632618859-47904338bea1?q=80&w=1170&auto=format&fit=crop",
      title: "Global Summit",
      cat: "Elite",
    },
    {
      src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1170&auto=format&fit=crop",
      title: "Concours d'Elegance",
      cat: "Luxury",
    },
    {
      src: "https://images.unsplash.com/photo-1765510103179-0c2f628d2ff2?q=80&w=1172&auto=format&fit=crop",
      title: "Opera Gala",
      cat: "Arts",
    },
    {
      src: "https://images.unsplash.com/photo-1708569176850-9de9aa6b179b?q=80&w=1170&auto=format&fit=crop",
      title: "Royal Wedding",
      cat: "Private",
    },
  ];

  return (
    <div
      className={`h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-background ${mounted ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      <div className="smoke-overlay" />

      {/* Left Side: Cinematic Narrative */}
      <div className="lg:w-[55%] relative hidden lg:block overflow-hidden border-r border-white/10">
        {/* Moving Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF0000]/10 via-transparent to-transparent z-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FF0000]/5 rounded-full blur-[120px] animate-pulse" />

        <div className="relative h-full w-full p-12 flex flex-col justify-between z-20">
          {/* Branding */}
          <div className="flex items-center gap-4 animate-fade-in-up">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF0000] to-[#4D0000] rounded-xl flex items-center justify-center shadow-2xl shadow-red-600/30">
              <span className="text-2xl font-bold text-white tracking-tighter italic">
                E
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                Event<span className="text-[#FF0000]">ix</span>
              </h2>
              <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-bold">
                International Consortium
              </p>
            </div>
          </div>

          {/* Main Hero Text */}
          <div className="max-w-xl space-y-6">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">
                Access Granted to the Elite
              </span>
            </div>
            <h1 className="text-6xl xl:text-7xl font-bold text-[#1a2f1a] tracking-tighter leading-[0.9] italic">
              Curating{" "}
              <span className="premium-gradient-text">World Class</span>{" "}
              Narratives.
            </h1>
            <p className="text-[#1a2f1a]/50 text-lg font-light leading-relaxed max-w-md italic">
              The global terminal for high-stakes organizers. Manage legendary
              experiences with unparalleled precision.
            </p>
          </div>

          {/* Mini Portfolio Preview */}
          <div className="grid grid-cols-4 gap-4">
            {eventImages.map((img, i) => (
              <div
                key={i}
                className="group relative h-32 rounded-xl overflow-hidden border border-white/20 transition-all hover:scale-105 hover:border-[#FF0000]/50"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover brightness-50 group-hover:brightness-100 transition-all"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[8px] text-[#FF0000] font-bold uppercase tracking-widest">
                    {img.cat}
                  </p>
                  <p className="text-[10px] text-white font-bold leading-tight">
                    {img.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Luxury Authentication Terminal */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-background to-[#1a0000] relative">
        {/* Subtle Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#FF0000 0.5px, transparent 0.5px)`,
            backgroundSize: "24px 24px",
          }}
        ></div>

        <Card
          className={`w-full max-w-[420px] bg-[#050505]/80 backdrop-blur-3xl border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative overflow-hidden transition-all duration-1000 delay-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          {/* Top Accent Line */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#FF0000] to-transparent opacity-50" />

          <CardHeader className="space-y-6 pt-12 pb-8 text-center">
            <div className="mx-auto w-20 h-20 bg-white/[0.03] border border-white/5 rounded-full flex items-center justify-center relative group">
              <Shield className="h-8 w-8 text-[#FF0000] transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 rounded-full border border-[#FF0000]/20 animate-ping opacity-20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-white uppercase italic">
                Terminal Login
              </h2>
              <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">
                Authorized Personnel Only
              </p>
            </div>
          </CardHeader>

          <CardContent className="px-10 pb-10">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 animate-in fade-in zoom-in-95">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] pl-1">
                  Encryption Key (Email)
                </label>
                <div className="relative group">
                  <Input
                    type="email"
                    placeholder="ACCESS_ID@EVENTIX.INT"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-14 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#FF0000]/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10 text-xs font-bold tracking-widest"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/10 group-focus-within:text-[#FF0000]/50 transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] pl-1">
                  Passcode
                </label>
                <div className="relative group">
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-14 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#FF0000]/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10 text-xs font-bold tracking-widest"
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/10 group-focus-within:text-[#FF0000]/50 transition-colors" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-[#FF0000] to-[#4D0000] hover:brightness-125 text-white border-0 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-red-900/50 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Establish Connection <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 pt-0 pb-12 px-10 border-0">
            <div className="w-full h-px bg-white/5" />
            <div className="flex flex-col items-center gap-4">
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                New Strategist?{" "}
                <Link
                  to="/register"
                  className="text-[#FF0000] hover:text-white transition-colors"
                >
                  Request Access
                </Link>
              </p>
              <div className="flex gap-6">
                {["Privacy", "Protocol", "Terms"].map((item) => (
                  <Link
                    key={item}
                    to="#"
                    className="text-[9px] text-white/20 hover:text-white transition-colors uppercase font-bold tracking-[0.2em]"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      <style>{`
        .premium-gradient-text {
          background: linear-gradient(to right, #FF0000, #8B0000, #FF0000);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: text-gradient 4s linear infinite;
        }
        @keyframes text-gradient {
          to { background-position: 200% center; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
