
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Deals", href: "/deals" },
    { name: "Contact", href: "/contact" },
  ];

  const isActiveLink = (href: string) => location.pathname === href;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Responsive sizing */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 text-lg sm:text-xl font-bold">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="hidden xs:inline-block">ShopEveryday</span>
              <span className="xs:hidden">Shop</span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on smaller screens, responsive spacing */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                  isActiveLink(item.href)
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar and Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Bar - Responsive width */}
            <div className="relative hidden sm:block">
              <div
                className={`flex items-center transition-all duration-300 ease-in-out ${
                  isSearchFocused ? "w-64 lg:w-80" : "w-48 lg:w-64"
                }`}
              >
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`pl-10 text-sm transition-all duration-300 ease-in-out ${
                    isSearchFocused ? "ring-2 ring-primary" : ""
                  }`}
                />
              </div>
            </div>

            {/* Theme Toggle - Responsive sizing */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary/10 transition-all duration-200 flex-shrink-0"
              title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 sm:h-5 sm:w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile menu button - Better positioning */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Improved layout */}
        {isMenuOpen && (
          <div className="lg:hidden animate-in slide-in-from-top-2 duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t">
              {/* Mobile Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between px-3 py-2 mb-2">
                <span className="text-sm font-medium">Theme</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="hover:bg-primary/10"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </>
                  )}
                </Button>
              </div>
              
              {/* Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isActiveLink(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
