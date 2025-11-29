import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RefundPolicy = () => {
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
            Refund & Return Policy
          </h1>
          
          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Our Refund Commitment</CardTitle>
              <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">1. Digital Products Policy</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  As Gyaan Repo provides digital products (source code, templates, and development resources), all sales are generally final once the download has been completed. Due to the nature of digital goods, we cannot accept returns or provide refunds under normal circumstances.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">2. Refund Eligibility</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  We offer refunds in the following cases:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Technical Issues:</strong> If the downloaded material is corrupted, incomplete, or cannot be accessed</li>
                  <li><strong>Duplicate Purchase:</strong> If you accidentally purchased the same item multiple times</li>
                  <li><strong>Misleading Description:</strong> If the product significantly differs from its description</li>
                  <li><strong>Non-Delivery:</strong> If you were charged but did not receive the download link</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                  Refund requests must be made within <strong>7 days</strong> of purchase.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">3. Non-Refundable Situations</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  We cannot provide refunds in the following cases:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Change of mind after successful download</li>
                  <li>Lack of technical skills to use the product</li>
                  <li>Compatibility issues due to outdated software on your end</li>
                  <li>Failure to read the product description or requirements</li>
                  <li>Projects abandoned after purchase</li>
                  <li>Free materials (no refund applicable)</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">4. How to Request a Refund</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  To request a refund, please follow these steps:
                </p>
                <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Contact us at gyaanrepo@gmail.com or call +91 9904032356</li>
                  <li>Provide your order number and transaction ID</li>
                  <li>Explain the reason for your refund request</li>
                  <li>Provide screenshots or evidence (if applicable)</li>
                </ol>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                  We will review your request within 2-3 business days.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">5. Refund Processing</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Once your refund is approved:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Full refunds will be processed to your original payment method</li>
                  <li>Refunds via Razorpay typically take 5-7 business days to reflect in your account</li>
                  <li>Bank processing times may vary</li>
                  <li>You will receive an email confirmation once the refund is processed</li>
                  <li>Access to the purchased material will be revoked upon refund</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">6. Partial Refunds</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  In some cases, only partial refunds may be granted:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Products with obvious signs of usage beyond testing</li>
                  <li>Requests made after 7 days but within 14 days of purchase</li>
                  <li>Bundles where only part of the content is problematic</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">7. Chargebacks</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you initiate a chargeback or payment dispute without first contacting us, we reserve the right to ban your account permanently. Please reach out to us first so we can resolve the issue amicably.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">8. Exchanges</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We do not offer exchanges for digital products. If you purchased the wrong item, you may request a refund (subject to our refund policy) and then purchase the correct item.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">9. Free Materials</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  All free materials are provided "as is" without any warranty. Since there is no charge for free materials, refunds do not apply. We strive to maintain high quality but cannot guarantee error-free content for free offerings.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">10. Support Before Refund</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Before requesting a refund, we encourage you to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Contact our support team for technical assistance</li>
                  <li>Check our FAQ and documentation</li>
                  <li>Allow us to help resolve any issues</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                  We're committed to ensuring your satisfaction and will work with you to resolve any problems.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">11. Changes to This Policy</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting to the website.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">12. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  For refund inquiries, please contact:
                  <br />
                  Email: gyaanrepo@gmail.com
                  <br />
                  Phone: +91 9904032356
                  <br />
                  Response Time: Within 24-48 hours
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

export default RefundPolicy;
