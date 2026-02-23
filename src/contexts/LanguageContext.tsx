/**
 * LanguageContext - Comprehensive i18n support for English/Arabic
 * Complete coverage for all UI elements across the application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ar';

interface Translations {
  // Navbar & Navigation
  home: string;
  about: string;
  curriculum: string;
  contact: string;
  quiz: string;
  gallery: string;
  portalLogin: string;
  
  // Hero Section
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
  yearsOfExcellence: string;
  nurturingMinds: string;
  heroDescription: string;
  
  // About Section
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  ourMission: string;
  missionText: string;
  ourVision: string;
  visionText: string;
  ourValues: string;
  valuesText: string;
  ourCommunity: string;
  communityText: string;
  ourApproach: string;
  approachText: string;
  ourStory: string;
  ourStoryText1: string;
  ourStoryText2: string;
  ourApproachIntro: string;
  approachQuran: string;
  approachCharacter: string;
  approachModern: string;
  approachIT: string;
  underDirection: string;
  
  // Islamic Values Section
  islamicValuesTitle: string;
  islamicValuesSubtitle: string;
  quranSunnah: string;
  quranSunnahText: string;
  ikhlas: string;
  ikhlasText: string;
  tarbiyyah: string;
  tarbiyyahText: string;
  arabicMastery: string;
  arabicMasteryText: string;
  seekKnowledge: string;
  prophetQuote: string;
  
  // Academic Structure
  academicStructure: string;
  academicStructureSubtitle: string;
  preparatoryLevel: string;
  preparatoryDesc: string;
  primaryLevel: string;
  primaryDesc: string;
  schoolFees: string;
  perTerm: string;
  
  // Curriculum Section
  curriculumTitle: string;
  curriculumSubtitle: string;
  arabicLanguage: string;
  islamicStudies: string;
  quranMemorization: string;
  englishLanguage: string;
  mathematics: string;
  computerIT: string;
  hadith: string;
  fiqh: string;
  qualifiedTeachers: string;
  qualifiedTeachersText: string;
  smallClassSizes: string;
  smallClassSizesText: string;
  structuredSchedule: string;
  structuredScheduleText: string;
  
  // Programs Section
  specialPrograms: string;
  programsSubtitle: string;
  tahfizProgram: string;
  tahfizProgramAr: string;
  tahfizDesc: string;
  tahfizItCombinedDesc: string;
  itProgram: string;
  itProgramAr: string;
  itProgramDesc: string;
  newLabel: string;
  ongoingLabel: string;
  structuredMemorization: string;
  tajweedTraining: string;
  regularRevision: string;
  certifiedCompletion: string;
  htmlStructure: string;
  cssStyling: string;
  responsiveDesign: string;
  handsOnProjects: string;
  learnMore: string;
  
  // Events Section
  eventsTitle: string;
  eventsSubtitle: string;
  ongoing: string;
  upcoming: string;
  noOngoingEvents: string;
  
  // Announcements
  announcementsTitle: string;
  announcementsSubtitle: string;
  latestUpdates: string;
  
  // Contact CTA
  beginJourney: string;
  beginJourneyText: string;
  accessPortal: string;
  
  // Gallery
  galleryTitle: string;
  gallerySubtitle: string;
  viewGallery: string;
  schoolLife: string;
  learningMoments: string;
  islamicEducation: string;
  studentActivities: string;
  
  // Quiz Competition
  quizCompetition: string;
  quizSubtitle: string;
  houses: string;
  leaderboard: string;
  upcomingCompetition: string;
  pastWinners: string;
  latestWinners: string;
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
  quizCompleted: string;
  question: string;
  house: string;
  retryDemo: string;
  backToPortal: string;
  typeYourAnswer: string;
  finish: string;
  missingLoginCode: string;
  unableToLoadQuestions: string;
  trueLabel: string;
  falseLabel: string;
  essayQuestion: string;
  essayGrading: string;
  pendingGrading: string;
  gradeNow: string;
  submitGrade: string;
  maxScore: string;
  rubric: string;
  essayAnswer: string;
  graderFeedback: string;
  gradedBy: string;
  awaitingGrade: string;
  yourEssaySubmitted: string;
  
  // Admin Dashboard & Portal
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
  
  // Admin Sidebar & Navigation
  attendance: string;
  finance: string;
  results: string;
  settings: string;
  signOut: string;
  adminPortal: string;
  instructorPortal: string;
  studentPortal: string;
  
  // Student Management
  addStudent: string;
  editStudent: string;
  studentDetails: string;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
  guardianInfo: string;
  guardianName: string;
  guardianPhone: string;
  occupation: string;
  stateOfOrigin: string;
  enrollmentDate: string;
  feeStatus: string;
  
  // Password Reset
  requestPasswordReset: string;
  passwordResetRequested: string;
  passwordResetInfo: string;
  
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
  
  // Footer
  quickLinks: string;
  contactUs: string;
  allRightsReserved: string;
  director: string;
  footerDescription: string;
  
  // Common UI Elements
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
  myClasses: string;
  profile: string;
  fees: string;
  logout: string;
  selectClass: string;
  selectDate: string;
  noDataAvailable: string;
  personalInfo: string;
  academicInfo: string;
  class: string;
  sex: string;
  male: string;
  female: string;
  origin: string;
}

const en: Translations = {
  // Navbar
  home: 'Home',
  about: 'About',
  curriculum: 'Curriculum',
  contact: 'Contact',
  quiz: 'Quiz',
  gallery: 'Gallery',
  portalLogin: 'Portal Login',
  
  // Hero
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
  yearsOfExcellence: 'Years of Excellence',
  nurturingMinds: 'Nurturing young minds with Islamic values',
  heroDescription: 'From our center in Ita Ika, Abeokuta, we deliver distinguished Islamic and Arabic education founded upon the Qur\'an and authentic Sunnah. We prepare our students with knowledge, discipline, and values that empower them to excel in their worldly pursuits and attain lasting success in the Hereafter.',
  
  // About
  aboutTitle: 'About Us',
  aboutSubtitle: 'Nurturing young minds with Islamic values and modern education',
  aboutDescription: 'We are an institution founded on the belief that true education shapes both the mind and the character. Our mission is not simply to teach, but to nurture individuals who understand their faith with clarity, live by it with sincerity, and carry it with confidence.\n\nWe emphasize depth over memorization, precision over assumption, and character alongside knowledge. Through strong Arabic foundations and authentic Islamic teachings, we equip students to access knowledge directly and grow with independence and purpose.\n\nOur goal is to develop individuals grounded in faith, refined in character, and prepared to live with responsibility, dignity, and lasting direction.',
  ourMission: 'Our Mission',
  missionText: 'To nurture students in the authentic teachings of Islam while equipping them with modern skills for a balanced life.',
  ourVision: 'Our Vision',
  visionText: 'To produce graduates who are exemplary Muslims, contributing positively to society with knowledge and character.',
  ourValues: 'Our Values',
  valuesText: 'Sincerity (Ikhlas), Knowledge (Ilm), Discipline (Tarbiyyah), and Excellence in all endeavors.',
  ourCommunity: 'Our Community',
  communityText: 'A supportive environment where students, teachers, and parents work together for holistic development.',
  ourApproach: 'Our Approach',
  approachText: 'We emphasize depth over memorization, precision over assumption, and character alongside knowledge through strong Arabic foundations.',
  ourStory: 'Our Story',
  ourStoryText1: 'Daarul Hidayah (House of Guidance) was established with a vision to create an educational institution that nurtures young minds in the authentic teachings of Islam while preparing them for the challenges of the modern world.',
  ourStoryText2: 'Located in Ita Ika, Abeokuta, Ogun State, our school serves as a beacon of knowledge for the local community and beyond, offering quality Islamic and Arabic education at affordable rates.',
  ourApproachIntro: 'We believe in a balanced approach to education that integrates:',
  approachQuran: 'Comprehensive Quran and Arabic studies',
  approachCharacter: 'Character development through Islamic values',
  approachModern: 'Modern academic subjects for well-rounded education',
  approachIT: 'IT skills for future readiness',
  underDirection: 'Under the Direction of',
  
  // Islamic Values
  islamicValuesTitle: 'Islamic Values & Discipline',
  islamicValuesSubtitle: 'Our educational philosophy is grounded in authentic Islamic principles, preparing students for both worldly success and eternal success.',
  quranSunnah: 'Quran & Sunnah',
  quranSunnahText: 'Education firmly rooted in the Holy Quran and the authentic Sunnah of Prophet Muhammad (SAW).',
  ikhlas: 'Ikhlas (Sincerity)',
  ikhlasText: 'Cultivating pure intentions and sincerity in seeking knowledge for the sake of Allah alone.',
  tarbiyyah: 'Tarbiyyah (Discipline)',
  tarbiyyahText: 'Building strong character through Islamic discipline, manners, and ethical conduct.',
  arabicMastery: 'Arabic Mastery',
  arabicMasteryText: 'Comprehensive Arabic language instruction to unlock the treasures of Islamic scholarship.',
  seekKnowledge: '"Seek knowledge from the cradle to the grave."',
  prophetQuote: '— Prophet Muhammad (SAW)',
  
  // Academic Structure
  academicStructure: 'Academic Structure',
  academicStructureSubtitle: 'Our school offers a structured learning path from preparatory to primary levels.',
  preparatoryLevel: 'Preparatory Level',
  preparatoryDesc: 'Foundation classes building core Islamic and Arabic skills',
  primaryLevel: 'Primary Level',
  primaryDesc: 'Advanced Islamic studies with modern academic integration',
  schoolFees: 'School Fees',
  perTerm: 'per term',
  
  // Curriculum
  curriculumTitle: 'Our Curriculum',
  curriculumSubtitle: 'A balanced blend of Islamic sciences, Arabic language, and modern academics designed to prepare students for success in both worlds.',
  arabicLanguage: 'Arabic Language',
  islamicStudies: 'Islamic Studies',
  quranMemorization: 'Quran Memorization',
  englishLanguage: 'English Language',
  mathematics: 'Mathematics',
  computerIT: 'Computer/IT',
  hadith: 'Hadith',
  fiqh: 'Fiqh',
  qualifiedTeachers: 'Qualified Teachers',
  qualifiedTeachersText: 'Experienced educators dedicated to Islamic and academic excellence.',
  smallClassSizes: 'Small Class Sizes',
  smallClassSizesText: 'Personalized attention for every student\'s learning journey.',
  structuredSchedule: 'Structured Schedule',
  structuredScheduleText: 'Balanced timetable for Quran, Arabic, and modern subjects.',
  
  // Programs
  specialPrograms: 'Special Programs',
  programsSubtitle: 'Beyond our core curriculum, we offer specialized programs to develop additional skills and deepen Islamic knowledge.',
  tahfizProgram: 'Tahfiz Program',
  tahfizProgramAr: 'برنامج التحفيظ',
  tahfizDesc: 'Dedicated Quran memorization program for students committed to preserving the Holy Quran in their hearts.',
  tahfizItCombinedDesc: 'Students enrolled in the Tahfiz program automatically participate in the IT program. This unique combination ensures students develop both spiritual depth through Quran memorization and practical digital skills for the modern world.',
  itProgram: 'IT Program',
  itProgramAr: 'برنامج تقنية المعلومات',
  itProgramDesc: 'Introduction to web development covering HTML, CSS, and fundamental web design principles.',
  newLabel: 'New',
  ongoingLabel: 'Ongoing',
  structuredMemorization: 'Structured memorization schedule',
  tajweedTraining: 'Tajweed and recitation training',
  regularRevision: 'Regular revision sessions',
  certifiedCompletion: 'Certified upon completion',
  htmlStructure: 'HTML structure and semantics',
  cssStyling: 'CSS styling and layouts',
  responsiveDesign: 'Responsive web design',
  handsOnProjects: 'Hands-on projects',
  learnMore: 'Learn More',
  
  // Events
  eventsTitle: 'School Events',
  eventsSubtitle: 'Stay updated with our ongoing programs and upcoming events.',
  ongoing: 'Ongoing',
  upcoming: 'Upcoming',
  noOngoingEvents: 'No ongoing events at the moment.',
  
  // Announcements
  announcementsTitle: 'Announcements',
  announcementsSubtitle: 'Important updates and news from the school.',
  latestUpdates: 'Latest Updates',
  
  // Contact CTA
  beginJourney: 'Begin Your Child\'s Islamic Education Journey',
  beginJourneyText: 'Join Daarul Hidayah and give your child the foundation of authentic Islamic knowledge combined with modern education.',
  accessPortal: 'Access Portal',
  
  // Gallery
  galleryTitle: 'School Gallery',
  gallerySubtitle: 'Glimpses of life at Daarul Hidayah - learning, growing, and thriving together.',
  viewGallery: 'View Gallery',
  schoolLife: 'School Life',
  learningMoments: 'Learning Moments',
  islamicEducation: 'Islamic Education',
  studentActivities: 'Student Activities',
  
  // Quiz
  quizCompetition: 'Inter-House Quiz Competition',
  quizSubtitle: 'Weekly knowledge competition between the four houses. Test your Islamic knowledge and earn points for your house every Sunday!',
  houses: 'Houses',
  leaderboard: 'Leaderboard',
  upcomingCompetition: 'Upcoming Competition',
  pastWinners: 'Past Winners',
  latestWinners: 'Latest Winners',
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
  quizCompleted: 'Quiz Completed',
  question: 'Question',
  house: 'House',
  retryDemo: 'Retry Demo',
  backToPortal: 'Back to Portal',
  typeYourAnswer: 'Type your answer',
  finish: 'Finish',
  missingLoginCode: 'Missing login code.',
  unableToLoadQuestions: 'Unable to load quiz questions.',
  trueLabel: 'True',
  falseLabel: 'False',
  essayQuestion: 'Essay Question',
  essayGrading: 'Essay Grading',
  pendingGrading: 'Pending Grading',
  gradeNow: 'Grade Now',
  submitGrade: 'Submit Grade',
  maxScore: 'Max Score',
  rubric: 'Grading Rubric',
  essayAnswer: 'Essay Answer',
  graderFeedback: 'Grader Feedback',
  gradedBy: 'Graded By',
  awaitingGrade: 'Awaiting Grade',
  yourEssaySubmitted: 'Your essay has been submitted and is awaiting grading',
  
  // Dashboard
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
  
  // Sidebar
  attendance: 'Attendance',
  finance: 'Finance',
  results: 'Results',
  settings: 'Settings',
  signOut: 'Sign Out',
  adminPortal: 'Admin Portal',
  instructorPortal: 'Instructor Portal',
  studentPortal: 'Student Portal',
  
  // Student Management
  addStudent: 'Add Student',
  editStudent: 'Edit Student',
  studentDetails: 'Student Details',
  studentId: 'Student ID',
  fullName: 'Full Name',
  dateOfBirth: 'Date of Birth',
  address: 'Address',
  guardianInfo: 'Guardian Information',
  guardianName: 'Guardian Name',
  guardianPhone: 'Guardian Phone',
  occupation: 'Occupation',
  stateOfOrigin: 'State of Origin',
  enrollmentDate: 'Enrollment Date',
  feeStatus: 'Fee Status',
  
  // Password Reset
  requestPasswordReset: 'Request Password Reset',
  passwordResetRequested: 'Password Reset Requested',
  passwordResetInfo: 'Your password reset request has been sent to the admin. Please contact the school administration to receive your new password.',
  
  // Quiz Management
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
  
  // Footer
  quickLinks: 'Quick Links',
  contactUs: 'Contact Us',
  allRightsReserved: 'All rights reserved.',
  director: 'Director',
  footerDescription: 'Providing quality Islamic and Arabic education with modern IT skills for the future generation.',
  
  // Common
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
  myClasses: 'My Classes',
  profile: 'Profile',
  fees: 'Fees',
  logout: 'Logout',
  selectClass: 'Select Class',
  selectDate: 'Select Date',
  noDataAvailable: 'No data available',
  personalInfo: 'Personal Information',
  academicInfo: 'Academic Information',
  class: 'Class',
  sex: 'Sex',
  male: 'Male',
  female: 'Female',
  origin: 'Origin',
};

const ar: Translations = {
  // Navbar
  home: 'الرئيسية',
  about: 'من نحن',
  curriculum: 'المنهج',
  contact: 'اتصل بنا',
  quiz: 'المسابقة',
  gallery: 'المعرض',
  portalLogin: 'تسجيل الدخول',
  
  // Hero
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
  yearsOfExcellence: 'سنوات من التميز',
  nurturingMinds: 'رعاية العقول الشابة بالقيم الإسلامية',
  heroDescription: 'تقع في إيتا إيكا، أبيوكوتا، نقدم تعليماً إسلامياً وعربياً عالي الجودة متجذراً في القرآن والسنة، لإعداد الطلاب للنجاح في الدنيا والآخرة.',
  
  // About
  aboutTitle: 'من نحن',
  aboutSubtitle: 'رعاية العقول الشابة بالقيم الإسلامية والتعليم الحديث',
  aboutDescription: 'تقع في إيتا إيكا، أبيوكوتا، نحن مدرسة إسلامية وعربية ملتزمة بتقديم تعليم عالي الجودة متجذر في القيم الإسلامية والمعايير التعليمية الحديثة.',
  ourMission: 'رسالتنا',
  missionText: 'تنشئة الطلاب على تعاليم الإسلام الأصيلة مع تزويدهم بالمهارات الحديثة لحياة متوازنة.',
  ourVision: 'رؤيتنا',
  visionText: 'تخريج طلاب مسلمين نموذجيين يساهمون إيجابياً في المجتمع بالعلم والأخلاق.',
  ourValues: 'قيمنا',
  valuesText: 'الإخلاص والعلم والتربية والتميز في كل المساعي.',
  ourCommunity: 'مجتمعنا',
  communityText: 'بيئة داعمة يعمل فيها الطلاب والمعلمون وأولياء الأمور معاً للتنمية الشاملة.',
  underDirection: 'تحت إدارة',
  
  // Islamic Values
  islamicValuesTitle: 'القيم الإسلامية والتربية',
  islamicValuesSubtitle: 'تستند فلسفتنا التعليمية إلى المبادئ الإسلامية الأصيلة، لإعداد الطلاب للنجاح الدنيوي والأخروي.',
  quranSunnah: 'القرآن والسنة',
  quranSunnahText: 'تعليم راسخ في القرآن الكريم وسنة النبي محمد صلى الله عليه وسلم.',
  ikhlas: 'الإخلاص',
  ikhlasText: 'تنمية النوايا الصافية والإخلاص في طلب العلم لوجه الله وحده.',
  tarbiyyah: 'التربية',
  tarbiyyahText: 'بناء شخصية قوية من خلال التأديب الإسلامي والآداب والسلوك الأخلاقي.',
  arabicMastery: 'إتقان العربية',
  arabicMasteryText: 'تعليم شامل للغة العربية لفتح كنوز العلم الإسلامي.',
  seekKnowledge: '"اطلبوا العلم من المهد إلى اللحد"',
  prophetQuote: '— النبي محمد صلى الله عليه وسلم',
  
  // Academic Structure
  academicStructure: 'الهيكل الأكاديمي',
  academicStructureSubtitle: 'تقدم مدرستنا مساراً تعليمياً منظماً من المستوى التحضيري إلى الابتدائي.',
  preparatoryLevel: 'المستوى التحضيري',
  preparatoryDesc: 'فصول تأسيسية لبناء المهارات الإسلامية والعربية الأساسية',
  primaryLevel: 'المستوى الابتدائي',
  primaryDesc: 'دراسات إسلامية متقدمة مع دمج أكاديمي حديث',
  schoolFees: 'الرسوم الدراسية',
  perTerm: 'للفصل',
  
  // Curriculum
  curriculumTitle: 'منهجنا الدراسي',
  curriculumSubtitle: 'مزيج متوازن من العلوم الإسلامية واللغة العربية والأكاديميات الحديثة لإعداد الطلاب للنجاح في الدنيا والآخرة.',
  arabicLanguage: 'اللغة العربية',
  islamicStudies: 'الدراسات الإسلامية',
  quranMemorization: 'حفظ القرآن',
  englishLanguage: 'اللغة الإنجليزية',
  mathematics: 'الرياضيات',
  computerIT: 'الحاسوب/تقنية المعلومات',
  hadith: 'الحديث',
  fiqh: 'الفقه',
  qualifiedTeachers: 'معلمون مؤهلون',
  qualifiedTeachersText: 'معلمون ذوو خبرة ملتزمون بالتميز الإسلامي والأكاديمي.',
  smallClassSizes: 'فصول صغيرة',
  smallClassSizesText: 'اهتمام شخصي بمسيرة تعلم كل طالب.',
  structuredSchedule: 'جدول منظم',
  structuredScheduleText: 'جدول متوازن للقرآن والعربية والمواد الحديثة.',
  
  // Programs
  specialPrograms: 'البرامج الخاصة',
  programsSubtitle: 'بالإضافة إلى مناهجنا الأساسية، نقدم برامج متخصصة لتطوير مهارات إضافية وتعميق المعرفة الإسلامية.',
  tahfizProgram: 'برنامج التحفيظ',
  tahfizProgramAr: 'برنامج التحفيظ',
  tahfizDesc: 'برنامج مخصص لحفظ القرآن للطلاب الملتزمين بحفظ القرآن الكريم في قلوبهم.',
  itProgram: 'برنامج تقنية المعلومات',
  itProgramAr: 'برنامج تقنية المعلومات',
  itProgramDesc: 'مقدمة في تطوير الويب تغطي HTML وCSS ومبادئ تصميم الويب الأساسية.',
  newLabel: 'جديد',
  ongoingLabel: 'مستمر',
  structuredMemorization: 'جدول حفظ منظم',
  tajweedTraining: 'تدريب على التجويد والتلاوة',
  regularRevision: 'جلسات مراجعة منتظمة',
  certifiedCompletion: 'شهادة عند الإتمام',
  htmlStructure: 'هيكل HTML ودلالاته',
  cssStyling: 'تنسيق CSS والتخطيطات',
  responsiveDesign: 'تصميم ويب متجاوب',
  handsOnProjects: 'مشاريع عملية',
  learnMore: 'اعرف المزيد',
  
  // Events
  eventsTitle: 'الفعاليات المدرسية',
  eventsSubtitle: 'ابق على اطلاع ببرامجنا الجارية والفعاليات القادمة.',
  ongoing: 'جارية',
  upcoming: 'قادمة',
  noOngoingEvents: 'لا توجد فعاليات جارية حالياً.',
  
  // Announcements
  announcementsTitle: 'الإعلانات',
  announcementsSubtitle: 'تحديثات وأخبار هامة من المدرسة.',
  latestUpdates: 'آخر التحديثات',
  
  // Contact CTA
  beginJourney: 'ابدأ رحلة طفلك التعليمية الإسلامية',
  beginJourneyText: 'انضم إلى دار الهداية وامنح طفلك أساس المعرفة الإسلامية الأصيلة مع التعليم الحديث.',
  accessPortal: 'الدخول للبوابة',
  
  // Gallery
  galleryTitle: 'معرض المدرسة',
  gallerySubtitle: 'لمحات من الحياة في دار الهداية - التعلم والنمو والازدهار معاً.',
  viewGallery: 'عرض المعرض',
  schoolLife: 'الحياة المدرسية',
  learningMoments: 'لحظات التعلم',
  islamicEducation: 'التعليم الإسلامي',
  studentActivities: 'أنشطة الطلاب',
  
  // Quiz
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
  quizCompleted: 'اكتملت المسابقة',
  question: 'سؤال',
  house: 'البيت',
  retryDemo: 'إعادة العرض التجريبي',
  backToPortal: 'العودة للبوابة',
  typeYourAnswer: 'اكتب إجابتك',
  finish: 'إنهاء',
  missingLoginCode: 'رمز الدخول مفقود.',
  unableToLoadQuestions: 'تعذر تحميل أسئلة المسابقة.',
  trueLabel: 'صح',
  falseLabel: 'خطأ',
  essayQuestion: 'سؤال مقالي',
  essayGrading: 'تقييم المقال',
  pendingGrading: 'بانتظار التقييم',
  gradeNow: 'قيّم الآن',
  submitGrade: 'إرسال التقييم',
  maxScore: 'أعلى درجة',
  rubric: 'معايير التقييم',
  essayAnswer: 'إجابة المقال',
  graderFeedback: 'ملاحظات المقيّم',
  gradedBy: 'تم التقييم بواسطة',
  awaitingGrade: 'بانتظار التقييم',
  yourEssaySubmitted: 'تم إرسال مقالك وهو بانتظار التقييم',
  
  // Dashboard
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
  
  // Sidebar
  attendance: 'الحضور',
  finance: 'المالية',
  results: 'النتائج',
  settings: 'الإعدادات',
  signOut: 'تسجيل الخروج',
  adminPortal: 'بوابة الإدارة',
  instructorPortal: 'بوابة المعلم',
  studentPortal: 'بوابة الطالب',
  
  // Student Management
  addStudent: 'إضافة طالب',
  editStudent: 'تعديل بيانات الطالب',
  studentDetails: 'تفاصيل الطالب',
  studentId: 'رقم الطالب',
  fullName: 'الاسم الكامل',
  dateOfBirth: 'تاريخ الميلاد',
  address: 'العنوان',
  guardianInfo: 'معلومات ولي الأمر',
  guardianName: 'اسم ولي الأمر',
  guardianPhone: 'هاتف ولي الأمر',
  occupation: 'المهنة',
  stateOfOrigin: 'الولاية الأصلية',
  enrollmentDate: 'تاريخ التسجيل',
  feeStatus: 'حالة الرسوم',
  
  // Password Reset
  requestPasswordReset: 'طلب إعادة تعيين كلمة المرور',
  passwordResetRequested: 'تم طلب إعادة تعيين كلمة المرور',
  passwordResetInfo: 'تم إرسال طلب إعادة تعيين كلمة المرور إلى المسؤول. يرجى التواصل مع إدارة المدرسة للحصول على كلمة المرور الجديدة.',
  
  // Quiz Management
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
  
  // Footer
  quickLinks: 'روابط سريعة',
  contactUs: 'اتصل بنا',
  allRightsReserved: 'جميع الحقوق محفوظة.',
  director: 'المدير',
  footerDescription: 'تقديم تعليم إسلامي وعربي عالي الجودة مع مهارات تقنية المعلومات الحديثة للجيل القادم.',
  
  // Common
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
  myClasses: 'فصولي',
  profile: 'الملف الشخصي',
  fees: 'الرسوم',
  logout: 'خروج',
  selectClass: 'اختر الفصل',
  selectDate: 'اختر التاريخ',
  noDataAvailable: 'لا توجد بيانات متاحة',
  personalInfo: 'المعلومات الشخصية',
  academicInfo: 'المعلومات الأكاديمية',
  class: 'الفصل',
  sex: 'الجنس',
  male: 'ذكر',
  female: 'أنثى',
  origin: 'الأصل',
};

const translations: Record<Language, Translations> = { en, ar };

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
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored === 'ar' ? 'ar' : 'en') as Language;
  });

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

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};