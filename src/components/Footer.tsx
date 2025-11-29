
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
        <div className="py-12">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Brand Section */}
            <div className="flex items-center space-x-3">
              <img
                src="https://i.ibb.co/XkjPcgsv/icon.jpg"
                alt="Gyaan Repo Logo"
                className="w-14 h-14 rounded-xl object-cover"
              />
              <h3 className="text-2xl font-bold text-white">Gyaan Repo</h3>
            </div>

            {/* Policy Links */}
            <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-400">
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

        {/* 📢 Ad Slot */}
        <div className="py-4" id="footer-ad-slot">
          {/* Ad iframe will be injected here */}
        </div>

        <Separator className="bg-gray-800" />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="text-center text-gray-400 text-sm">
            © {currentYear} Gyaan Repo. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
