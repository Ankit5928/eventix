import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../service/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMode, setSuccessMode] = useState(false);

  useEffect(() => {
    // If someone wanders here without a token, boot them to login
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post('/auth/set-password', {
        token,
        newPassword
      });
      // Verification successful, lock the form into success mode
      setSuccessMode(true);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.response?.data || "Failed to set password. Your token may be invalid or expired.";
      setError(typeof errMsg === "string" ? errMsg : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-primary/10">
      <Card className="w-full max-w-md shadow-2xl animate-fade-in-up border-primary/20 backdrop-blur-sm bg-background/90">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <span className="text-2xl font-bold text-white">E</span>
          </div>
          <CardTitle className="text-3xl font-heading">
            {successMode ? "Password Set!" : "Set Your Password"}
          </CardTitle>
          <CardDescription>
            {successMode 
              ? "Your account is now ready." 
              : "Welcome to Eventix. Please securely choose a password for your account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {successMode ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
              <Button onClick={() => navigate('/login')} className="w-full mt-4" size="lg">
                Proceed to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSetPassword} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-start gap-2 border border-destructive/20 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input 
                label="New Password" 
                type="password" 
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                disabled={isLoading}
              />
              <Input 
                label="Confirm Password" 
                type="password" 
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" className="w-full mt-6" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     Setting Password...
                  </div>
                ) : "Set Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
