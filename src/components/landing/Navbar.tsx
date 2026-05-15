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
    { name: "Why Credi-Can", href: "/#why-us" }, // Added as requested
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
        
        {/* Logo Section - Enhanced with more "weight" */}
        <a 
          href="/" 
          className="group flex items-center gap-2.5 font-display font-black text-2xl tracking-tight text-slate-900"
        >
          <div className="bg-primary p-1.5 rounded-xl shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
            <Recycle className="h-6 w-6 text-white" />
          </div>
          <span>Credi-Can</span>
        </a>

        {/* Desktop Navigation - Space out for a premium feel */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="relative text-sm font-bold text-slate-600 hover:text-primary transition-colors group"
            >
              {link.name}
              {/* Animated underline effect */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Action Buttons - Distinctive styling */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" className="font-bold text-slate-700 hover:bg-slate-100" asChild>
            <a href="/login">Log in</a>
          </Button>
          <Button className="font-bold px-6 shadow-lg shadow-primary/20" asChild>
            <a href="/signup">Sign up</a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-slate-900 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Menu - Completely redesigned for better UX */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[100%] bg-white border-b border-slate-200 shadow-2xl animate-in slide-in-from-top-5 duration-300">
          <div className="container py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-lg font-bold text-slate-900 flex items-center justify-between group"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
                <ChevronDown className="h-5 w-5 text-slate-300 -rotate-90 group-hover:text-primary transition-colors" />
              </a>
            ))}
            <div className="grid grid-cols-1 gap-3 pt-6 border-t border-slate-100">
              <Button variant="outline" className="w-full h-12 font-bold" asChild>
                <a href="/login">Log in</a>
              </Button>
              <Button className="w-full h-12 font-bold" asChild>
                <a href="/signup">Sign up</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;