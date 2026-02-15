import { create } from 'zustand';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  professionalSummary: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Resume {
  id: string;
  title: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  selectedTemplate: string;
  createdAt: string;
  updatedAt: string;
}

interface ResumeStore {
  resume: Resume | null;
  resumes: Resume[];
  setResume: (resume: Resume) => void;
  updatePersonalInfo: (info: PersonalInfo) => void;
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Experience) => void;
  deleteExperience: (id: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Education) => void;
  deleteEducation: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Skill) => void;
  deleteSkill: (id: string) => void;
  setSelectedTemplate: (template: string) => void;
  resetResume: () => void;
  setResumes: (resumes: Resume[]) => void;
}

const initialResume: Resume = {
  id: '',
  title: 'New Resume',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    professionalSummary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  selectedTemplate: 'classic',
  createdAt: '',
  updatedAt: '',
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: initialResume,
  resumes: [],

  setResume: (resume) => set({ resume }),
  setResumes: (resumes) => set({ resumes }),

  updatePersonalInfo: (info) =>
    set((state) => ({
      resume: state.resume ? { ...state.resume, personalInfo: info } : null,
    })),

  addExperience: (experience) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            experiences: [...state.resume.experiences, experience],
          }
        : null,
    })),

  updateExperience: (id, experience) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            experiences: state.resume.experiences.map((exp) =>
              exp.id === id ? experience : exp
            ),
          }
        : null,
    })),

  deleteExperience: (id) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            experiences: state.resume.experiences.filter((exp) => exp.id !== id),
          }
        : null,
    })),

  addEducation: (education) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            education: [...state.resume.education, education],
          }
        : null,
    })),

  updateEducation: (id, education) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            education: state.resume.education.map((edu) =>
              edu.id === id ? education : edu
            ),
          }
        : null,
    })),

  deleteEducation: (id) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            education: state.resume.education.filter((edu) => edu.id !== id),
          }
        : null,
    })),

  addSkill: (skill) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            skills: [...state.resume.skills, skill],
          }
        : null,
    })),

  updateSkill: (id, skill) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            skills: state.resume.skills.map((s) => (s.id === id ? skill : s)),
          }
        : null,
    })),

  deleteSkill: (id) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            skills: state.resume.skills.filter((s) => s.id !== id),
          }
        : null,
    })),

  setSelectedTemplate: (template) =>
    set((state) => ({
      resume: state.resume ? { ...state.resume, selectedTemplate: template } : null,
    })),

  resetResume: () => set({ resume: initialResume }),
}));
