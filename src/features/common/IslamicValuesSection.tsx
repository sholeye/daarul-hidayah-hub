import React from 'react';
import { FiBook, FiFeather, FiHeart, FiShield } from 'react-icons/fi';

export const IslamicValuesSection: React.FC = () => {
  const principles = [
    {
      icon: FiBook,
      title: 'Quran & Sunnah',
      description: 'Education firmly rooted in the Holy Quran and the authentic Sunnah of Prophet Muhammad (SAW).',
    },
    {
      icon: FiHeart,
      title: 'Ikhlas (Sincerity)',
      description: 'Cultivating pure intentions and sincerity in seeking knowledge for the sake of Allah alone.',
    },
    {
      icon: FiShield,
      title: 'Tarbiyyah (Discipline)',
      description: 'Building strong character through Islamic discipline, manners, and ethical conduct.',
    },
    {
      icon: FiFeather,
      title: 'Arabic Mastery',
      description: 'Comprehensive Arabic language instruction to unlock the treasures of Islamic scholarship.',
    },
  ];

  return (
    <section id="values" className="py-20 md:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Islamic Values & Discipline
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Our educational philosophy is grounded in authentic Islamic principles, 
            preparing students for both worldly success and eternal success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((principle, index) => (
            <div
              key={principle.title}
              className="text-center p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <principle.icon className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{principle.title}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">{principle.description}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <blockquote className="text-xl md:text-2xl font-medium italic text-primary-foreground/90 leading-relaxed">
            "Seek knowledge from the cradle to the grave."
          </blockquote>
          <p className="text-primary-foreground/60 mt-4 text-sm">— Prophet Muhammad (SAW)</p>
        </div>
      </div>
    </section>
  );
};
