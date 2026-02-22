import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

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
  templateSettings?: TemplateSettings;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateSettings {
  accentColor?: string;
  headerBg?: string;
  headerColor?: string;
  sectionTitleColor?: string;
  fontFamily?: string;
}

interface ResumeStore {
  resume: Resume | null;
  resumes: Resume[];
  setResume: (resume: Resume) => void;
  saveDraft: () => void;
  previewTemplate?: string | null;
  setPreviewTemplate: (template: string | null) => void;
  setTemplateSettings: (settings: Partial<TemplateSettings>) => void;
  resetTemplateSettings: () => void;
  updatePersonalInfo: (info: PersonalInfo) => void;
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Experience) => void;
  deleteExperience: (id: string) => void;
  reorderExperience: (from: number, to: number) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Education) => void;
  deleteEducation: (id: string) => void;
  reorderEducation: (from: number, to: number) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Skill) => void;
  deleteSkill: (id: string) => void;
  reorderSkill: (from: number, to: number) => void;
  setSelectedTemplate: (template: string) => void;
  resetResume: () => void;
  setResumes: (resumes: Resume[]) => void;
}

function _reorder<T>(arr: T[], from: number, to: number) {
  const copy = [...arr];
  if (from < 0 || from >= copy.length || to < 0 || to >= copy.length) return copy;
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
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
  resumes: typeof window !== 'undefined' && localStorage.getItem('resumes')
    ? JSON.parse(localStorage.getItem('resumes') || '[]')
    : [],
  previewTemplate: null,

  setResume: (resume) => set({ resume }),
  saveDraft: () =>
    set((state) => {
      if (!state.resume) return {} as Partial<ResumeStore>;
      const now = new Date().toISOString();
      const draft: Resume = {
        ...state.resume,
        id: state.resume.id || uuidv4(),
        createdAt: state.resume.createdAt || now,
        updatedAt: now,
      };
      const updatedResumes = [draft, ...state.resumes.filter((r) => r.id !== draft.id)];
      try {
        localStorage.setItem('resumes', JSON.stringify(updatedResumes));
      } catch (err) {
        // ignore storage errors
        console.warn('Failed to persist drafts', err);
      }
      return { resume: draft, resumes: updatedResumes } as Partial<ResumeStore>;
    }),
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

  reorderExperience: (from, to) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            experiences: _reorder(state.resume.experiences, from, to),
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

  reorderEducation: (from, to) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            education: _reorder(state.resume.education, from, to),
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

  reorderSkill: (from, to) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            skills: _reorder(state.resume.skills, from, to),
          }
        : null,
    })),

  setSelectedTemplate: (template) =>
    set((state) => ({
      resume: state.resume
        ? { ...state.resume, selectedTemplate: template }
        : null,
    })),

  setTemplateSettings: (settings) =>
    set((state) => ({
      resume: state.resume ? { ...state.resume, templateSettings: { ...(state.resume.templateSettings || {}), ...settings } } : null,
    })),

  setPreviewTemplate: (template) => set(() => ({ previewTemplate: template })),

  resetTemplateSettings: () =>
    set((state) => ({
      resume: state.resume ? { ...state.resume, templateSettings: undefined } : null,
    })),

  resetResume: () => set({ resume: initialResume }),
}));
