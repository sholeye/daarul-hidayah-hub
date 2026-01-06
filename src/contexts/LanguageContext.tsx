/**
 * LanguageContext - Provides i18n support for English/Arabic
 * 
 * Usage: Wrap app with LanguageProvider, use useLanguage() hook
 * to access current language and toggle function.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Supported languages
export type Language = 'en' | 'ar';

// Translation keys structure
interface Translations {
  // Navbar
  home: string;
  about: string;
  curriculum: string;
  contact: string;
  quiz: string;
  portalLogin: string;
  
  // Hero
  establishedEducation: string;
  schoolName: string;
  schoolSubtitle: string;
  arabicMotto: string;
  englishMotto: string;
  enrollChild: string;
  viewCurriculum: string;
  classes: string;
  programs: string;
  students: string;
  qualityEducation: string;
  
  // About
  aboutTitle: string;
  aboutSubtitle: string;
  ourMission: string;
  missionText: string;
  ourVision: string;
  visionText: string;
  
  // Programs
  specialPrograms: string;
  programsSubtitle: string;
  tahfizProgram: string;
  itProgram: string;
  learnMore: string;
  
  // Quiz
  quizCompetition: string;
  quizSubtitle: string;
  houses: string;
  leaderboard: string;
  upcomingCompetition: string;
  pastWinners: string;
  startQuiz: string;
  viewResults: string;
  
  // Common
  readMore: string;
  loading: string;
  error: string;
}

// English translations
const en: Translations = {
  home: 'Home',
  about: 'About',
  curriculum: 'Curriculum',
  contact: 'Contact',
  quiz: 'Quiz',
  portalLogin: 'Portal Login',
  
  establishedEducation: 'Established Islamic Education',
  schoolName: 'Daarul Hidayah',
  schoolSubtitle: 'Islamic & Arabic School',
  arabicMotto: 'دار الهداية',
  englishMotto: '"Learn for servitude to Allah and Sincerity of Religion"',
  enrollChild: 'Enroll Your Child',
  viewCurriculum: 'View Curriculum',
  classes: 'Classes',
  programs: 'Programs',
  students: 'Students',
  qualityEducation: 'Quality Education',
  
  aboutTitle: 'About Us',
  aboutSubtitle: 'Nurturing young minds with Islamic values and modern education',
  ourMission: 'Our Mission',
  missionText: 'To provide quality Islamic and Arabic education that prepares students for both spiritual excellence and worldly success.',
  ourVision: 'Our Vision',
  visionText: 'To be the leading Islamic educational institution that produces well-rounded individuals grounded in faith.',
  
  specialPrograms: 'Special Programs',
  programsSubtitle: 'Beyond our core curriculum, we offer specialized programs',
  tahfizProgram: 'Tahfiz Program',
  itProgram: 'IT Program',
  learnMore: 'Learn More',
  
  quizCompetition: 'Weekly Quiz Competition',
  quizSubtitle: 'Inter-house knowledge competition every Sunday',
  houses: 'Houses',
  leaderboard: 'Leaderboard',
  upcomingCompetition: 'Upcoming Competition',
  pastWinners: 'Past Winners',
  startQuiz: 'Start Quiz',
  viewResults: 'View Results',
  
  readMore: 'Read More',
  loading: 'Loading...',
  error: 'An error occurred',
};

// Arabic translations
const ar: Translations = {
  home: 'الرئيسية',
  about: 'من نحن',
  curriculum: 'المنهج',
  contact: 'اتصل بنا',
  quiz: 'المسابقة',
  portalLogin: 'تسجيل الدخول',
  
  establishedEducation: 'التعليم الإسلامي الراسخ',
  schoolName: 'دار الهداية',
  schoolSubtitle: 'مدرسة إسلامية وعربية',
  arabicMotto: 'دار الهداية',
  englishMotto: '"تعلم لعبادة الله وإخلاص الدين"',
  enrollChild: 'سجل طفلك',
  viewCurriculum: 'عرض المنهج',
  classes: 'الفصول',
  programs: 'البرامج',
  students: 'الطلاب',
  qualityEducation: 'تعليم متميز',
  
  aboutTitle: 'من نحن',
  aboutSubtitle: 'رعاية العقول الشابة بالقيم الإسلامية والتعليم الحديث',
  ourMission: 'رسالتنا',
  missionText: 'تقديم تعليم إسلامي وعربي عالي الجودة يُعد الطلاب للتميز الروحي والنجاح الدنيوي.',
  ourVision: 'رؤيتنا',
  visionText: 'أن نكون المؤسسة التعليمية الإسلامية الرائدة التي تُخرج أفراداً متكاملين راسخين في الإيمان.',
  
  specialPrograms: 'البرامج الخاصة',
  programsSubtitle: 'بالإضافة إلى مناهجنا الأساسية، نقدم برامج متخصصة',
  tahfizProgram: 'برنامج التحفيظ',
  itProgram: 'برنامج تقنية المعلومات',
  learnMore: 'اعرف المزيد',
  
  quizCompetition: 'مسابقة الأسبوعية',
  quizSubtitle: 'مسابقة المعرفة بين البيوت كل يوم أحد',
  houses: 'البيوت',
  leaderboard: 'لوحة المتصدرين',
  upcomingCompetition: 'المسابقة القادمة',
  pastWinners: 'الفائزون السابقون',
  startQuiz: 'ابدأ المسابقة',
  viewResults: 'عرض النتائج',
  
  readMore: 'اقرأ المزيد',
  loading: 'جارٍ التحميل...',
  error: 'حدث خطأ',
};

// All translations
const translations: Record<Language, Translations> = { en, ar };

// Context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored === 'ar' ? 'ar' : 'en') as Language;
  });

  // Update localStorage and document direction when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  
  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language],
    isRTL: language === 'ar',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
