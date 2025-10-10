import React from 'react';
import { Flag } from 'lucide-react';
import styles from '../../assets/css/QuestionNavigator.module.css';
import { ExamQuestion } from '../../utils/types';

interface QuestionNavigatorProps {
  questions: ExamQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, any>;
  visitedQuestions: readonly number[];
  flaggedQuestions: readonly number[];
  onGoToQuestion: (index: number) => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentQuestionIndex,
  answers,
  visitedQuestions,
  flaggedQuestions,
  onGoToQuestion
}) => {
  return (
    <div className={styles.navigator}>
      <h3 className={styles.title}>Danh sách câu hỏi</h3>
      <div className={styles.questionGrid}>
        {questions.map((question, index) => {
          const isAnswered = answers[question.id];
          const isVisited = visitedQuestions.includes(index);
          const isFlagged = flaggedQuestions.includes(question.id);
          const isCurrent = index === currentQuestionIndex;

          return (
            <button
              key={question.id}
              onClick={() => onGoToQuestion(index)}
              className={`${styles.questionButton} ${
                isCurrent ? styles.current : ''
              } ${isAnswered ? styles.answered : ''} ${
                isFlagged ? styles.flagged : ''
              }`}
            >
              {index + 1}
              {isFlagged && (
                <Flag className={styles.flagIcon} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${styles.legendAnswered}`} />
          <span>Đã trả lời</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${styles.legendNotViewed}`} />
          <span>Chưa xem</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${styles.legendFlagged}`} />
          <span>Đã đánh dấu</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendBox} ${styles.legendCurrent}`} />
          <span>Câu hiện tại</span>
        </div>
      </div>
    </div>
  );
};

