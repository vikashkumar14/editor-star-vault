import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Zap, Download, CheckCircle } from "lucide-react";

const DeliveryTimeline = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-8 text-center">
            Delivery Timeline
          </h1>
          
          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Lightning-Fast Digital Delivery
              </CardTitle>
              <p className="text-sm text-muted-foreground">Instant access to all your purchased materials</p>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800 mb-6">
                <p className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
                  ⚡ 100% Instant Digital Delivery
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  All Gyaan Repo materials are delivered <strong>instantly</strong> via electronic download. No waiting, no shipping, no delays!
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  Delivery Timeline Overview
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border-l-4 border-green-500 shadow-sm">
                    <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">Free Materials</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Delivery Time:</strong> Instant (0 seconds)
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click download → Start downloading immediately. No registration required for free content.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border-l-4 border-blue-500 shadow-sm">
                    <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">Premium Materials (After Payment)</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Delivery Time:</strong> Instant (less than 60 seconds)
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment confirmation → Download link activated → Start downloading
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-5 rounded-lg border-l-4 border-purple-500 shadow-sm">
                    <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-2">Email Confirmation</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Delivery Time:</strong> Within 5 minutes
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Confirmation email with purchase details and download instructions
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Step-by-Step Delivery Process</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Browse & Select</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Browse our collection of coding materials, templates, and resources. Add items to cart or click download for free materials.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">⏱️ Time: Instant browsing</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Payment (Premium Only)</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Complete secure payment via Razorpay. Supports UPI, Credit/Debit Cards, Net Banking, and Wallets.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">⏱️ Time: 30-60 seconds</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Instant Activation</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Download links are automatically activated. Access from your account dashboard or via email link.
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1 font-semibold">⚡ Time: Instant</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Download & Use</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Click download button and save files to your device. Start using immediately in your projects!
                      </p>
                      <p className="text-sm text-gray-500 mt-1">⏱️ Time: Depends on file size & internet speed</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Total Delivery Time Comparison</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left">Product Type</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left">Delivery Method</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left">Time to Access</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Free Materials</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Direct Download</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-green-600 dark:text-green-400 font-bold">Instant</td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-800/50">
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Premium Materials</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">After Payment</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-blue-600 dark:text-blue-400 font-bold">&lt; 60 seconds</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Email Confirmation</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Automated Email</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-purple-600 dark:text-purple-400 font-bold">1-5 minutes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">What Affects Download Speed?</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  While access is instant, actual download speed depends on:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Your Internet Connection:</strong> Faster connection = faster downloads (3G, 4G, 5G, WiFi)</li>
                  <li><strong>File Size:</strong> Larger projects may take a few minutes to download</li>
                  <li><strong>Server Load:</strong> We use high-speed servers for optimal performance</li>
                  <li><strong>Device Performance:</strong> Older devices may process files slightly slower</li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  💡 <strong>Tip:</strong> Use a stable WiFi connection for downloading larger project files.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Re-download Anytime</h2>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>Lost your files?</strong> No problem! All purchases are saved in your account dashboard.
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Log into your account anytime</li>
                    <li>Access your purchase history</li>
                    <li>Re-download materials instantly</li>
                    <li>No additional charges, ever!</li>
                  </ul>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
                <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    If you experience any delays or issues with accessing your downloads:
                  </p>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p><strong>📧 Email:</strong> contact@GyaanRepo.com</p>
                    <p><strong>📞 Phone:</strong> +91 7903072632</p>
                    <p><strong>⏰ Response Time:</strong> Within 24 hours (usually faster)</p>
                    <p><strong>📍 Location:</strong> Bihar, India</p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default DeliveryTimeline;
