import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import BrandLogo from '@/components/common/BrandLogo';

interface FooterProps {
  className?: string;
}

const socialLinks = [
  { name: 'Facebook', url: '#', path: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.87h2.78l-.44 2.9h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94Z' },
  { name: 'Instagram', url: '#', path: 'M12 2c2.72 0 3.06.01 4.12.06 1.07.05 1.8.22 2.43.47.66.25 1.22.6 1.77 1.16.56.55.91 1.11 1.16 1.77.25.63.42 1.36.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.8-.47 2.43a4.9 4.9 0 0 1-1.16 1.77c-.55.56-1.11.91-1.77 1.16-.63.25-1.36.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.8-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.16 4.9 4.9 0 0 1-1.16-1.77c-.25-.63-.42-1.36-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.8.47-2.43.25-.66.6-1.22 1.16-1.77.55-.56 1.11-.91 1.77-1.16.63-.25 1.36-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.25a3.25 3.25 0 1 1 0-6.5 3.25 3.25 0 0 1 0 6.5Zm5.25-9.4a1.17 1.17 0 1 0 0 2.34 1.17 1.17 0 0 0 0-2.34Z' },
  { name: 'X', url: '#', path: 'M17.53 3h3.04l-6.64 7.59L21.75 21h-6.12l-4.8-6.27L5.34 21H2.3l7.1-8.12L2.25 3h6.27l4.34 5.74L17.53 3Zm-1.07 16.2h1.68L7.62 4.71H5.82l10.64 14.49Z' },
  { name: 'LinkedIn', url: '#', path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z' },
];

const Footer = ({ className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/homepage' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Programs', path: '/programs' },
    { label: 'Faculty', path: '/faculty' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  const programs = [
    { label: 'Class 6-8', path: '/programs' },
    { label: 'Class 9-10', path: '/programs' },
    { label: 'Class 11-12', path: '/programs' },
    { label: 'Competitive Exams', path: '/programs' },
  ];

  return (
    <footer className={`bg-navy text-navy-foreground ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5 max-w-sm">
            <div className="flex items-center gap-3 mb-5">
              <BrandLogo className="h-12 w-12" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl font-semibold uppercase">Vertex Academy</span>
                <span className="text-[0.62rem] font-bold tracking-[0.22em] uppercase text-gold mt-1">The Knowledge Expert</span>
              </span>
            </div>
            <p className="text-navy-foreground/70 leading-relaxed text-[0.95rem]">
              A unit of Thanga Ramachandran Educational Trust. Helping Chennai students reach their
              academic vertex since 2016.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  aria-label={s.name}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/8 border border-white/12 text-navy-foreground/85 hover:bg-gold hover:text-navy hover:border-gold transition-colors duration-300"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-lg font-semibold mb-5">Explore</h3>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.path} className="text-navy-foreground/70 hover:text-gold transition-colors text-[0.95rem]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-lg font-semibold mb-5">Programs</h3>
            <ul className="space-y-3">
              {programs.map((p) => (
                <li key={p.label}>
                  <Link href={p.path} className="text-navy-foreground/70 hover:text-gold transition-colors text-[0.95rem]">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-lg font-semibold mb-5">Visit &amp; Connect</h3>
            <ul className="space-y-4 text-[0.95rem]">
              <li className="flex items-start gap-3">
                <Icon name="MapPinIcon" size={20} variant="solid" className="text-gold flex-shrink-0 mt-0.5" />
                <span className="text-navy-foreground/70 leading-relaxed">Sholinganallur, Chennai, Tamil Nadu 600119</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="PhoneIcon" size={20} variant="solid" className="text-gold flex-shrink-0" />
                <a href="tel:+919876543210" className="text-navy-foreground/70 hover:text-gold transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="EnvelopeIcon" size={20} variant="solid" className="text-gold flex-shrink-0" />
                <a href="mailto:info@vertexacademy.com" className="text-navy-foreground/70 hover:text-gold transition-colors break-all">info@vertexacademy.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-12 border-t border-white/12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-navy-foreground/55 text-center sm:text-left">© {currentYear} Vertex Academy. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-navy-foreground/55 hover:text-gold transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-navy-foreground/55 hover:text-gold transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
