<<<<<<< HEAD
=======

>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  LIMITED_ADMIN = 'LIMITED_ADMIN',
  EMPLOYER = 'EMPLOYER',
  CANDIDATE = 'CANDIDATE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  resumeUrl?: string;
  organization?: string;
<<<<<<< HEAD
  savedJobs?: string[];
  appliedJobs?: { jobId: string; status: string; date: string }[];
=======
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  region: string;
  subRegion?: string;
  specialty: string;
  postedAt: string;
  expiresAt: string;
  description: string;
  employerId: string;
<<<<<<< HEAD
  status: 'active' | 'expired' | 'pending' | 'scheduled' | 'inactive';
  externalApplyUrl?: string;
=======
  status: 'active' | 'expired' | 'pending';
  externalApplyUrl?: string;
  attachments?: string[];
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
  salaryRange?: string;
  type?: 'full-time' | 'part-time' | 'remote' | 'contract';
}

export interface CVExperience {
  company: string;
  role: string;
  duration: string;
  description: string;
<<<<<<< HEAD
  achievements?: string;
=======
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
}

export interface CVEducation {
  school: string;
  degree: string;
  year: string;
}

export interface CVCourse {
  title: string;
  institution: string;
  year: string;
}

<<<<<<< HEAD
export interface CVProject {
  title: string;
  link?: string;
  description: string;
}

=======
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
export interface CVData {
  fullName: string;
  title: string;
  phone: string;
  email: string;
  summary: string;
<<<<<<< HEAD
  photo?: string;
  experiences: CVExperience[];
  educations: CVEducation[];
  courses: CVCourse[];
  projects: CVProject[];
  technicalSkills: string[];
  softSkills: string[];
  tools: string[];
  languages: { name: string; level: number }[];
  interests: string[];
  references: string;
  design: {
    templateId: 'modern' | 'classic' | 'minimal';
=======
  experiences: CVExperience[];
  educations: CVEducation[];
  courses: CVCourse[];
  skills: string[];
  languages: { name: string; level: number }[];
  design: {
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
    accentColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
    direction: 'rtl' | 'ltr';
    showPhoto: boolean;
<<<<<<< HEAD
    layout: 'standard' | 'sidebar-left' | 'sidebar-right';
=======
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
  };
}

export interface EmployeeProfile {
  id: string;
  name: string;
<<<<<<< HEAD
  region: string;
  specialty: string;
  educationLevel: string;
  position: string;
=======
  specialty: string;
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
  skills: string[];
  jobHistory: string[];
  joinedDate: string;
}

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export interface AppSettings {
  lightPrimaryColor: string;
  lightSecondaryColor: string;
  darkPrimaryColor: string;
  darkSecondaryColor: string;
  language: Language;
  bannerImages: string[];
  bgPatternUrl?: string;
  bgPatternScale: number;
  bgPatternOpacity: number;
  theme: Theme;
  footerTextAr: string;
  footerTextEn: string;
  adSliderTitleAr: string;
  adSliderTitleEn: string;
  heroTitleAr: string;
  heroTitleEn: string;
  heroSubtitleAr: string;
  heroSubtitleEn: string;
  heroBgColor: string;
  heroImage?: string;
  adminNotificationEmails: string;
<<<<<<< HEAD
}
=======
}
>>>>>>> e7845ac54a0ad1844f63552e18a8a111d385aaa3
