import React from 'react';
import { Navbar } from '@/features/common/Navbar';
import { Footer } from '@/features/common/Footer';
import { AboutSection } from '@/features/common/AboutSection';
import { ContactCTASection } from '@/features/common/ContactCTASection';
import { FiBookOpen, FiUsers, FiAward, FiHeart } from 'react-icons/fi';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 bg-muted/30 islamic-pattern">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                About <span className="text-gradient-primary">Daarul Hidayah</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Established to provide authentic Islamic education combined with modern academic excellence.
              </p>
              <p className="text-xl italic text-primary">
                "Learn for servitude to Allah and Sincerity of Religion"
              </p>
            </div>
          </div>
        </section>

        {/* History & Background */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Daarul Hidayah (House of Guidance) was established with a vision to 
                    create an educational institution that nurtures young minds in the 
                    authentic teachings of Islam while preparing them for the challenges 
                    of the modern world.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Located in Ita Ika, Abeokuta, Ogun State, our school serves as a beacon 
                    of knowledge for the local community and beyond, offering quality 
                    Islamic and Arabic education at affordable rates.
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Approach</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We believe in a balanced approach to education that integrates:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <FiBookOpen className="w-5 h-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">Comprehensive Quran and Arabic studies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FiHeart className="w-5 h-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">Character development through Islamic values</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FiUsers className="w-5 h-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">Modern academic subjects for well-rounded education</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FiAward className="w-5 h-5 text-primary mt-0.5" />
                      <span className="text-muted-foreground">IT skills for future readiness</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AboutSection />
        <ContactCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
