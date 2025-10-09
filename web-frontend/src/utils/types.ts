export type StatCardData = {
	title: string
	value: string
	subtitle?: string
	delayMs?: number
}

// Exam related types
export interface ExamDetails {
  id: string;
  title: string;
  duration: number; // minutes
  totalQuestions: number;
  isProctored: boolean;
  instructions: string[];
  questions: ExamQuestion[];
}

export interface ExamQuestion {
  id: number;
  type: 'multiple-choice' | 'code' | 'essay';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer?: number; // index for multiple choice
  codeTemplate?: string; // for code questions
  testCases?: { input: string; expected: string }[]; // for code questions
  points: number;
}

export interface ExamSubmission {
  examId: string;
  sessionId: string;
  answers: ExamAnswer[];
  timeSpent: number; // minutes
  submittedAt: string;
}

export interface ExamAnswer {
  questionId: number;
  answer: any; // string for essay, number for multiple choice, string for code
  timeSpent: number; // seconds spent on this question
}

export interface ExamResult {
  examId: string;
  sessionId: string;
  score: number; // percentage
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  submittedAt: string;
  passed: boolean;
}

export interface ExamSession {
  id: string;
  examId: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'abandoned';
}


