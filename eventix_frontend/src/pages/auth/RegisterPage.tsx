import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import apiClient from "../../service/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: "",
    ownerEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
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
      // Wait a moment then redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err: any) {
      const errMsg = err.response?.data || "Registration failed. Please try again.";
      setError(typeof errMsg === "string" ? errMsg : errMsg.message || "Registration failed.");
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left side: branding/imagery */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-indigo-900 via-primary to-purple-900 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-accent opacity-20 blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-xl">E</span>
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">
            Eventix
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Everything you need to run incredible events.
          </h1>
          <p className="text-indigo-100 text-lg max-w-md">
            The all-in-one ticketing and management platform built for modern organizers. Scale your audience securely.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-indigo-200 text-sm">
          <span>Enterprise Grade Security</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          <span>Stripe Integration</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          <span>Multi-Tenant</span>
        </div>
      </div>

      {/* Right side: form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <span className="text-xl font-bold">Eventix</span>
        </div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-foreground">
              Create an account
            </h2>
            <p className="text-muted-foreground mt-2">
              Start setting up your organization and selling tickets.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-start gap-2 border border-destructive/20 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="p-4 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm flex items-center gap-3 border border-green-500/20 animate-in fade-in">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span className="font-medium">Registration successful! Redirecting to login...</span>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Organization Name"
                name="organizationName"
                placeholder="My Event Company"
                value={formData.organizationName}
                onChange={handleChange}
                required
                disabled={isLoading || success}
              />

              <Input
                label="Work Email"
                name="ownerEmail"
                type="email"
                placeholder="name@company.com"
                value={formData.ownerEmail}
                onChange={handleChange}
                required
                disabled={isLoading || success}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading || success}
              />
              
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading || success}
              />
            </div>

            <Button
              type="submit"
              className="w-full font-semibold relative overflow-hidden group"
              size="lg"
              disabled={isLoading || success}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Creating Account...
                </div>
              ) : success ? (
                "Success"
              ) : (
                <>
                  <span className="relative z-10">Register Organization</span>
                  <div className="absolute inset-0 h-full w-full scale-[0] rounded-lg transition-all duration-300 group-hover:scale-[100%] group-hover:bg-white/10 z-0"></div>
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
