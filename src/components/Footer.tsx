import { Vault } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <p className="flex items-center justify-center font-bold text-sm">
              <Vault
                className="bg-primary text-primary-foreground p-1 rounded"
                size={30}
              />
            </p>
            <p className="font-semibold">Linkvault</p>
          </a>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Linkvault. Minimal. Fast. Reliable.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
