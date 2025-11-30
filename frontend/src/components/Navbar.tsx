import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tractor, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Tractor className="h-8 w-8" />
            <span className="text-xl font-bold">{t("navbar.brand")}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              {t("navbar.home")}
            </Link>
            <Link
              to="/dashboard/farmer"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/dashboard/farmer') ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              {t("navbar.browseMachinery")}
            </Link>
            <Link
              to="/farmsha-auth"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/farmsha-auth') ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              {t("navbar.login")}
            </Link>
            <Button asChild variant="hero" size="sm">
              <Link to="/farmsha-auth">{t("navbar.getStarted")}</Link>
            </Button>
            <select
              className="ml-4 border rounded px-2 py-1 text-sm bg-background"
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">{t("language.en")}</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="gu">ગુજરાતી</option>
              <option value="bn">বাংলা</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className={`text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("navbar.home")}
              </Link>
              <Link
                to="/dashboard/farmer"
                className={`text-sm font-medium ${isActive('/dashboard/farmer') ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("navbar.browseMachinery")}
              </Link>
              <Link
                to="/farmsha-auth"
                className={`text-sm font-medium ${isActive('/farmsha-auth') ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("navbar.login")}
              </Link>
              <Button asChild variant="hero" size="sm" className="w-full">
                <Link to="/farmsha-auth">{t("navbar.getStarted")}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};