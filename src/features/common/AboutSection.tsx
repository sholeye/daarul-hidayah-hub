import React from 'react';
import { FiTarget, FiHeart, FiUsers, FiStar } from 'react-icons/fi';

export const AboutSection: React.FC = () => {
  const values = [
    {
      icon: FiTarget,
      title: 'Our Mission',
      description: 'To nurture students in the authentic teachings of Islam while equipping them with modern skills for a balanced life.',
    },
    {
      icon: FiHeart,
      title: 'Our Values',
      description: 'Sincerity (Ikhlas), Knowledge (Ilm), Discipline (Tarbiyyah), and Excellence in all endeavors.',
    },
    {
      icon: FiUsers,
      title: 'Our Community',
      description: 'A supportive environment where students, teachers, and parents work together for holistic development.',
    },
    {
      icon: FiStar,
      title: 'Our Vision',
      description: 'To produce graduates who are exemplary Muslims, contributing positively to society with knowledge and character.',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About <span className="text-gradient-primary">Daarul Hidayah</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Located in Ita Ika, Abeokuta, we are an onsite Islamic and Arabic school dedicated to 
            providing quality education rooted in Islamic values and modern educational standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="group p-6 md:p-8 rounded-2xl bg-card border border-border card-elevated"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Director Info */}
        <div className="mt-16 text-center">
          <div className="inline-block p-6 md:p-8 rounded-2xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground mb-2">Under the Direction of</p>
            <h4 className="text-xl font-bold text-foreground">Abu Kathir AbdulHameed Olohunsola, MCPN</h4>
            <p className="text-sm text-primary mt-1">Director, Daarul Hidayah</p>
          </div>
        </div>
      </div>
    </section>
  );
};
