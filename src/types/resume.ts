export interface HeaderData {
  profilePicture: string; // base64 string
  fullName: string;
  headline: string;
  email: string;
  website: string;
  contactNumber: string;
  physicalAddress: string;
}

export interface ProfileData {
  id: string;
  network: string;
  username: string;
  url: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  url: string;
  startDate: string;
  endDate: string;
}

export interface EducationData {
  id: string;
  degree: string;
  school: string;
  year: string;
  gpa: string;
}

export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeData {
  header: HeaderData;
  profiles: ProfileData[];
  education: EducationData[];
  experience: ExperienceData[];
  projects: ProjectData[];
  skills: string[];
  interests: string[];
  summary: string;
  certifications: string;
  languages: string;
}
