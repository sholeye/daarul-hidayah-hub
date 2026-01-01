import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* School Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">D</span>
              </div>
              <div>
                <h3 className="font-bold text-xl">Daarul Hidayah</h3>
                <p className="text-primary-foreground/70 text-sm">Islamic & Arabic School</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4 italic">
              "Learn for servitude to Allah and Sincerity of Religion"
            </p>
            <p className="text-primary-foreground/70 text-sm">
              Providing quality Islamic and Arabic education with modern IT skills for the future generation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/curriculum" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Curriculum
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-4 h-4 mt-1 text-secondary" />
                <span className="text-primary-foreground/70 text-sm">
                  Ita Ika, Abeokuta,<br />Ogun State, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-4 h-4 text-secondary" />
                <a href="tel:08085944916" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  08085944916
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-4 h-4 text-secondary" />
                <a href="mailto:daarulhidayahabk@gmail.com" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  daarulhidayahabk@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Daarul Hidayah Islamic & Arabic School. All rights reserved.
          </p>
          <p className="text-primary-foreground/40 text-xs mt-2">
            Director: Abu Kathir AbdulHameed Olohunsola, MCPN
          </p>
        </div>
      </div>
    </footer>
  );
};
