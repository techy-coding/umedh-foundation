import { Link } from "wouter";
import { Heart, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3 group w-fit">
              <div className="bg-white/10 p-2 rounded-lg group-hover:bg-primary transition-colors duration-300">
                <Heart className="h-6 w-6 text-white fill-white/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-display text-white">Umedh</span>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Foundation</span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed">
              {t('footer.about', 'Empowering communities through education, healthcare, and sustainable development. Join us in making a difference.')}
            </p>
            <div className="flex space-x-4 pt-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white font-display">{t('footer.links', 'Quick Links')}</h3>
            <ul className="space-y-3">
              {[
                { label: t('nav.about', 'About Us'), href: '/about' },
                { label: t('nav.programs', 'Our Programs'), href: '/programs' },
                { label: t('nav.events', 'Events'), href: '/events' },
                { label: t('nav.blog', 'Latest News'), href: '/blog' },
                { label: t('nav.contact', 'Contact Us'), href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="hover:text-primary transition-colors flex items-center group"
                  >
                    <span className="w-0 overflow-hidden group-hover:w-2 transition-all duration-300 mr-0 group-hover:mr-2 opacity-0 group-hover:opacity-100">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white font-display">{t('footer.contact', 'Contact Info')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                <span>123 NGO Street, Civil Lines, Nagpur, Maharashtra, India 440001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>contact@umedh.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white font-display">{t('footer.newsletter', 'Newsletter')}</h3>
            <p className="text-sm text-slate-400">Subscribe to get latest updates and news.</p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button className="w-full py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Umedh Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
