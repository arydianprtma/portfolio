export interface Project {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  subtitleId?: string;
  description: string;
  descriptionId?: string;
  overview?: string;
  overviewId?: string;
  category: string;
  year: number;
  technologies: string[];
  thumbnail: string;
  images?: string[];
  featured?: boolean;
  published?: boolean;
  github?: string;
  demo?: string;
  role?: string;
  roleId?: string;
  deliveryStatus?: string;
  deliveryStatusId?: string;
  features?: string[];
  featuresId?: string[];
  challenges?: string[];
  challengesId?: string[];
}

export interface Post {
  id?: string;
  slug: string;
  title: string;
  titleId?: string;
  summary: string;
  summaryId?: string;
  content: string;
  contentId?: string;
  coverImage?: string;
  tags: string[];
  readingTime?: string;
  published?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  budget?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Experiment {
  id: string;
  title: string;
  category: string;
  description: string;
  year: number;
  technologies: string[];
  link?: string;
  github?: string;
}

export interface Profile {
  name: string;
  moniker: string;
  role: string;
  roleId?: string;
  tagline: string;
  taglineId?: string;
  bio: string[];
  bioId?: string[];
  location: string;
  status: string;
  statusId?: string;
  email: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socials: {
    github: string;
    linkedin: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface AdminCredentials {
  email: string;
  password: string;
  twoFactorSecret?: string;
  twoFactorEnabled?: boolean;
}

export interface PeriodStats {
  today: number;
  last7Days: number;
  last30Days: number;
  allTime: number;
}

export interface AnalyticsData {
  pageViews: number;
  cvDownloads: number;
  pageViewsBreakdown?: PeriodStats;
  cvDownloadsBreakdown?: PeriodStats;
  lastUpdated?: string;
}

export type InvoiceStatus = "DRAFT" | "PENDING" | "PAID" | "CANCELLED";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  clientAddress?: string;
  clientPhone?: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  currency: string;
  items: InvoiceItem[];
  subtotal: number;
  taxPercent?: number;
  taxAmount?: number;
  discountAmount?: number;
  total: number;
  paymentDetails?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CvSkillCategory {
  category: string;
  skills: string[];
  enabled?: boolean;
}

export interface CvExperience {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  highlights: string[];
  enabled?: boolean;
}

export interface CvEducation {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  year: string;
  details?: string;
  enabled?: boolean;
}

export interface CvProjectItem {
  id: string;
  title: string;
  role: string;
  technologies: string[];
  link?: string;
  description: string;
  highlights: string[];
  enabled?: boolean;
}

export interface CvData {
  template: "modern" | "ats" | "executive";
  language: "en" | "id";
  fullName: string;
  jobTitle: string;
  email: string;
  phone?: string;
  location: string;
  website?: string;
  github?: string;
  linkedin?: string;
  summary: string;
  showProjects?: boolean;
  showExperience?: boolean;
  showSkills?: boolean;
  showEducation?: boolean;
  showCertifications?: boolean;
  experiences: CvExperience[];
  education: CvEducation[];
  projects: CvProjectItem[];
  skillCategories: CvSkillCategory[];
  languages?: string[];
  certifications?: string[];
  updatedAt?: string;
}

export interface StoreData {
  projects: Project[];
  posts?: Post[];
  messages?: ContactMessage[];
  profile: Profile;
  skills: SkillCategory[];
  experiments: Experiment[];
  invoices?: Invoice[];
  cv?: CvData;
  admin?: AdminCredentials;
  analytics?: AnalyticsData;
}
