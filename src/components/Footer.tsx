
import { Link } from "react-router-dom";
import { ShoppingBag, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ShopEveryday</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Your trusted online shopping destination for the best deals and quality products.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform"
                aria-label="Connect with us on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-110 transform"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "Deals", href: "/deals" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <div className="space-y-2">
              {[
                { name: "Help Center", href: "/help" },
                { name: "Returns", href: "/returns" },
                { name: "Shipping Info", href: "/shipping" },
                { name: "Size Guide", href: "/size-guide" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: info@shopeveryday.com</p>
              <p>Phone: +91 98765 43210</p>
              <p>Address: 123 Shopping Street, Mumbai, India</p>
              <p className="text-sm pt-2">
                Customer Support: Mon-Sat 9AM-6PM IST
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
          <p>&copy; 2024 ShopEveryday. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
