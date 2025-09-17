
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Lock, Mail, Shield, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user has admin/creator role
        const [{ data: isAdmin }, { data: isCreator }] = await Promise.all([
          supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' }),
          supabase.rpc('has_role', { _user_id: session.user.id, _role: 'creator' }),
        ]);
        
        if (isAdmin || isCreator) {
          navigate('/admin');
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!credentials.username || !credentials.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      // 1) Sign in with Supabase Auth
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.username,
        password: credentials.password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        
        let errorMessage = 'Login failed. Please try again.';
        if (signInError.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (signInError.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email address before logging in.';
        } else if (signInError.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      if (!signInData.session || !signInData.user) {
        setError('Login failed. Please try again.');
        setLoading(false);
        return;
      }

      const user = signInData.user;

      // 2) Verify role: admin or creator
      const [{ data: isAdmin, error: adminErr }, { data: isCreator, error: creatorErr }] = await Promise.all([
        supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }),
        supabase.rpc('has_role', { _user_id: user.id, _role: 'creator' }),
      ]);

      if (adminErr || creatorErr) {
        console.error('Role check failed', adminErr || creatorErr);
        await supabase.auth.signOut();
        setError('Role verification failed. Please contact support.');
        toast.error('Role verification failed. Please contact support.');
        setLoading(false);
        return;
      }

      if (!isAdmin && !isCreator) {
        await supabase.auth.signOut();
        setError('Access denied. Your account does not have admin privileges. Please contact an administrator.');
        toast.error('Access denied. Your account does not have admin privileges.');
        setLoading(false);
        return;
      }

      // Success - redirect to admin dashboard
      toast.success('Welcome! Redirecting to dashboard...');
      
      // Small delay to show success message
      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Back to home link */}
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-3 py-2 rounded-lg border border-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="w-full shadow-2xl border border-white/10 bg-white/10 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25 animate-pulse">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Admin Portal
              </CardTitle>
              <CardDescription className="text-lg mt-2 text-white/70">
                Secure access to content management
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-400/50 bg-red-500/10 backdrop-blur-sm">
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <Input
                    type="email"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    placeholder="admin@example.com"
                    className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/25 backdrop-blur-sm"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Enter your password"
                    className="pl-10 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/25 backdrop-blur-sm"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Access Dashboard</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-sm text-white/70">
                Authorized personnel only
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-white/50">
            Protected by advanced security protocols
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
