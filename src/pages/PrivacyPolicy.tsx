import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          
          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Your Privacy Matters</CardTitle>
              <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
                  <li><strong>Profile Information:</strong> Additional information you choose to provide</li>
                  <li><strong>Payment Information:</strong> Billing details for premium purchases (processed securely via Razorpay)</li>
                  <li><strong>Usage Data:</strong> Information about how you use our service, including downloads and interactions</li>
                  <li><strong>Device Information:</strong> IP address, browser type, and device identifiers</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and provide customer service</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                  <li>Personalize and improve your experience</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">3. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
                  <li><strong>Service Providers:</strong> We may share information with third-party service providers (e.g., Razorpay for payments)</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests</li>
                  <li><strong>Business Transfers:</strong> In connection with any merger, sale of assets, or acquisition</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                  We do not sell or rent your personal information to third parties.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We take reasonable measures to protect your information from unauthorized access, alteration, disclosure, or destruction. We use industry-standard encryption for sensitive data transmission and storage. However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">5. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our Service. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">6. Third-Party Services</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Our Service may contain links to third-party websites or integrate with third-party services:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Razorpay:</strong> Payment processing (subject to Razorpay's privacy policy)</li>
                  <li><strong>Google/GitHub OAuth:</strong> Social authentication (subject to their respective privacy policies)</li>
                  <li><strong>Analytics Services:</strong> To understand usage patterns</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">7. Your Data Rights</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Access, update, or delete your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Withdraw consent for data processing</li>
                  <li>Lodge a complaint with a data protection authority</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                  To exercise these rights, please contact us at gyaanrepo@gmail.com
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Our Service is not directed to children under 13 years of age. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">9. Data Retention</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy. We may also retain information to comply with legal obligations, resolve disputes, and enforce our agreements.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">10. Changes to This Policy</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us:
                  <br />
                  Email: gyaanrepo@gmail.com
                  <br />
                  Phone: +91 9904032356
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

export default PrivacyPolicy;
