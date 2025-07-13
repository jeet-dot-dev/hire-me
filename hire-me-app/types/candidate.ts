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
  platform: 'GITHUB' | 'LINKEDIN' | 'PORTFOLIO' | 'TWITTER' | 'DEVFOLIO';
  url: string;
}

export interface CandidateProfile {
  firstName: string;
  lastName: string;
  about?: string;
  profilePicture?: File | string | undefined;
  education: Education[];
  skills: string[];
  socialLinks: SocialLink[];
  resume?: File | string | undefined;
}