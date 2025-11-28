import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          
          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Terms and Conditions</CardTitle>
              <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  By accessing and using Gyaan Repo ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Permission is granted to download materials for personal and commercial use with the following restrictions:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>This is the grant of a license, not a transfer of title</li>
                  <li>Materials may not be resold or redistributed as standalone products</li>
                  <li>You must give appropriate credit to Gyaan Repo when using our materials</li>
                  <li>Materials may not be used for illegal or unethical purposes</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding your account password and for any activities or actions under your account.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">4. Intellectual Property</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  All content, source code, and materials available on Gyaan Repo are owned by or licensed to us. The materials are protected by copyright, trademark, and other intellectual property laws. While we provide free access to coding resources and development materials, you may not claim ownership of the original work.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">5. Premium Content</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Some materials may be marked as premium and require payment. All payments are processed securely through Razorpay. Once purchased, premium content licenses are non-transferable and subject to our refund policy.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">6. Prohibited Uses</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  You may not use the Service:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>For any unlawful purpose or to solicit others to perform or participate in any unlawful acts</li>
                  <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                  <li>To collect or track personal information of others</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">7. Disclaimer</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The materials on Gyaan Repo are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">8. Limitations</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  In no event shall Gyaan Repo or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Gyaan Repo.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">9. Governing Law</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Bihar, India.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">10. Changes to Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page. Your continued use of the Service after any modifications indicates your acceptance of the new terms.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">11. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you have any questions about these Terms, please contact us at:
                  <br />
                  Email: contact@GyaanRepo.com
                  <br />
                  Phone: +91 7903072632
                  <br />
                  Address: Bihar, India
                </p>
              </section>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default TermsOfService;
