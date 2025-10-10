import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/atoms/Button';
import { DetailSummaryCard } from '../components/molecules/DetailSummaryCard';
import { QuestionReviewCard } from '../components/molecules/QuestionReviewCard';
import { useExamDetails } from '../hooks/useExamDetails';
import styles from '../assets/css/ExamDetailPage.module.css';

export const ExamDetailPage: React.FC = () => {
  const { examDetails, handleGoBack, getQuestionStyles } = useExamDetails();

  if (!examDetails) {
    return (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataCard}>
          <p className={styles.noDataText}>Không tìm thấy dữ liệu bài thi</p>
          <Button onClick={handleGoBack} variant="secondary">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Chi tiết bài thi</h1>
          <p className={styles.subtitle}>{examDetails.title}</p>
        </div>

        {/* Summary Card */}
        <DetailSummaryCard
          correctAnswers={examDetails.correctAnswers}
          totalQuestions={examDetails.totalQuestions}
          score={examDetails.score}
          timeSpent={examDetails.timeSpent}
        />

        {/* Questions List */}
        <div className={styles.questionsList}>
          {examDetails.questions.map((question, index) => (
            <QuestionReviewCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
              questionStyles={getQuestionStyles(question.isCorrect, question.type)}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className={styles.bottomActions}>
          <Button onClick={handleGoBack} className={styles.backButton}>
            <ArrowLeft className={styles.backIcon} />
            Quay lại kết quả
          </Button>
        </div>
      </div>
    </div>
  );
};
