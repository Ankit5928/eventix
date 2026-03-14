import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../../service/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import {
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Sparkles,
  Loader2,
  Key,
} from "lucide-react";

export default function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMode, setSuccessMode] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Timeline violation: Password mismatch detected.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Security violation: Minimum 8 characters required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post("/auth/set-password", {
        token,
        newPassword,
      });
      setSuccessMode(true);
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        "Protocol Failure: Your authorization token is invalid.";
      setError(typeof errMsg === "string" ? errMsg : "System error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF3333]/5 blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border-white/5 rounded-[2.5rem] shadow-2xl animate-fade-in-up relative overflow-hidden">
        {/* Top Accent Trace */}
        <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#FF3333] to-transparent opacity-50" />

        <CardHeader className="text-center space-y-4 pt-10">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#FF3333] to-[#990000] rounded-2xl flex items-center justify-center mb-2 shadow-2xl shadow-[#FF3333]/20 relative group">
            <Lock className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-[#FF3333]">
              <ShieldCheck className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                Security Node
              </span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tighter italic text-white uppercase">
              {successMode ? "Access Granted" : "Initialize Key"}
            </CardTitle>
            <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest leading-relaxed px-8">
              {successMode
                ? "Credential synchronization complete. Your node is now active."
                : "Welcome to the Consortium. Establish your encryption key below."}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-10 pt-0">
          {successMode ? (
            <div className="flex flex-col items-center justify-center space-y-8 py-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                <CheckCircle2 className="w-10 h-10 text-green-500 animate-in zoom-in duration-500" />
              </div>
              <Button
                variant="premium"
                onClick={() => navigate("/login")}
                className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] border-0"
              >
                Proceed to Terminal
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSetPassword} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in zoom-in-95">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
                    <Key className="w-3 h-3 text-[#FF3333]" /> New Encryption
                    Key
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#FF3333]/50 text-white placeholder:text-white/10 text-xs font-bold tracking-widest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-[#FF3333]" /> Confirm
                    Key
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#FF3333]/50 text-white placeholder:text-white/10 text-xs font-bold tracking-widest"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="premium"
                className="w-full h-12 mt-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#FF3333]/20 border-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authorizing...
                  </div>
                ) : (
                  "Establish Credential"
                )}
              </Button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-white transition-colors"
                >
                  Return to Node
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
