import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { AlertCircle, CheckCircle2, Ticket, Shield, ChevronRight, Sparkles, Crown } from "lucide-react";
import apiClient from "../../service/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    ownerEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Credentials mismatch.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Insecure passcode length.");
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post("/auth/register", {
        organizationName: formData.organizationName,
        ownerEmail: formData.ownerEmail,
        password: formData.password,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err: any) {
      const errMsg = err.response?.data || "Protocol error.";
      setError(typeof errMsg === "string" ? errMsg : "Request denied.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const showcaseImages = [
    { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1170&auto=format&fit=crop", cat: "Summits" },
    { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1169&auto=format&fit=crop", cat: "Galas" },
    { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1170&auto=format&fit=crop", cat: "Elite" },
    { src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1170&auto=format&fit=crop", cat: "VIP" },
  ];

  return (
    <>
      <link href="https://fonts.cdnfonts.com/css/olivia-southmore" rel="stylesheet" />

      <div className={`h-screen w-screen flex flex-col lg:flex-row overflow-hidden bg-[#0A0000] ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>

        {/* Left Side: Cinematic Narrative */}
        <div className="lg:w-[60%] relative hidden lg:block overflow-hidden border-r border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A0000] via-transparent to-transparent z-10" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FF3333]/10 rounded-full blur-[120px] animate-pulse" />

          <div className="relative h-full w-full p-16 flex flex-col justify-between z-20">
            <div className="flex items-center gap-4 animate-fade-in-up">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF3333] to-[#990000] rounded-xl flex items-center justify-center shadow-2xl shadow-[#FF3333]/30">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">Event<span className="text-[#FF3333]">ix</span></h2>
                <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase font-bold">Consortium Protocol</p>
              </div>
            </div>

            <div className="max-w-xl space-y-6">
              <div className="flex items-center gap-2 text-[#FF3333]">
                <Crown className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.3em]">Founding Partner Program</span>
              </div>
              <h1 className="text-6xl xl:text-8xl font-bold text-white tracking-tighter leading-[0.85] italic" style={{ fontFamily: "'Olivia Southmore', serif" }}>
                Establish Your <br />
                <span className="premium-gradient-text">Event Empire.</span>
              </h1>
              <p className="text-white/40 text-lg font-light leading-relaxed max-sm italic">
                Architect legendary experiences with precision.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {showcaseImages.map((img, i) => (
                <div key={i} className="group relative h-28 rounded-xl overflow-hidden border border-white/10 transition-all hover:scale-105 hover:border-[#FF3333]/50">
                  <img src={img.src} alt={img.cat} className="w-full h-full object-cover brightness-50 group-hover:brightness-100 transition-all duration-700" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Slim Luxury Terminal */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-b from-[#111] to-[#0A0000] relative">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#FF3333 0.5px, transparent 0.5px)`, backgroundSize: '32px 32px' }}></div>

          <div className={`w-full max-w-[340px] bg-gradient-to-b from-[#1A0000] to-[#050000] backdrop-blur-3xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative overflow-hidden rounded-[2.5rem] transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FF3333] to-transparent" />

            <div className="space-y-3 pt-10 pb-4 text-center px-8">
              <div className="mx-auto w-14 h-14 bg-white/[0.03] border border-white/5 rounded-full flex items-center justify-center relative">
                <Sparkles className="h-6 w-6 text-[#FF3333]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-white uppercase italic" style={{ fontFamily: "'Olivia Southmore', serif" }}>Join Consortium</h2>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.3em]">Identity Authentication</p>
              </div>
            </div>

            <div className="px-8 pb-10 text-white"> {/* Applied white text to the form container */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="h-3 w-3" /> {error}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em] pl-1">Organization ID</label>
                  <Input
                    name="organizationName"
                    placeholder="ENTER NAME"
                    required
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="h-10 bg-white/[0.05] border-white/10 rounded-xl focus:border-[#FF3333]/50 text-white placeholder:text-white/20 text-[10px] font-bold tracking-widest transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em] pl-1">Liaison Email</label>
                  <Input
                    name="ownerEmail"
                    type="email"
                    placeholder="EMAIL_ADDRESS"
                    required
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    className="h-10 bg-white/[0.05] border-white/10 rounded-xl focus:border-[#FF3333]/50 text-white placeholder:text-white/20 text-[10px] font-bold tracking-widest transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em] pl-1">Secret Passcode</label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="h-10 bg-white/[0.05] border-white/10 rounded-xl focus:border-[#FF3333]/50 text-white placeholder:text-white/20 text-[10px] font-bold tracking-widest transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em] pl-1">Confirm Identity</label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="h-10 bg-white/[0.05] border-white/10 rounded-xl focus:border-[#FF3333]/50 text-white placeholder:text-white/20 text-[10px] font-bold tracking-widest transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || success}
                  className="w-full h-11 bg-gradient-to-r from-[#FF3333] to-[#990000] hover:brightness-110 text-white border-0 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#FF3333]/10 mt-2"
                >
                  {isLoading ? "Synchronizing..." : "Initialize Access"}
                </Button>
              </form>
            </div>

            <div className="flex flex-col gap-6 pt-0 pb-10 px-8">
              <div className="w-full h-px bg-white/10" />
              <div className="text-center">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">
                  Existing Partner? <Link to="/login" className="text-[#FF3333] hover:text-white transition-colors">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .premium-gradient-text {
          background: linear-gradient(to right, #FF3333, #FF6666, #FF3333);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: text-gradient 4s linear infinite;
        }
        @keyframes text-gradient { to { background-position: 200% center; } }
      `}</style>
    </>
  );
};

export default RegisterPage;