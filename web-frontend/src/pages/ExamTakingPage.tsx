import React from 'react';
import { ExamQuestion } from '../components/molecules/ExamQuestion';
import { ExamHeader } from '../components/molecules/ExamHeader';
import { ExamSidebar } from '../components/molecules/ExamSidebar';
import { ExamNavigation } from '../components/molecules/ExamNavigation';
import { SubmitConfirmationModal } from '../components/molecules/SubmitConfirmationModal';
import { ExamStatusDisplay } from '../components/molecules/ExamStatusDisplay';
import { useExamSession } from '../hooks/useExamSession';
import styles from '../assets/css/ExamTakingPage.module.css';

export const ExamTakingPage: React.FC = () => {
  const { 
    currentExam, 
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answeredQuestions,
    progress,
    timeRemaining,
    timeWarning,
    status,
    error,
    questions,
    answers,
    visitedQuestions,
    flaggedQuestions,
    isProctoringMinimized,
    setIsProctoringMinimized,
    showSubmitModal,
    setShowSubmitModal,
    isSubmitting,
    handleAnswerChange,
    handleFlagQuestion,
    handleNextQuestion,
    handlePreviousQuestion,
    handleGoToQuestion,
    handleSubmitExam,
    handleCameraReady,
    handleCameraError,
    formatTime,
    navigate
  } = useExamSession();

  // Loading state
  if (status === 'loading') {
    return <ExamStatusDisplay type="loading" />;
  }

  // Error state
  if (error) {
    return (
      <ExamStatusDisplay
        type="error"
        errorMessage={error}
        onBack={() => navigate('/user/home')}
      />
    );
  }

  // Guard clause - ensure exam and question are loaded
  if (!currentExam || !currentQuestion) {
    return null;
  }

  return (
    <div className={styles.page}>
      <ExamHeader
        examTitle={currentExam.title}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        answeredQuestions={answeredQuestions}
        progress={progress}
        timeRemaining={timeRemaining}
        timeWarning={timeWarning}
        formatTime={formatTime}
      />

      <div className={styles.mainContent}>
        {/* Left Column - Question */}
        <div className={styles.leftColumn}>
          <div className={styles.questionCard}>
            <ExamQuestion
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              currentAnswer={answers[currentQuestion.id]?.answer}
              onAnswerChange={handleAnswerChange}
              onFlagQuestion={handleFlagQuestion}
              isFlagged={flaggedQuestions.includes(currentQuestion.id)}
              timeSpent={answers[currentQuestion.id]?.timeSpent || 0}
            />
          </div>

          <ExamNavigation
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            onPrevious={handlePreviousQuestion}
            onNext={handleNextQuestion}
            onSubmit={() => setShowSubmitModal(true)}
          />
        </div>

        {/* Right Column - Sidebar */}
        <ExamSidebar
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          visitedQuestions={visitedQuestions}
          flaggedQuestions={flaggedQuestions}
          onGoToQuestion={handleGoToQuestion}
          isProctoringMinimized={isProctoringMinimized}
          onToggleMinimize={() => setIsProctoringMinimized(!isProctoringMinimized)}
          onCameraReady={handleCameraReady}
          onCameraError={handleCameraError}
        />
      </div>

      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={showSubmitModal}
        answeredQuestions={answeredQuestions}
        totalQuestions={totalQuestions}
        isSubmitting={isSubmitting}
        onConfirm={handleSubmitExam}
        onCancel={() => setShowSubmitModal(false)}
      />
    </div>
  );
};
