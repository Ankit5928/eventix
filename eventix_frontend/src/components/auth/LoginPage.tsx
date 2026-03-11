import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../../store/slices/authSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AlertCircle } from 'lucide-react';
import apiClient from '../../service/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });

      const { token, userId, organizationIds, role } = response.data;

      // Extract details and dispatch to Redux store
      dispatch(setCredentials({
        token,
        user: { 
          id: String(userId), 
          email: email, 
          roles: role ? [role] : [] 
        },
        // Backend returns an array of longs, convert to string array
        organizationIds: organizationIds ? organizationIds.map(String) : []
      }));

      // Successfully authenticated
      navigate('/dashboard');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.response?.data || "Invalid email or password.";
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
          <CardTitle className="text-3xl font-heading">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Eventix Organizer account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-start gap-2 border border-destructive/20 animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input 
              label="Email Address" 
              type="email" 
              placeholder="you@example.com" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Input 
              label="Password" 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" className="w-full mt-6" size="lg" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Signing In...
                </div>
              ) : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground border-t pt-6">
          <p>Don't have an organization? <Link to="/register" className="text-primary hover:underline font-medium">Register here</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}
