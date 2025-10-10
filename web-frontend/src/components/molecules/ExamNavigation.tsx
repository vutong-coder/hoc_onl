import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../atoms/Button';
import styles from '../../assets/css/ExamNavigation.module.css';

interface ExamNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const ExamNavigation: React.FC<ExamNavigationProps> = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit
}) => {
  return (
    <div className={styles.navigation}>
      <Button
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        variant="secondary"
        className={styles.navButton}
      >
        <ChevronLeft className={styles.navIcon} />
        Câu trước
      </Button>

      <Button
        onClick={onSubmit}
        className={styles.submitButton}
      >
        Nộp bài
      </Button>

      <Button
        onClick={onNext}
        disabled={currentQuestionIndex === totalQuestions - 1}
        className={styles.navButton}
      >
        Câu tiếp
        <ChevronRight className={styles.navIcon} />
      </Button>
    </div>
  );
};

