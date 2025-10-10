import { CertificationDetail } from '../types/certificationDetail';

export const mockCertificationDetails: { [key: string]: CertificationDetail } = {
  'frontend-react': {
    id: 'frontend-react',
    title: 'Frontend Developer',
    subtitle: '(React)',
    description: 'Demonstrate your expertise in building modern, responsive web applications using React, JavaScript, and CSS. This certification validates your ability to create interactive user interfaces and manage component state effectively.',
    duration: '1 hour',
    questions: '4 questions',
    level: 'Intermediate',
    category: 'role',
    icon: 'react',
    color: '#61dafb',
    benefits: [
      'Stand out to employers with a verified React skills certification',
      'Validate your frontend development expertise',
      'Access to exclusive job opportunities',
      'Boost your professional credibility',
      'Join a community of certified developers'
    ],
    requirements: [
      'Basic understanding of HTML, CSS, and JavaScript',
      'Experience with React fundamentals',
      'Knowledge of component lifecycle and state management',
      'Familiarity with modern JavaScript (ES6+)'
    ],
    topics: [
      'React Components and JSX',
      'State Management (useState, useEffect)',
      'Props and Component Communication',
      'Event Handling',
      'Conditional Rendering',
      'Lists and Keys',
      'CSS Styling and Responsive Design',
      'JavaScript Fundamentals'
    ],
    faqs: [
      {
        id: 'what-is-test',
        question: 'What is the HackerRank Certification Test?',
        answer: 'The HackerRank Certification Test is a standardized assessment designed to evaluate your practical coding skills and knowledge in specific technologies. It consists of real-world coding problems that test your ability to solve challenges under time constraints.'
      },
      {
        id: 'types-of-tests',
        question: 'What are the different types of certification tests?',
        answer: 'We offer various certification tests including Role-based certifications (Frontend Developer, Backend Developer, Full Stack Developer) and Skill-based certifications (JavaScript, Python, SQL, React, etc.). Each test is tailored to validate specific competencies.'
      },
      {
        id: 'subject-matter',
        question: 'What is the subject matter tested during the test?',
        answer: 'For the Frontend Developer (React) certification, you will be tested on React fundamentals, component lifecycle, state management, event handling, JSX, props, CSS styling, and JavaScript concepts. The test focuses on practical application rather than theoretical knowledge.'
      },
      {
        id: 'if-fail',
        question: 'What happens if I fail the test?',
        answer: 'If you don\'t pass the test on your first attempt, you can retake it after a 7-day waiting period. We encourage you to review the topics and practice more before attempting again. There is no limit to the number of retakes.'
      },
      {
        id: 'why-take',
        question: 'Why should I take this test?',
        answer: 'This certification helps you stand out in the competitive job market, validates your skills to employers, provides access to exclusive job opportunities, and demonstrates your commitment to professional development in frontend development.'
      },
      {
        id: 'duration',
        question: 'What\'s the duration of the test?',
        answer: 'The Frontend Developer (React) certification test is 60 minutes long. This includes time for reading questions, coding solutions, and testing your implementations. We recommend managing your time effectively to complete all questions.'
      },
      {
        id: 'questions-count',
        question: 'How many questions are in the test?',
        answer: 'The test contains 4 carefully crafted questions that progressively increase in difficulty. These questions are designed to assess different aspects of React development, from basic component creation to complex state management scenarios.'
      }
    ],
    companyLogos: ['ORACLE', 'BANK OF AMERICA', 'Walmart', 'Uber', 'NUTANIX', 'Salesforce'],
    testimonialCount: '3 million'
  },
  'angular-basic': {
    id: 'angular-basic',
    title: 'Angular',
    subtitle: '(Basic)',
    description: 'Master the fundamentals of Angular development and learn to build robust single-page applications. This certification covers core Angular concepts, components, services, and routing.',
    duration: '45 minutes',
    questions: '3 questions',
    level: 'Basic',
    category: 'skill',
    icon: 'angular',
    color: '#dd0031',
    benefits: [
      'Validate your Angular fundamentals',
      'Showcase your frontend framework skills',
      'Access to Angular-specific job opportunities',
      'Build confidence in Angular development',
      'Join the Angular developer community'
    ],
    requirements: [
      'Basic understanding of HTML, CSS, and JavaScript',
      'Familiarity with TypeScript basics',
      'Knowledge of web development concepts',
      'Understanding of component-based architecture'
    ],
    topics: [
      'Angular Components',
      'TypeScript Fundamentals',
      'Data Binding',
      'Directives',
      'Services and Dependency Injection',
      'Routing and Navigation',
      'Forms and Validation',
      'HTTP Client'
    ],
    faqs: [
      {
        id: 'what-is-test',
        question: 'What is the HackerRank Certification Test?',
        answer: 'The HackerRank Certification Test is a standardized assessment designed to evaluate your practical coding skills and knowledge in specific technologies. It consists of real-world coding problems that test your ability to solve challenges under time constraints.'
      },
      {
        id: 'types-of-tests',
        question: 'What are the different types of certification tests?',
        answer: 'We offer various certification tests including Role-based certifications (Frontend Developer, Backend Developer, Full Stack Developer) and Skill-based certifications (JavaScript, Python, SQL, Angular, etc.). Each test is tailored to validate specific competencies.'
      },
      {
        id: 'subject-matter',
        question: 'What is the subject matter tested during the test?',
        answer: 'For the Angular (Basic) certification, you will be tested on Angular components, TypeScript fundamentals, data binding, directives, services, routing, forms, and HTTP client. The test focuses on practical application of Angular concepts.'
      },
      {
        id: 'if-fail',
        question: 'What happens if I fail the test?',
        answer: 'If you don\'t pass the test on your first attempt, you can retake it after a 7-day waiting period. We encourage you to review the topics and practice more before attempting again. There is no limit to the number of retakes.'
      },
      {
        id: 'why-take',
        question: 'Why should I take this test?',
        answer: 'This certification helps you stand out in the competitive job market, validates your Angular skills to employers, provides access to Angular-specific job opportunities, and demonstrates your commitment to learning modern frontend frameworks.'
      },
      {
        id: 'duration',
        question: 'What\'s the duration of the test?',
        answer: 'The Angular (Basic) certification test is 45 minutes long. This includes time for reading questions, coding solutions, and testing your implementations. We recommend managing your time effectively to complete all questions.'
      },
      {
        id: 'questions-count',
        question: 'How many questions are in the test?',
        answer: 'The test contains 3 carefully crafted questions that progressively increase in difficulty. These questions are designed to assess different aspects of Angular development, from basic component creation to service implementation.'
      }
    ],
    companyLogos: ['Microsoft', 'Google', 'Adobe', 'PayPal', 'IBM', 'Intel'],
    testimonialCount: '2.5 million'
  },
  'csharp-basic': {
    id: 'csharp-basic',
    title: 'C#',
    subtitle: '(Basic)',
    description: 'Learn the fundamentals of C# programming language and object-oriented programming concepts. This certification covers basic syntax, data types, control structures, and class design.',
    duration: '50 minutes',
    questions: '3 questions',
    level: 'Basic',
    category: 'skill',
    icon: 'csharp',
    color: '#239120',
    benefits: [
      'Validate your C# programming fundamentals',
      'Showcase your .NET development skills',
      'Access to C# developer job opportunities',
      'Build confidence in object-oriented programming',
      'Join the .NET developer community'
    ],
    requirements: [
      'Basic understanding of programming concepts',
      'Familiarity with object-oriented programming',
      'Knowledge of data types and variables',
      'Understanding of control structures'
    ],
    topics: [
      'C# Syntax and Data Types',
      'Variables and Constants',
      'Control Structures (if, for, while)',
      'Methods and Functions',
      'Classes and Objects',
      'Inheritance and Polymorphism',
      'Exception Handling',
      'Collections and LINQ'
    ],
    faqs: [
      {
        id: 'what-is-test',
        question: 'What is the HackerRank Certification Test?',
        answer: 'The HackerRank Certification Test is a standardized assessment designed to evaluate your practical coding skills and knowledge in specific technologies. It consists of real-world coding problems that test your ability to solve challenges under time constraints.'
      },
      {
        id: 'types-of-tests',
        question: 'What are the different types of certification tests?',
        answer: 'We offer various certification tests including Role-based certifications (Software Engineer, Backend Developer, Full Stack Developer) and Skill-based certifications (C#, Java, Python, SQL, etc.). Each test is tailored to validate specific competencies.'
      },
      {
        id: 'subject-matter',
        question: 'What is the subject matter tested during the test?',
        answer: 'For the C# (Basic) certification, you will be tested on C# syntax, data types, control structures, methods, classes, inheritance, exception handling, and basic collections. The test focuses on practical application of C# fundamentals.'
      },
      {
        id: 'if-fail',
        question: 'What happens if I fail the test?',
        answer: 'If you don\'t pass the test on your first attempt, you can retake it after a 7-day waiting period. We encourage you to review the topics and practice more before attempting again. There is no limit to the number of retakes.'
      },
      {
        id: 'why-take',
        question: 'Why should I take this test?',
        answer: 'This certification helps you stand out in the competitive job market, validates your C# skills to employers, provides access to .NET developer job opportunities, and demonstrates your commitment to learning modern programming languages.'
      },
      {
        id: 'duration',
        question: 'What\'s the duration of the test?',
        answer: 'The C# (Basic) certification test is 50 minutes long. This includes time for reading questions, coding solutions, and testing your implementations. We recommend managing your time effectively to complete all questions.'
      },
      {
        id: 'questions-count',
        question: 'How many questions are in the test?',
        answer: 'The test contains 3 carefully crafted questions that progressively increase in difficulty. These questions are designed to assess different aspects of C# development, from basic syntax to object-oriented programming concepts.'
      }
    ],
    companyLogos: ['Microsoft', 'Stack Overflow', 'Unity', 'JetBrains', 'GitHub', 'Slack'],
    testimonialCount: '2 million'
  }
};
