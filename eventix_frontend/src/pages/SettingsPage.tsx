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
      setSuccess(
        `Successfully added ${formData.email} as ${formData.role.replace("_", " ")}.`
      );
      setFormData({ email: "", role: "ORGANIZER" });
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to invite team member.";
      setError(typeof errMsg === "string" ? errMsg : "An unexpected error occurred.");
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
      setStripeSuccess("Stripe keys saved successfully.");
      setStripeForm({ stripePublishableKey: "", stripeSecretKey: "" });
    } catch (err: any) {
      setStripeError(
        err.response?.data?.message || "Failed to save Stripe configuration."
      );
    } finally {
      setStripeLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up p-4 md:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your organization, team, and payment configuration.
        </p>
      </div>

      <div className="grid gap-8">
        {/* ── Organization Profile ── */}
        <Card className="border-primary/10 shadow-sm backdrop-blur-sm bg-card/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Organization Profile
            </CardTitle>
            <CardDescription>
              Your organization details and membership info.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name</span>
                <p className="font-medium text-foreground">{orgName || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Created</span>
                <p className="font-medium text-foreground">
                  {orgCreatedAt
                    ? new Date(orgCreatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    : "—"}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="text-muted-foreground">Team Members</span>
                <div className="mt-2 space-y-2">
                  {orgUsers.length === 0 && (
                    <p className="text-muted-foreground text-xs">No members loaded.</p>
                  )}
                  {orgUsers.map((u: any) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between py-1.5 px-3 bg-muted/30 rounded-md text-sm"
                    >
                      <span>
                        {u.firstName} {u.lastName}{" "}
                        <span className="text-muted-foreground">({u.email})</span>
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Team Management ── */}
        <Card className="border-primary/10 shadow-sm backdrop-blur-sm bg-card/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Team Management
            </CardTitle>
            <CardDescription>
              Invite new members to collaborate on your events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isOwner ? (
              <div className="p-4 rounded-lg bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 text-sm">
                Only Organization Owners can invite team members.
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-start gap-2 border border-destructive/20">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded-lg bg-green-500/10 text-green-600 text-sm flex items-start gap-2 border border-green-500/20">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Assign Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="flex h-10 w-full rounded-md border border-input bg-background/50 pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 transition-colors"
                      >
                        {/* Add the ORGANIZER option here */}
                        <option value="ORGANIZER">Organizer (Full Event Access)</option>

                        <option value="CHECK_IN_OPERATOR">
                          Check-in Operator (Door/Scanning Only)
                        </option>

                        {/* If your backend supports it, you can also add other roles here */}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Inviting...
                      </div>
                    ) : (
                      "Send Invitation"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* ── Stripe Configuration ── */}
        {isOwner && (
          <Card className="border-primary/10 shadow-sm backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Stripe Payment Configuration
              </CardTitle>
              <CardDescription>
                Add your Stripe API keys to accept payments.{" "}
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  Get your keys
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStripeSubmit} className="space-y-4">
                {stripeError && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-start gap-2 border border-destructive/20">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{stripeError}</span>
                  </div>
                )}
                {stripeSuccess && (
                  <div className="p-3 rounded-lg bg-green-500/10 text-green-600 text-sm flex items-start gap-2 border border-green-500/20">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{stripeSuccess}</span>
                  </div>
                )}
                <Input
                  label="Publishable Key"
                  name="stripePublishableKey"
                  placeholder="pk_test_..."
                  value={stripeForm.stripePublishableKey}
                  onChange={(e) =>
                    setStripeForm({ ...stripeForm, stripePublishableKey: e.target.value })
                  }
                  required
                  disabled={stripeLoading}
                />
                <Input
                  label="Secret Key"
                  name="stripeSecretKey"
                  type="password"
                  placeholder="sk_test_..."
                  value={stripeForm.stripeSecretKey}
                  onChange={(e) =>
                    setStripeForm({ ...stripeForm, stripeSecretKey: e.target.value })
                  }
                  required
                  disabled={stripeLoading}
                />
                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={stripeLoading}
                    className="w-full md:w-auto"
                  >
                    {stripeLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      "Save Stripe Keys"
                    )}
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
