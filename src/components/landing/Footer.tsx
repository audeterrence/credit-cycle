import { Recycle, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-display font-bold text-2xl text-white">
              <div className="bg-primary p-1.5 rounded-lg">
                <Recycle className="h-6 w-6 text-slate-950" />
              </div>
              Credi-Can
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Transforming waste management in Cameroon by rewarding eco-conscious citizens and driving value to local businesses.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors transform hover:scale-110">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors transform hover:scale-110">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors transform hover:scale-110">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors transform hover:scale-110">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#how-it-works" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> How it Works</a></li>
              <li><a href="/#materials" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Accepted Materials</a></li>
              <li><a href="/#rewards" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Browse Rewards</a></li>
              <li><a href="/kiosks" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Find a Kiosk</a></li>
            </ul>
          </div>

          {/* Column 3: Business & Support */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/partner" className="hover:text-primary transition-colors flex items-center gap-2 font-medium text-white"><ArrowRight className="h-3 w-3 text-primary" /> Become a Partner</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Contact Support</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> About Us</a></li>
            </ul>
            
            {/* Direct Contact Info explicitly matching our updates */}
            <div className="pt-4 space-y-2 text-sm border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="h-4 w-4 text-primary" /> Douala, Cameroon
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="h-4 w-4 text-primary" /> +237 6XX XXX XXX
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="h-4 w-4 text-primary" /> support@credican.cm
              </div>
            </div>
          </div>

          {/* Column 4: The "Active" Element (Newsletter) */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Stay Updated</h4>
            <p className="text-sm text-slate-400">
              Subscribe to get notified about new kiosk locations and reward partners in your area.
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-primary"
                required
              />
              <Button type="submit" className="w-full bg-primary text-slate-950 hover:bg-primary/90 font-semibold">
                Subscribe
              </Button>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Credi-Can. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="/cookies" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;