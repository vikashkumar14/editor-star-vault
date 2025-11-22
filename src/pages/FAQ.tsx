import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Mail, MessageCircle, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const faqData = [
    {
      category: 'General Questions',
      questions: [
        {
          q: 'What is Gyaan Repo?',
          a: 'Gyaan Repo is a creative materials platform designed for developers, designers, and content creators. We provide a wide variety of digital assets including overlays, LUTs (Look-Up Tables), presets, sound effects, transitions, templates, and more for video editing and creative projects.',
        },
        {
          q: 'Is Gyaan Repo free to use?',
          a: 'Yes! Gyaan Repo offers both free and premium materials. You can browse and download many materials for free without creating an account. Premium materials require payment and offer advanced features and higher quality assets.',
        },
        {
          q: 'What types of materials are available?',
          a: 'We offer overlays, LUTs (color grading presets), editing presets, sound effects (SFX), transitions, video templates, and other creative assets compatible with popular software like Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro, and Photoshop.',
        },
      ],
    },
    {
      category: 'Downloads',
      questions: [
        {
          q: 'How do I download materials?',
          a: 'Simply browse our materials page, click on any material card to view details, then click the "Download" button. For free materials, the download starts immediately. Premium materials require payment before downloading.',
        },
        {
          q: 'What file formats are supported?',
          a: 'Materials are available in various formats depending on the type: .cube and .3dl for LUTs, .prproj and .mogrt for Premiere Pro, .aep for After Effects, .preset for Lightroom, .mp4/.mov for video files, and .mp3/.wav for audio files.',
        },
        {
          q: 'Can I download materials without an account?',
          a: 'Yes, you can download free materials without creating an account. However, creating an account allows you to track your downloads, access premium content, and receive updates about new materials.',
        },
      ],
    },
    {
      category: 'Payments & Premium',
      questions: [
        {
          q: 'How do premium materials work?',
          a: 'Premium materials are high-quality assets created by professional designers and developers. They are marked with a "Premium" badge and require a one-time payment. After purchasing, you get lifetime access to download the material.',
        },
        {
          q: 'What payment methods are accepted?',
          a: 'We accept all major payment methods through Razorpay, including credit/debit cards, UPI, net banking, and digital wallets. All transactions are secure and encrypted.',
        },
        {
          q: 'Is there a refund policy?',
          a: 'Due to the digital nature of our products, we generally do not offer refunds after download. However, if you encounter technical issues or receive corrupted files, please contact our support team, and we will assist you.',
        },
      ],
    },
    {
      category: 'Features & Navigation',
      questions: [
        {
          q: 'How do I search for specific materials?',
          a: 'Use the search bar in the navigation menu to enter keywords related to what you need. You can also filter materials by category, software compatibility, tags, and sort by popularity, newest, or highest rated on the Materials page.',
        },
        {
          q: 'What is the Gallery feature?',
          a: 'The Gallery showcases AI-generated images and creative prompts. You can browse by categories, view prompts used to generate images, and get inspiration for your own creative projects. It is a separate section from downloadable materials.',
        },
        {
          q: 'How do ratings and reviews work?',
          a: 'Users can rate materials from 1 to 5 stars and leave comments. These ratings help other users find the best quality materials. You can view average ratings and read reviews on each material detail page.',
        },
      ],
    },
    {
      category: 'Security & Privacy',
      questions: [
        {
          q: 'Is my payment information secure?',
          a: 'Absolutely. We use Razorpay, a PCI-DSS compliant payment gateway, which encrypts all payment data using industry-standard security protocols. We never store your complete payment information on our servers.',
        },
        {
          q: 'How is my personal data protected?',
          a: 'We follow strict data protection practices. Your personal information is encrypted and stored securely. We never share your data with third parties without your consent. Read our Privacy Policy for complete details.',
        },
      ],
    },
    {
      category: 'Troubleshooting',
      questions: [
        {
          q: 'My download is not starting. What should I do?',
          a: 'First, check your internet connection. Then, try disabling browser extensions or ad blockers that might interfere with downloads. Clear your browser cache and try again. If the issue persists, contact support with the material ID.',
        },
        {
          q: 'The chatbot is not responding. How can I fix it?',
          a: 'The chatbot requires an active internet connection. Refresh the page and try again. If it still does not work, you can contact us directly through the Contact page or email us at support@gyaanrepo.com.',
        },
      ],
    },
  ];

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <div className={`min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about downloads, payments, and navigating Gyaan Repo
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary rounded-xl"
            />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((category, idx) => (
              <Card key={idx} className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary">
                    {category.category}
                  </CardTitle>
                  <CardDescription>
                    {category.questions.length} question{category.questions.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, qIdx) => (
                      <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-left text-base font-semibold hover:text-primary">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  No questions found matching "{searchQuery}"
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try different keywords or browse all categories
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Still Need Help Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-2">Still Need Help?</CardTitle>
              <CardDescription className="text-base">
                Can't find what you're looking for? We're here to assist you!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Link to="/contact">
                  <Card className="h-full border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <CardContent className="pt-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Mail className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        Contact Support
                      </h3>
                      <p className="text-muted-foreground">
                        Send us a message and we'll respond within 24 hours
                      </p>
                      <Button className="mt-4" variant="outline">
                        Go to Contact Page
                      </Button>
                    </CardContent>
                  </Card>
                </Link>

                <Card className="h-full border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MessageCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      Live Chat
                    </h3>
                    <p className="text-muted-foreground">
                      Use our chatbot at the bottom-right corner for instant help
                    </p>
                    <Button className="mt-4" variant="outline">
                      Open Chatbot
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> support@gyaanrepo.com | 
                  <strong className="ml-2">Response Time:</strong> Within 24 hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
