import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ProcessedQuestion {
  id: number;
  type: 'multiple-choice' | 'code' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: number;
  points: number;
  yourAnswer?: any;
  isCorrect: boolean;
  explanation: string;
}

interface ExamDetails {
  title: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  questions: ProcessedQuestion[];
}

export const useExamDetails = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { currentExam, questions, answers, startTime } = useSelector(
    (state: RootState) => state.exam
  );

  const calculateExamDetails = (): ExamDetails | null => {
    if (!questions || questions.length === 0) {
      return null;
    }

    let correctAnswers = 0;
    const questionsWithAnswers = questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer && question.correctAnswer !== undefined 
        ? userAnswer.answer === question.correctAnswer 
        : false;
      
      if (isCorrect) correctAnswers++;

      return {
        ...question,
        yourAnswer: userAnswer?.answer,
        isCorrect,
        explanation: `Đây là giải thích cho câu ${question.id}. ${
          isCorrect 
            ? 'Bạn đã trả lời đúng!' 
            : 'Đáp án đúng giúp bạn hiểu rõ hơn về vấn đề này.'
        }`
      };
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = startTime ? Math.round((Date.now() - startTime) / 60000) : 0;

    return {
      title: currentExam?.title || 'Bài thi',
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      questions: questionsWithAnswers
    };
  };

  const examDetails = calculateExamDetails();

  const handleGoBack = () => {
    navigate(`/exam/${examId}/result`);
  };

  const getQuestionStyles = (isCorrect: boolean, type: string) => {
    if (type === 'essay') {
      return {
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        border: '#93c5fd',
        headerColor: '#1e40af',
        subtextColor: '#1e3a8a'
      };
    }
    
    if (isCorrect) {
      return {
        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        border: '#6ee7b7',
        headerColor: '#065f46',
        subtextColor: '#047857'
      };
    }
    
    return {
      background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      border: '#fca5a5',
      headerColor: '#991b1b',
      subtextColor: '#7f1d1d'
    };
  };

  return {
    examDetails,
    examId,
    handleGoBack,
    getQuestionStyles
  };
};

