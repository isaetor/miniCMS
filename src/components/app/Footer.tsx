import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t hidden md:block">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              تمام حقوق اين وب‌سايت متعلق به سعید ترکمان می باشد.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Link href="#">
                <Instagram />
              </Link>
              <Link href="#">
                <Linkedin />
              </Link>
              <Link href="#">
                <Twitter />
              </Link>
              <Link href="#">
                <Facebook />
              </Link>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;
