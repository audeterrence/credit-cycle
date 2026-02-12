import { Recycle } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-background py-8">
    <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
      <div className="flex items-center gap-2 font-display font-semibold text-foreground">
        <Recycle className="h-5 w-5 text-primary" />
        Credi-Can
      </div>
      <p>© 2026 Credi-Can. All rights reserved.</p>
      <div className="flex gap-4">
        <a href="#" className="transition-colors hover:text-primary">Contact</a>
        <a href="#" className="transition-colors hover:text-primary">Partners</a>
      </div>
    </div>
  </footer>
);

export default Footer;
