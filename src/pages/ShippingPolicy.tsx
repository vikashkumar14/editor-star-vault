import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ShippingPolicy = () => {
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
            Shipping & Delivery Policy
          </h1>
          
          <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Instant Digital Delivery</CardTitle>
              <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">1. Digital Products - No Physical Shipping</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Gyaan Repo provides <strong>100% digital products</strong> including source code, templates, coding resources, and development materials. Since all our products are digital downloads, there is <strong>no physical shipping</strong> involved. All products are delivered electronically via instant download links.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">2. Instant Delivery Process</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  Here's how delivery works:
                </p>
                <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Purchase:</strong> Complete your purchase using Razorpay (supports UPI, Cards, Net Banking, Wallets)</li>
                  <li><strong>Payment Confirmation:</strong> Your payment is processed securely in real-time</li>
                  <li><strong>Instant Access:</strong> Download links are activated immediately after successful payment</li>
                  <li><strong>Email Notification:</strong> You'll receive a confirmation email with download instructions</li>
                  <li><strong>Account Access:</strong> All purchased items are available in your account dashboard</li>
                </ol>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                  <strong>Average delivery time: Instant (less than 1 minute)</strong>
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">3. Free Materials</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Free materials are available for <strong>immediate download</strong> without any registration or payment. Simply:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Browse our free collection</li>
                  <li>Click the download button</li>
                  <li>Start downloading instantly</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                  No waiting period or shipping time required!
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">4. Premium Content Delivery</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Premium materials require account registration and payment. Delivery process:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Step 1:</strong> Create a free account or log in</li>
                  <li><strong>Step 2:</strong> Add premium items to cart</li>
                  <li><strong>Step 3:</strong> Complete payment via Razorpay</li>
                  <li><strong>Step 4:</strong> Access download links immediately</li>
                  <li><strong>Step 5:</strong> Download unlimited times from your account</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">5. Download Accessibility</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  After purchase, you can:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Lifetime Access:</strong> Download your purchased materials anytime from your account</li>
                  <li><strong>Unlimited Downloads:</strong> No restrictions on number of downloads</li>
                  <li><strong>Multiple Devices:</strong> Download on any device you own</li>
                  <li><strong>Re-download:</strong> Lost files? Re-download from your account dashboard</li>
                  <li><strong>Updates:</strong> Access updated versions when available</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">6. Delivery Timeline</h2>
                <div className="text-gray-700 dark:text-gray-300 space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <strong className="text-green-700 dark:text-green-400">Free Materials:</strong> Instant (0 seconds)
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <strong className="text-blue-700 dark:text-blue-400">Premium Materials:</strong> Instant after payment confirmation (typically less than 60 seconds)
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <strong className="text-purple-700 dark:text-purple-400">Email Confirmation:</strong> Within 5 minutes of purchase
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">7. Delivery Issues</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  If you experience any delivery issues:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Payment Processed but No Download:</strong> Check your spam folder for email, or log into your account dashboard</li>
                  <li><strong>Download Link Not Working:</strong> Contact support immediately at gyaanrepo@gmail.com</li>
                  <li><strong>Corrupted Files:</strong> We'll provide fresh download links within 24 hours</li>
                  <li><strong>Payment Failed:</strong> Your money will be automatically refunded by Razorpay within 5-7 business days</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">8. System Requirements</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  To download and access materials, you need:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Stable internet connection (3G or higher recommended)</li>
                  <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                  <li>Sufficient storage space on your device</li>
                  <li>Appropriate software to open files (code editors, IDEs, etc.)</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">9. Geographic Availability</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Our digital products are available <strong>worldwide</strong>. Since there's no physical shipping, we can serve customers from any country. However, payment processing may vary by region based on Razorpay's availability.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                  <strong>Primary Service Area:</strong> India
                  <br />
                  <strong>International Access:</strong> Available (payment methods may vary)
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">10. File Formats</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Materials are typically provided in standard formats:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Source Code:</strong> .zip, .html, .css, .js, .jsx, .tsx, .py, etc.</li>
                  <li><strong>Templates:</strong> .zip archives containing project files</li>
                  <li><strong>Documentation:</strong> .md, .pdf, .txt</li>
                  <li><strong>Assets:</strong> .png, .jpg, .svg, .ico</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">11. Support & Assistance</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Need help with delivery or downloads?
                  <br />
                  <br />
                  <strong>Email:</strong> gyaanrepo@gmail.com
                  <br />
                  <strong>Response Time:</strong> Within 24 hours (usually faster)
                  <br />
                  <strong>Working Hours:</strong> Monday - Saturday, 10 AM - 6 PM IST
                  <br />
                  <strong>Location:</strong> Bihar, India
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">12. Important Notes</h2>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                    <li>No courier or logistics companies are involved</li>
                    <li>No tracking numbers (delivery is instant)</li>
                    <li>No shipping charges (everything is free delivery)</li>
                    <li>No customs or import duties</li>
                    <li>No delivery delays or lost packages</li>
                  </ul>
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

export default ShippingPolicy;
