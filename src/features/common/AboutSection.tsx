/**
 * AboutSection - Premium about section with i18n
 */

import React from 'react';
import { FiTarget, FiHeart, FiUsers, FiStar } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const values = [
    {
      icon: FiTarget,
      title: t.ourMission,
      description: t.missionText,
    },
    {
      icon: FiHeart,
      title: t.ourValues,
      description: t.valuesText,
    },
    {
      icon: FiUsers,
      title: t.ourCommunity,
      description: t.communityText,
    },
    {
      icon: FiStar,
      title: t.ourVision,
      description: t.visionText,
    },
  ];

  return (
    <section id="about" dir={isRTL ? 'rtl' : 'ltr'} className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t.aboutTitle.split(' ')[0]} <span className="text-gradient-primary">{t.aboutTitle.split(' ').slice(1).join(' ') || t.schoolName}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.aboutDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="group p-8 rounded-3xl bg-card border border-border card-premium animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Director Info */}
        <div className="mt-20 text-center animate-slide-up delay-500">
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border backdrop-blur-sm">
            <p className="text-sm text-muted-foreground mb-2">{t.underDirection}</p>
            <h4 className="text-xl font-bold text-foreground">Abu Kathir AbdulHameed Olohunsola, MCPN</h4>
            <p className="text-sm text-primary mt-1 font-medium">{t.director}, {t.schoolName}</p>
          </div>
        </div>
      </div>
    </section>
  );
};