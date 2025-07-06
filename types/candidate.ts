export interface Education {
  id: string;
  degree: string;
  institution: string;
  startYear: number;
  endYear: number | null;
  grade?: string;
}

export interface SocialLink {
  id: string;
  platform: 'GitHub' | 'LinkedIn' | 'Portfolio' | 'Twitter' | 'DevFolio';
  url: string;
}

export interface CandidateProfile {
  firstName: string;
  lastName: string;
  about?: string;
  profilePicture?: File;
  education: Education[];
  skills: string[];
  socialLinks: SocialLink[];
  resume?: File;
}