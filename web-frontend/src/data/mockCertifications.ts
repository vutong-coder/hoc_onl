import { Certification, CertificationSection } from '../types/certification';

export const mockCertifications: Certification[] = [
  // Role Certifications
  {
    id: 'frontend-react',
    title: 'Frontend Developer (React)',
    level: 'Intermediate',
    category: 'role',
    icon: 'react',
    color: '#61dafb',
    description: 'It covers topics like React fundamentals, component lifecycle, state management, and modern React patterns.'
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    level: 'Advanced',
    category: 'role',
    icon: 'code',
    color: '#007acc',
    description: 'It covers topics like system design, algorithms, data structures, and software architecture principles.'
  },
  {
    id: 'software-engineer-intern',
    title: 'Software Engineer Intern',
    level: 'Basic',
    category: 'role',
    icon: 'code',
    color: '#28a745',
    description: 'It covers topics like Problem solving and SQL.'
  },
  
  // Skill Certifications
  {
    id: 'angular-basic',
    title: 'Angular (Basic)',
    level: 'Basic',
    category: 'skill',
    icon: 'angular',
    color: '#dd0031',
    description: 'It covers topics like components, services, directives, and basic Angular concepts.'
  },
  {
    id: 'angular-intermediate',
    title: 'Angular (Intermediate)',
    level: 'Intermediate',
    category: 'skill',
    icon: 'angular',
    color: '#dd0031',
    description: 'It covers topics like advanced routing, forms, HTTP client, and state management.'
  },
  {
    id: 'csharp-basic',
    title: 'C# (Basic)',
    level: 'Basic',
    category: 'skill',
    icon: 'csharp',
    color: '#239120',
    description: 'It covers topics like variables, control structures, classes, and basic OOP concepts.'
  },
  {
    id: 'css-basic',
    title: 'CSS (Basic)',
    level: 'Basic',
    category: 'skill',
    icon: 'css',
    color: '#1572b6',
    description: 'It covers topics like selectors, properties, layouts, and responsive design.'
  },
  {
    id: 'go-basic',
    title: 'Go (Basic)',
    level: 'Basic',
    category: 'skill',
    icon: 'go',
    color: '#00add8',
    description: 'It covers topics like syntax, goroutines, channels, and basic concurrency.'
  },
  {
    id: 'go-intermediate',
    title: 'Go (Intermediate)',
    level: 'Intermediate',
    category: 'skill',
    icon: 'go',
    color: '#00add8',
    description: 'It covers topics like interfaces, error handling, testing, and advanced patterns.'
  },
  {
    id: 'java-basic',
    title: 'Java (Basic)',
    level: 'Basic',
    category: 'skill',
    icon: 'java',
    color: '#f89820',
    description: 'It covers topics like syntax, OOP, collections, and basic Java concepts.'
  },
  {
    id: 'javascript-basic',
    title: 'JavaScript (Basic)',
    level: 'Basic',
    category: 'skill',
    icon: 'javascript',
    color: '#f7df1e',
    description: 'It covers topics like variables, functions, objects, and DOM manipulation.'
  },
  {
    id: 'javascript-intermediate',
    title: 'JavaScript (Intermediate)',
    level: 'Intermediate',
    category: 'skill',
    icon: 'javascript',
    color: '#f7df1e',
    description: 'It covers topics like closures, prototypes, async programming, and ES6+ features.'
  },
  {
    id: 'python-basic',
    title: 'Python (Basic)',
    level: 'Basic',
    category: 'skill',
    icon: 'python',
    color: '#3776ab',
    description: 'It covers topics like syntax, data types, functions, and basic Python concepts.'
  },
  {
    id: 'python-intermediate',
    title: 'Python (Intermediate)',
    level: 'Intermediate',
    category: 'skill',
    icon: 'python',
    color: '#3776ab',
    description: 'It covers topics like OOP, decorators, generators, and advanced Python features.'
  },
  {
    id: 'react-basic',
    title: 'React (Basic)',
    level: 'Basic',
    category: 'skill',
    icon: 'react',
    color: '#61dafb',
    description: 'It covers topics like components, JSX, props, state, and basic React concepts.'
  },
  {
    id: 'typescript-basic',
    title: 'TypeScript (Basic)',
    level: 'Basic',
    category: 'skill',
    icon: 'typescript',
    color: '#3178c6',
    description: 'It covers topics like types, interfaces, classes, and basic TypeScript concepts.'
  }
];

export const certificationSections: CertificationSection[] = [
  {
    title: 'Get Your Roles Certified',
    certifications: mockCertifications.filter(cert => cert.category === 'role')
  },
  {
    title: 'Get Your Skills Certified',
    certifications: mockCertifications.filter(cert => cert.category === 'skill')
  }
];
