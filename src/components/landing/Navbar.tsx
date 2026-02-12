import { useState } from "react";
import { Recycle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Home", href: "#home" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Rewards", href: "#rewards" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <a href="#home" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <Recycle className="h-7 w-7" />
          Credi-Can
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {l.label}
            </a>
          ))}
          <Button variant="outline" size="sm">Login</Button>
          <Button size="sm">Sign Up</Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="block py-2 text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">Login</Button>
            <Button size="sm" className="flex-1">Sign Up</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
