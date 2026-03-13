import { useState, useEffect } from "react";
import { useAppSelector } from "../store";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import paymentService from "../service/paymentService";
import organizationService from "../service/organizationService";
import { StripeConfigRequest } from "../types/payment.types";
import {
  Users,
  Shield,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Building2,
  Loader2,
  Crown,
  Key,
  Globe,
  Settings as SettingsIcon,
} from "lucide-react";
import { AddUserRequest } from "../types/organization.types";

const SettingsPage = () => {
  const { currentOrganizationId, user } = useAppSelector((state) => state.auth);
  const isOwner = user?.roles?.includes("OWNER");
  const orgId = currentOrganizationId ? Number(currentOrganizationId) : null;

  // ── Team invite state ──
  const [formData, setFormData] = useState<AddUserRequest>({
    email: "",
    role: "ORGANIZER",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ── Stripe config state ──
  const [stripeForm, setStripeForm] = useState<StripeConfigRequest>({
    stripePublishableKey: "",
    stripeSecretKey: "",
  });
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [stripeSuccess, setStripeSuccess] = useState<string | null>(null);

  // ── Org details state ──
  const [orgName, setOrgName] = useState("");
  const [orgCreatedAt, setOrgCreatedAt] = useState("");
  const [orgUsers, setOrgUsers] = useState<any[]>([]);

  useEffect(() => {
    if (orgId) {
      organizationService
        .getDetails(orgId)
        .then((org) => {
          setOrgName(org.name);
          setOrgCreatedAt(org.createdAt);
          setOrgUsers(org.users || []);
        })
        .catch(() => { });
    }
  }, [orgId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await organizationService.addUser(orgId, formData);
      setSuccess(`Liaison authorized: ${formData.email}`);
      setFormData({ email: "", role: "ORGANIZER" });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Protocol violation. Invite failed.";
      setError(typeof errMsg === "string" ? errMsg : "System error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    setStripeLoading(true);
    setStripeError(null);
    setStripeSuccess(null);
    try {
      await paymentService.updateStripeConfig(orgId, stripeForm);
      setStripeSuccess("Financial gateway synchronized.");
      setStripeForm({ stripePublishableKey: "", stripeSecretKey: "" });
    } catch (err: any) {
      setStripeError("Validation failed. Check encryption keys.");
    } finally {
      setStripeLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in-up p-4 md:p-10 max-w-5xl mx-auto bg-[#0A0000] text-white min-h-screen">

      {/* Header Section */}
      <div className="border-b border-white/5 pb-8">
        <div className="flex items-center gap-2 text-[#FF3333] mb-2">
          <SettingsIcon className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Control Terminal</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter italic">System <span className="text-[#FF3333]">Configurations</span></h1>
        <p className="text-white/40 text-xs mt-2 uppercase tracking-widest font-medium">Manage hierarchy, liaisons, and global clearing</p>
      </div>

      <div className="grid gap-10">

        {/* ── Organization Profile ── */}
        <Card variant="premium" className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
          <CardHeader className="bg-white/[0.01] border-b border-white/5 p-8">
            <CardTitle className="flex items-center gap-3 text-xl italic font-bold tracking-tight">
              <Building2 className="w-5 h-5 text-[#FF3333]" />
              Organization Identity
            </CardTitle>
            <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Registry Details & Authorized Personnel</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Entity Designation</span>
                <p className="text-xl font-bold text-white tracking-tight">{orgName || "—"}</p>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Commencement Date</span>
                <p className="text-sm font-bold text-white/60">
                  {orgCreatedAt ? new Date(orgCreatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "—"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
                <Users className="w-3 h-3 text-[#FF3333]" /> Active Liaisons
              </span>
              <div className="grid gap-3">
                {orgUsers.map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF3333]/20 to-transparent flex items-center justify-center text-[#FF3333] font-bold border border-[#FF3333]/10">
                        {u.firstName?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{u.firstName} {u.lastName}</p>
                        <p className="text-[10px] text-white/30 tracking-tight">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black px-3 py-1 rounded-full bg-[#FF3333]/10 text-[#FF3333] uppercase tracking-widest border border-[#FF3333]/20">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Team Management ── */}
        <Card variant="premium" className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
          <CardHeader className="bg-white/[0.01] border-b border-white/5 p-8">
            <CardTitle className="flex items-center gap-3 text-xl italic font-bold tracking-tight text-white">
              <Users className="w-5 h-5 text-[#FF3333]" />
              Liaison Recruitment
            </CardTitle>
            <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Authorize new members to control local nodes</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {!isOwner ? (
              <div className="p-4 rounded-xl bg-yellow-500/5 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3">
                <AlertCircle className="w-4 h-4" /> Restricted: Owner Authorization Required
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-6">
                {(error || success) && (
                  <div className={`p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 border ${error ? 'bg-red-500/5 text-red-500 border-red-500/20' : 'bg-green-500/5 text-green-500 border-green-500/20'}`}>
                    {error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    {error || success}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1">Communication Channel (Email)</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="identity@consortium.int"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#FF3333]/50 text-white placeholder:text-white/10 text-xs font-bold tracking-widest"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1">Assigned Protocol Role</label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-[#FF3333]/50 appearance-none transition-all cursor-pointer"
                      >
                        <option value="ORGANIZER" className="bg-[#0A0000]">ORGANIZER (FULL CLEARANCE)</option>
                        <option value="CHECK_IN_OPERATOR" className="bg-[#0A0000]">CHECK_IN_OPERATOR (FIELD ACCESS)</option>
                      </select>
                      <Shield className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="premium" type="submit" disabled={isLoading} className="h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-[#FF3333]/10">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Dispatch Authorization"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* ── Stripe Configuration ── */}
        {isOwner && (
          <Card variant="premium" className="bg-white/[0.02] border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
            <CardHeader className="bg-white/[0.01] border-b border-white/5 p-8">
              <CardTitle className="flex items-center gap-3 text-xl italic font-bold tracking-tight text-white">
                <CreditCard className="w-5 h-5 text-[#FF3333]" />
                Clearing Configuration
              </CardTitle>
              <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">
                Establish secure financial clearing via Stripe.{" "}
                <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" className="text-[#FF3333] hover:text-white transition-colors underline underline-offset-4">Get Terminal Keys</a>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleStripeSubmit} className="space-y-6">
                {(stripeError || stripeSuccess) && (
                  <div className={`p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 border ${stripeError ? 'bg-red-500/5 text-red-500 border-red-500/20' : 'bg-green-500/5 text-green-500 border-green-500/20'}`}>
                    {stripeError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    {stripeError || stripeSuccess}
                  </div>
                )}
                <div className="grid gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> Public Clearance Key
                    </label>
                    <Input
                      name="stripePublishableKey"
                      placeholder="pk_test_••••••••"
                      value={stripeForm.stripePublishableKey}
                      onChange={(e) => setStripeForm({ ...stripeForm, stripePublishableKey: e.target.value })}
                      required
                      disabled={stripeLoading}
                      className="h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#FF3333]/50 text-white placeholder:text-white/10 text-xs font-bold tracking-widest"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] pl-1 flex items-center gap-2">
                      <Key className="w-3 h-3" /> Secret Encryption Key
                    </label>
                    <Input
                      name="stripeSecretKey"
                      type="password"
                      placeholder="sk_test_••••••••"
                      value={stripeForm.stripeSecretKey}
                      onChange={(e) => setStripeForm({ ...stripeForm, stripeSecretKey: e.target.value })}
                      required
                      disabled={stripeLoading}
                      className="h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-[#FF3333]/50 text-white placeholder:text-white/10 text-xs font-bold tracking-widest"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="premium" type="submit" disabled={stripeLoading} className="h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-[#FF3333]/10">
                    {stripeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Security Configuration"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;