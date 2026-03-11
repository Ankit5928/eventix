import { useState } from "react";
import { useAppSelector } from "../store";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { inviteUserToOrganization, AddUserRequest } from "../service/orgService";
import { Users, Shield, AlertCircle, CheckCircle2 } from "lucide-react";

const SettingsPage = () => {
  const { currentOrganizationId, user } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<AddUserRequest>({
    email: "",
    role: "ORGANIZER",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isOwner = user?.roles?.includes('OWNER');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganizationId) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await inviteUserToOrganization(currentOrganizationId, formData);
      setSuccess(`Successfully added ${formData.email} as ${formData.role.replace('_', ' ')}.`);
      setFormData({ email: "", role: "ORGANIZER" }); // Reset form
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.response?.data || "Failed to invite team member.";
      setError(typeof errMsg === "string" ? errMsg : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up p-4 md:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-heading">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your organization and team members.</p>
      </div>

      <div className="grid gap-8">
        {/* Team Management Card */}
        <Card className="border-primary/10 shadow-sm backdrop-blur-sm bg-card/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Team Management
            </CardTitle>
            <CardDescription>
              Invite new members to collaborate on your events and check-in attendees.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isOwner ? (
              <div className="p-4 rounded-lg bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 text-sm">
                You do not have permission to invite team members. Only Organization Owners can perform this action.
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-start gap-2 border border-destructive/20 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-sm flex items-start gap-2 border border-green-500/20 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
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
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
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
                        className="flex h-10 w-full rounded-md border border-input bg-background/50 pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                      >
                        <option value="ORGANIZER">Organizer (Full Access)</option>
                        <option value="CHECK_IN_OPERATOR">Check-in Operator (Door Access Only)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         Inviting...
                      </div>
                    ) : "Send Invitation"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default SettingsPage;
