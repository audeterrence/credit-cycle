import { useState, useEffect } from "react";
import { Menu, X, Recycle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Why Credi-Can", href: "/#why-us" },
    { name: "How it Works", href: "/#how-it-works" },
    { name: "Materials", href: "/#materials" },
    { name: "Rewards", href: "/#rewards" },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-slate-200 py-3 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container flex items-center justify-between">
        
        {/* Logo Section */}
        <a 
          href="/" 
          className="group flex items-center gap-2.5 font-display font-black text-2xl tracking-tight text-slate-900"
        >
          <div className="bg-primary p-1.5 rounded-xl shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
            <Recycle className="h-6 w-6 text-white" />
          </div>
          <span>Credi-Can</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="relative text-sm font-bold text-slate-600 hover:text-primary transition-colors group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Desktop Authentication Action Triggers */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" className="font-bold text-slate-700 hover:bg-slate-100" asChild>
            <a href="/login">Log in</a>
          </Button>
          <Button className="font-bold px-6 shadow-lg shadow-primary/20" asChild>
            <a href="/signup">Sign up</a>
          </Button>
        </div>

        {/* Responsive Mobile Menu Interaction Trigger */}
        <button
          className="lg:hidden text-slate-900 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Blur Mask Layer for Dimming background content */}
          <div 
            className="fixed inset-0 top-[60px] z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Navigation Panel sitting flush right below header context */}
          <div className="lg:hidden absolute inset-x-0 top-full z-50 bg-white border-b border-slate-200 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="container py-8 flex flex-col gap-5 max-h-[calc(100vh-80px)] overflow-y-auto">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  className="text-base font-bold text-slate-800 hover:text-primary py-2 flex items-center justify-between group transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                  <ChevronDown className="h-4 w-4 text-slate-400 -rotate-90 group-hover:text-primary transition-transform" />
                </a>
              ))}
              
              {/* Access Links Grid Panel */}
              <div className="grid grid-cols-2 gap-3 pt-6 mt-2 border-t border-slate-100">
                <Button variant="outline" className="h-12 font-bold rounded-xl" asChild>
                  <a href="/login">Log in</a>
                </Button>
                <Button className="h-12 font-bold rounded-xl shadow-md shadow-primary/20" asChild>
                  <a href="/signup">Sign up</a>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;