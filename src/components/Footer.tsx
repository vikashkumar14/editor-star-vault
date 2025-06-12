
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Youtube, Instagram, Twitter, Facebook, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Materials: [
      "Video Overlays",
      "Color LUTs",
      "Sound Effects",
      "Transitions",
      "Presets",
      "Templates"
    ],
    Resources: [
      "Tutorials",
      "Blog",
      "FAQ",
      "Support",
      "Downloads",
      "Updates"
    ],
    Community: [
      "YouTube Channel",
      "Discord",
      "Newsletter",
      "Feedback",
      "Contributors",
      "Showcase"
    ],
    Legal: [
      "Privacy Policy",
      "Terms of Service",
      "License",
      "Refund Policy",
      "DMCA",
      "Contact"
    ]
  };

  const socialLinks = [
    { icon: Youtube, href: "https://youtube.com/@theeditorstar12?si=P4bDpQeIH7o3U3wb", label: "YouTube", color: "hover:text-red-500" },
    { icon: Instagram, href: "https://www.instagram.com/the__editor___boy12?igsh=MW0ydDgxaWNlZnhoMA==", label: "Instagram", color: "hover:text-pink-500" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-blue-500" },
    { icon: Facebook, href: "https://www.facebook.com/share/1V897i7BiX/", label: "Facebook", color: "hover:text-blue-600" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <div>
                  {/* Brand Section with Logo */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="https://i.ibb.co/XkjPcgsv/icon.jpg"
                  alt="Gyaan Repo Logo"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold">Gyaan Repo</h3>
                  <p className="text-gray-400 text-sm">Free, Reliable & Developer-Ready Source Code</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Gyaan Repo - Unlock Free, Reliable & Developer-Ready Source Code to help Gyaan Repo
                make stunning content. Join our community of 50K+ Gyaan Repo worldwide.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>contact@GyaanRepo.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Mumbai, India</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="icon"
                      className={`text-gray-400 ${social.color} transition-colors`}
                      asChild
                    >
                      <a href={social.href} aria-label={social.label}>
                        <IconComponent className="w-5 h-5" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-lg font-semibold mb-6">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Gyaan Repo. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
