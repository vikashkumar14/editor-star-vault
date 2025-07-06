
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send, MessageSquare, Code, Palette } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

const Contact = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('feedback')
        .insert([formData]);

      if (dbError) throw dbError;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-feedback-email', {
        body: formData
      });

      if (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't throw error here, database save was successful
      }

      toast.success('Thank you for your feedback! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 py-16"> {/* Added pt-16 for fixed navbar */}
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Have questions, need custom materials, or want to share coding projects? We'd love to hear from you!
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <Palette className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="font-semibold text-lg mb-2">Design Materials</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Request custom LUTs, overlays, presets, and design elements
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <Code className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <h3 className="font-semibold text-lg mb-2">Coding Projects</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share code snippets, templates, and development resources
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold text-lg mb-2">General Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get help, report issues, or provide feedback
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-2xl bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Material request, coding help, feedback..."
                      className="focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your request, share code snippets, or describe what you need..."
                      rows={6}
                      className="focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">Contact Information</CardTitle>
                  <CardDescription>
                    Reach out to us through any of these channels.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">vikashkumar13228@gmail.com</p>
                      <p className="text-gray-600 dark:text-gray-300">support@theeditorstar.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Response Time</h3>
                      <p className="text-gray-600 dark:text-gray-300">Usually within 24 hours</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">We respond to all messages personally</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Community</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Join our growing community of<br />
                        creators and developers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <CardHeader className="border-b">
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Can I request specific materials?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Absolutely! Send us details about what you need and we'll try to create it for the community.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Can I share coding files?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Yes! We welcome code snippets, templates, and development resources to share with creators.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Are all materials really free?</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Yes! All our materials and resources are completely free to download and use in your projects.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Contact;
