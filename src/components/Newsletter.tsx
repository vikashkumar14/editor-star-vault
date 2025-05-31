
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, Bell, Gift, Zap } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    // Handle newsletter signup
    setEmail('');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/10 dark:via-orange-900/10 dark:to-yellow-900/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-200 dark:border-slate-700">
          {/* Header */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 mb-4">
              Stay Updated
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Never Miss New Materials
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get notified when we release new editing materials, tutorials, and exclusive freebies. 
              Join 15,000+ creators in our community!
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">Early Access</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">New materials first</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">Exclusive Freebies</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Subscriber-only content</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">Pro Tips</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Weekly editing insights</div>
              </div>
            </div>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 text-lg bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 rounded-xl"
                required
              />
              <Button 
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-xl"
              >
                Subscribe Free
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </form>

          {/* Social Proof */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>15,247 subscribers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Weekly updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Exclusive content</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
