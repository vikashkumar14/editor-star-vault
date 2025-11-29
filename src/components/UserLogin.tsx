import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Mail, Phone, Github, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [emailForm, setEmailForm] = useState({ email: '', password: '', name: '' });
  const [phoneForm, setPhoneForm] = useState({ phone: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login with better validation
        if (!emailForm.email || !emailForm.password) {
          toast.error('Please enter both email and password');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailForm.email.trim(),
          password: emailForm.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please try again.');
          } else {
            toast.error(error.message);
          }
        } else if (data.session) {
          toast.success('Login successful! Redirecting...');
          // Small delay to show the success message
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 500);
        }
      } else {
        // Signup with validation
        if (!emailForm.name || !emailForm.email || !emailForm.password) {
          toast.error('Please fill in all fields');
          setLoading(false);
          return;
        }

        if (emailForm.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: emailForm.email.trim(),
          password: emailForm.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: emailForm.name.trim(),
            },
          },
        });

        if (error) {
          if (error.message.includes('captcha')) {
            toast.error('Signup is temporarily disabled. Please try social login (Google/GitHub).');
          } else if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please login instead.');
            setIsLogin(true);
          } else {
            toast.error(error.message);
          }
        } else if (data.user) {
          toast.success('Account created successfully! Please check your email to verify.');
          setEmailForm({ email: '', password: '', name: '' });
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast.error('Google login failed');
      }
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast.error('GitHub login failed');
      }
    } catch (error) {
      toast.error('GitHub login failed');
    }
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
    toast.success('OTP sent to your phone number!');
    // Add your OTP sending logic here
  };

  const handleOTPVerify = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Phone login successful!');
    // Add your OTP verification logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Join EditorStar'}
          </CardTitle>
          <CardDescription className="text-lg">
            {isLogin ? 'Sign in to access premium materials' : 'Create account to download free materials'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Social Login First */}
          <div className="space-y-3 mb-6">
            <div className="text-center text-sm text-gray-500 font-medium">Continue with</div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center border-2 hover:bg-red-50 hover:border-red-200"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleGithubLogin}
                className="w-full flex items-center justify-center border-2 hover:bg-gray-50 hover:border-gray-200"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="email" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      type="text"
                      value={emailForm.name}
                      onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                      placeholder="Enter your full name"
                      required={!isLogin}
                      className="border-2 focus:border-purple-500"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                    className="border-2 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <Input
                    type="password"
                    value={emailForm.password}
                    onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                    className="border-2 focus:border-purple-500"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3" 
                  disabled={loading}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      value={phoneForm.phone}
                      onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      required
                      className="border-2 focus:border-purple-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <Phone className="w-4 h-4 mr-2" />
                    Send OTP
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOTPVerify} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Enter OTP</label>
                    <Input
                      type="text"
                      value={phoneForm.otp}
                      onChange={(e) => setPhoneForm({ ...phoneForm, otp: e.target.value })}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      required
                      className="border-2 focus:border-purple-500"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    Verify OTP
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setOtpSent(false)}
                  >
                    Change Phone Number
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;
