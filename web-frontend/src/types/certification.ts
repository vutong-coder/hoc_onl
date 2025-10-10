export interface Certification {
  id: string;
  title: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  description?: string;
  category: 'role' | 'skill';
  icon: string;
  color?: string;
}

export interface CertificationSection {
  title: string;
  certifications: Certification[];
}
