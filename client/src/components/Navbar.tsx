import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardPath } from "@/lib/role-dashboard";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const dashboardPath = getDashboardPath(user?.role);
  const roleLabel =
    user?.role === "admin"
      ? t("role.admin", "Admin")
      : user?.role === "donor"
        ? t("role.donor", "Donor")
        : user?.role === "volunteer"
          ? t("role.volunteer", "Volunteer")
          : user?.role === "beneficiary"
            ? t("role.beneficiary", "Beneficiary")
            : t("role.user", "User");

  const primaryNavLinks = [
    { href: "/", label: t('nav.home', 'Home') },
    { href: "/about", label: t('nav.about', 'About') },
    { href: "/programs", label: t('nav.programs', 'Programs') },
    { href: "/events", label: t('nav.events', 'Events') },
  ];

  const secondaryNavLinks = [
    { href: "/gallery", label: t('nav.gallery', 'Gallery') },
    { href: "/blog", label: t('nav.blog', 'Blog') },
    { href: "/contact", label: t('nav.contact', 'Contact') },
  ];
  
  if (user && user.role === "volunteer") {
    secondaryNavLinks.push({ href: "/volunteer/events", label: t('nav.myEvents', 'My Events') });
    secondaryNavLinks.push({ href: "/volunteer/messages", label: t('nav.messages', 'Messages') });
  }

  if (user && user.role === "donor") {
    secondaryNavLinks.push({ href: "/donor/sponsorships", label: t('nav.mySponsorships', 'My Sponsorships') });
    secondaryNavLinks.push({ href: "/inbox", label: t('nav.inbox', 'Inbox') });
  }

  // Beneficiary uses the common "Dashboard" button on the right to avoid duplicate menu items.
  if (user && user.role === "beneficiary") {
    secondaryNavLinks.push({ href: "/inbox", label: t('nav.inbox', 'Inbox') });
  }

  // show apply link for all non-admin users and visitors
  if (!user || user.role !== "admin") {
    secondaryNavLinks.push({ href: "/beneficiary/apply", label: t('nav.applySupport', 'Apply for Support') });
  }

  // non-admin logged-in users can view their support applications/status here
  if (user && user.role !== "admin") {
    secondaryNavLinks.push({ href: "/beneficiary/dashboard", label: t("nav.mySupport", "My Support") });
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-2 rounded-lg shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
              <Heart className="h-6 w-6 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-display text-slate-900 leading-none group-hover:text-primary transition-colors">
                Umedh
              </span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest group-hover:text-primary/70 transition-colors">
                Foundation
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {primaryNavLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location === link.href 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-all duration-200"
                  type="button"
                >
                  {t("nav.more", "More")}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white border border-slate-200 shadow-xl">
                {secondaryNavLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} className="w-full cursor-pointer">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {user && user.role !== "visitor" && (
               <Link 
                href={dashboardPath}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location.startsWith("/admin") || location.startsWith("/donor") || location.startsWith("/volunteer")
                    ? "bg-purple-50 text-purple-600" 
                    : "text-slate-600 hover:bg-purple-50 hover:text-purple-600"
                }`}
              >
                {t('nav.dashboard', 'Dashboard')}
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                {t("role.loggedInAs", "Logged in as")} {roleLabel}
              </span>
            )}
            <LanguageSwitcher />
            {user ? (
              <Button 
                variant="ghost" 
                onClick={() => logout()}
                className="rounded-full px-6 text-slate-600 hover:text-primary transition-all duration-300"
              >
                {t('auth.logout', 'Logout')}
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => (window.location.href = "/login")}
                  className="rounded-full px-6 text-slate-600 hover:text-primary transition-all duration-300"
                >
                  {t('auth.login', 'Login')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/register")}
                  className="rounded-full px-6"
                >
                  {t('auth.register', 'Register')}
                </Button>
              </>
            )}
            <Link href="/donate">
              <Button className="rounded-full px-6 bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/25 hover:shadow-secondary/40 hover:-translate-y-0.5 transition-all duration-300">
                {t('nav.donate', 'Donate Now')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                {roleLabel}
              </span>
            )}
            <LanguageSwitcher />
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xl p-4 flex flex-col space-y-2 animate-in slide-in-from-top-5 duration-200">
          {[...primaryNavLinks, ...secondaryNavLinks].map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                location === link.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && user.role !== "visitor" && (
             <Link 
              href={dashboardPath}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50"
            >
              {t('nav.dashboard', 'Dashboard')}
            </Link>
          )}
          <div className="pt-2 space-y-2">
            {!user ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/login")}
                  className="w-full rounded-xl py-6 text-lg"
                >
                  {t('auth.login', 'Login')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/register")}
                  className="w-full rounded-xl py-6 text-lg"
                >
                  {t('auth.register', 'Register')}
                </Button>
              </>
            ) : (
              <Button 
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full rounded-xl py-6 text-lg"
              >
                {t('auth.logout', 'Logout')}
              </Button>
            )}
            <Link href="/donate" onClick={() => setIsOpen(false)}>
              <Button className="w-full rounded-xl bg-secondary hover:bg-secondary/90 text-white py-6 text-lg shadow-lg">
                {t('nav.donate', 'Donate Now')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
