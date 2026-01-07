/**
 * LanguageContext - Comprehensive i18n support for English/Arabic
 * 
 * Usage: Wrap app with LanguageProvider, use useLanguage() hook
 * to access current language, translations, and toggle function.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Supported languages
export type Language = 'en' | 'ar';

// Translation keys structure - comprehensive for all UI text
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
  houseStandings: string;
  overallRankings: string;
  topStudents: string;
  individualRankings: string;
  wins: string;
  quizzes: string;
  representativeLogin: string;
  enterLoginCode: string;
  loginAvailableAtTime: string;
  quizIsLive: string;
  competitionEnded: string;
  questions: string;
  repsPerHouse: string;
  perQuestion: string;
  scheduledFor: string;
  representatives: string;
  notAvailableYet: string;
  quizButtonEnabled: string;
  recentResults: string;
  winningHouse: string;
  topStudent: string;
  week: string;
  pts: string;
  noUpcoming: string;
  noPastResults: string;
  
  // Admin Dashboard
  dashboard: string;
  welcomeBack: string;
  schoolOverview: string;
  totalStudents: string;
  revenueCollected: string;
  feeCompletion: string;
  pendingFees: string;
  recentStudents: string;
  viewAll: string;
  announcements: string;
  manage: string;
  todayAttendance: string;
  present: string;
  late: string;
  absent: string;
  
  // Admin Sidebar
  attendance: string;
  finance: string;
  results: string;
  settings: string;
  signOut: string;
  adminPortal: string;
  
  // Quiz Management
  quizManagement: string;
  createCompetition: string;
  addQuestions: string;
  assignRepresentatives: string;
  generateCredentials: string;
  competitionTitle: string;
  scheduleDate: string;
  scheduleTime: string;
  numberOfReps: string;
  questionBank: string;
  addQuestion: string;
  questionType: string;
  mcq: string;
  trueFalse: string;
  shortAnswer: string;
  questionText: string;
  correctAnswer: string;
  options: string;
  timeLimit: string;
  points: string;
  save: string;
  cancel: string;
  selectHouse: string;
  selectStudent: string;
  loginCredentials: string;
  copyCode: string;
  codeCopied: string;
  
  // Common
  readMore: string;
  loading: string;
  error: string;
  success: string;
  submit: string;
  back: string;
  next: string;
  search: string;
  filter: string;
  export: string;
  delete: string;
  edit: string;
  add: string;
  close: string;
  confirm: string;
  status: string;
  actions: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  score: string;
  rank: string;
  total: string;
  average: string;
  percentage: string;
  thisMonth: string;
  fromLastTerm: string;
  paid: string;
  unpaid: string;
  partial: string;
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
  
  quizCompetition: 'Inter-House Quiz Competition',
  quizSubtitle: 'Weekly knowledge competition between the four houses. Test your Islamic knowledge and earn points for your house every Sunday!',
  houses: 'Houses',
  leaderboard: 'Leaderboard',
  upcomingCompetition: 'Upcoming Competition',
  pastWinners: 'Past Winners',
  startQuiz: 'Start Quiz',
  viewResults: 'View Results',
  houseStandings: 'House Standings',
  overallRankings: 'Overall rankings',
  topStudents: 'Top Students',
  individualRankings: 'Individual rankings',
  wins: 'wins',
  quizzes: 'quizzes',
  representativeLogin: 'Representative Login',
  enterLoginCode: 'Enter your one-time code to start the quiz',
  loginAvailableAtTime: 'Login will be available at scheduled time',
  quizIsLive: 'Quiz is LIVE!',
  competitionEnded: 'Competition ended',
  questions: 'Questions',
  repsPerHouse: 'Reps/House',
  perQuestion: 'Per Question',
  scheduledFor: 'Scheduled For',
  representatives: 'Representatives',
  notAvailableYet: 'Not Available Yet',
  quizButtonEnabled: 'The quiz button will be enabled at the scheduled time.',
  recentResults: 'Recent competition results',
  winningHouse: 'Winning House',
  topStudent: 'Top Student',
  week: 'Week',
  pts: 'pts',
  noUpcoming: 'No upcoming competition scheduled.',
  noPastResults: 'No past competitions yet.',
  
  dashboard: 'Dashboard',
  welcomeBack: 'Welcome back!',
  schoolOverview: "Here's your school overview.",
  totalStudents: 'Total Students',
  revenueCollected: 'Revenue Collected',
  feeCompletion: 'Fee Completion',
  pendingFees: 'Pending Fees',
  recentStudents: 'Recent Students',
  viewAll: 'View all',
  announcements: 'Announcements',
  manage: 'Manage',
  todayAttendance: "Today's Attendance",
  present: 'Present',
  late: 'Late',
  absent: 'Absent',
  
  attendance: 'Attendance',
  finance: 'Finance',
  results: 'Results',
  settings: 'Settings',
  signOut: 'Sign Out',
  adminPortal: 'Admin Portal',
  
  quizManagement: 'Quiz Management',
  createCompetition: 'Create Competition',
  addQuestions: 'Add Questions',
  assignRepresentatives: 'Assign Representatives',
  generateCredentials: 'Generate Credentials',
  competitionTitle: 'Competition Title',
  scheduleDate: 'Schedule Date',
  scheduleTime: 'Schedule Time',
  numberOfReps: 'Reps per House',
  questionBank: 'Question Bank',
  addQuestion: 'Add Question',
  questionType: 'Question Type',
  mcq: 'Multiple Choice',
  trueFalse: 'True/False',
  shortAnswer: 'Short Answer',
  questionText: 'Question Text',
  correctAnswer: 'Correct Answer',
  options: 'Options',
  timeLimit: 'Time Limit',
  points: 'Points',
  save: 'Save',
  cancel: 'Cancel',
  selectHouse: 'Select House',
  selectStudent: 'Select Student',
  loginCredentials: 'Login Credentials',
  copyCode: 'Copy Code',
  codeCopied: 'Code Copied!',
  
  readMore: 'Read More',
  loading: 'Loading...',
  error: 'An error occurred',
  success: 'Success!',
  submit: 'Submit',
  back: 'Back',
  next: 'Next',
  search: 'Search',
  filter: 'Filter',
  export: 'Export',
  delete: 'Delete',
  edit: 'Edit',
  add: 'Add',
  close: 'Close',
  confirm: 'Confirm',
  status: 'Status',
  actions: 'Actions',
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  date: 'Date',
  time: 'Time',
  score: 'Score',
  rank: 'Rank',
  total: 'Total',
  average: 'Average',
  percentage: 'Percentage',
  thisMonth: 'this month',
  fromLastTerm: 'from last term',
  paid: 'Paid',
  unpaid: 'Unpaid',
  partial: 'Partial',
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
  
  quizCompetition: 'مسابقة المعرفة بين البيوت',
  quizSubtitle: 'مسابقة معرفية أسبوعية بين البيوت الأربعة. اختبر معرفتك الإسلامية واكسب نقاطاً لبيتك كل يوم أحد!',
  houses: 'البيوت',
  leaderboard: 'لوحة المتصدرين',
  upcomingCompetition: 'المسابقة القادمة',
  pastWinners: 'الفائزون السابقون',
  startQuiz: 'ابدأ المسابقة',
  viewResults: 'عرض النتائج',
  houseStandings: 'ترتيب البيوت',
  overallRankings: 'الترتيب العام',
  topStudents: 'أفضل الطلاب',
  individualRankings: 'الترتيب الفردي',
  wins: 'فوز',
  quizzes: 'مسابقات',
  representativeLogin: 'تسجيل دخول الممثل',
  enterLoginCode: 'أدخل رمزك لبدء المسابقة',
  loginAvailableAtTime: 'سيكون تسجيل الدخول متاحاً في الوقت المحدد',
  quizIsLive: 'المسابقة مباشرة!',
  competitionEnded: 'انتهت المسابقة',
  questions: 'الأسئلة',
  repsPerHouse: 'ممثل/بيت',
  perQuestion: 'لكل سؤال',
  scheduledFor: 'الموعد المحدد',
  representatives: 'الممثلون',
  notAvailableYet: 'غير متاح بعد',
  quizButtonEnabled: 'سيتم تفعيل زر المسابقة في الوقت المحدد.',
  recentResults: 'نتائج المسابقات الأخيرة',
  winningHouse: 'البيت الفائز',
  topStudent: 'أفضل طالب',
  week: 'الأسبوع',
  pts: 'نقطة',
  noUpcoming: 'لا توجد مسابقة قادمة مجدولة.',
  noPastResults: 'لا توجد مسابقات سابقة بعد.',
  
  dashboard: 'لوحة التحكم',
  welcomeBack: 'مرحباً بعودتك!',
  schoolOverview: 'نظرة عامة على المدرسة.',
  totalStudents: 'إجمالي الطلاب',
  revenueCollected: 'الإيرادات المحصلة',
  feeCompletion: 'نسبة تحصيل الرسوم',
  pendingFees: 'الرسوم المعلقة',
  recentStudents: 'الطلاب الجدد',
  viewAll: 'عرض الكل',
  announcements: 'الإعلانات',
  manage: 'إدارة',
  todayAttendance: 'حضور اليوم',
  present: 'حاضر',
  late: 'متأخر',
  absent: 'غائب',
  
  attendance: 'الحضور',
  finance: 'المالية',
  results: 'النتائج',
  settings: 'الإعدادات',
  signOut: 'تسجيل الخروج',
  adminPortal: 'بوابة الإدارة',
  
  quizManagement: 'إدارة المسابقات',
  createCompetition: 'إنشاء مسابقة',
  addQuestions: 'إضافة أسئلة',
  assignRepresentatives: 'تعيين الممثلين',
  generateCredentials: 'إنشاء بيانات الدخول',
  competitionTitle: 'عنوان المسابقة',
  scheduleDate: 'تاريخ الجدولة',
  scheduleTime: 'وقت الجدولة',
  numberOfReps: 'ممثلين لكل بيت',
  questionBank: 'بنك الأسئلة',
  addQuestion: 'إضافة سؤال',
  questionType: 'نوع السؤال',
  mcq: 'اختيار متعدد',
  trueFalse: 'صح/خطأ',
  shortAnswer: 'إجابة قصيرة',
  questionText: 'نص السؤال',
  correctAnswer: 'الإجابة الصحيحة',
  options: 'الخيارات',
  timeLimit: 'المدة الزمنية',
  points: 'النقاط',
  save: 'حفظ',
  cancel: 'إلغاء',
  selectHouse: 'اختر البيت',
  selectStudent: 'اختر الطالب',
  loginCredentials: 'بيانات تسجيل الدخول',
  copyCode: 'نسخ الرمز',
  codeCopied: 'تم النسخ!',
  
  readMore: 'اقرأ المزيد',
  loading: 'جارٍ التحميل...',
  error: 'حدث خطأ',
  success: 'تم بنجاح!',
  submit: 'إرسال',
  back: 'رجوع',
  next: 'التالي',
  search: 'بحث',
  filter: 'تصفية',
  export: 'تصدير',
  delete: 'حذف',
  edit: 'تعديل',
  add: 'إضافة',
  close: 'إغلاق',
  confirm: 'تأكيد',
  status: 'الحالة',
  actions: 'الإجراءات',
  name: 'الاسم',
  email: 'البريد الإلكتروني',
  phone: 'الهاتف',
  date: 'التاريخ',
  time: 'الوقت',
  score: 'النتيجة',
  rank: 'الترتيب',
  total: 'المجموع',
  average: 'المتوسط',
  percentage: 'النسبة',
  thisMonth: 'هذا الشهر',
  fromLastTerm: 'من الفصل الماضي',
  paid: 'مدفوع',
  unpaid: 'غير مدفوع',
  partial: 'جزئي',
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
