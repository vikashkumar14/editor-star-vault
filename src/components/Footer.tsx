
import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Inject ad script after render
  useEffect(() => {
    const adScript = document.createElement("script");
    adScript.type = "text/javascript";
    adScript.src = "//www.highperformanceformat.com/a8709061226e0f722b3b9e857f597987/invoke.js";
    document.getElementById("footer-ad-slot")?.appendChild(adScript);
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            {/* Brand Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src="https://i.ibb.co/XkjPcgsv/icon.jpg"
                  alt="Gyaan Repo Logo"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">Gyaan Repo</h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Free, Reliable & Developer-Ready Source Code
                  </p>
                </div>
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                Gyaan Repo is your ultimate destination for free, high-quality source code and coding resources. 
                We provide HTML, CSS, JavaScript, React, Vue, Angular, Node.js, Python, and full-stack web development 
                materials. Whether you're building web applications, creating interactive UI components, or developing 
                REST APIs, our platform offers reliable, developer-ready code snippets, templates, and comprehensive 
                tutorials. Join our thriving community of 50K+ developers worldwide and accelerate your coding journey 
                with production-ready solutions.
              </p>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-gray-400 text-sm sm:text-base">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>gyaanrepo@gmail.com</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>+91 9904032356</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Bihar, India</span>
                </div>
              </div>

              {/* Policy Links */}
              <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-400 mt-4">
                <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="/refund" className="hover:text-white transition-colors">Refund Policy</a>
                <span>•</span>
                <a href="/shipping" className="hover:text-white transition-colors">Shipping Policy</a>
                <span>•</span>
                <a href="/delivery" className="hover:text-white transition-colors">Delivery Timeline</a>
              </div>
            </div>
          </div>
        </div>

        {/* 📢 Ad Slot */}
        <div className="py-4" id="footer-ad-slot">
          {/* Ad iframe will be injected here */}
        </div>

        <Separator className="bg-gray-800" />

        {/* Bottom Footer */}
        <div className="py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 text-center sm:text-left">
            <div className="text-gray-400 text-xs sm:text-sm">
              © {currentYear} Gyaan Repo. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors py-1">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors py-1">Terms of Service</a>
              <a href="/refund" className="hover:text-white transition-colors py-1">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
