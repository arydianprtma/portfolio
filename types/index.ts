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
  features?: string[];
  challenges?: string[];
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

export interface AnalyticsData {
  pageViews: number;
  cvDownloads: number;
  lastUpdated?: string;
}

export interface StoreData {
  projects: Project[];
  posts?: Post[];
  messages?: ContactMessage[];
  profile: Profile;
  skills: SkillCategory[];
  experiments: Experiment[];
  admin?: AdminCredentials;
  analytics?: AnalyticsData;
}
