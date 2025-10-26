import React, { useState, useCallback } from 'react';
import { ExamQuestion } from '../components/molecules/ExamQuestion';
import { ExamHeader } from '../components/molecules/ExamHeader';
import { ExamSidebar } from '../components/molecules/ExamSidebar';
import { ExamNavigation } from '../components/molecules/ExamNavigation';
import { SubmitConfirmationModal } from '../components/molecules/SubmitConfirmationModal';
import { ExamStatusDisplay } from '../components/molecules/ExamStatusDisplay';
import { AICameraMonitor } from '../components/molecules/AICameraMonitor';
import { ExamViolationAlert } from '../components/molecules/ExamViolationAlert';
import { useExamSession } from '../hooks/useExamSession';
import { CheatingDetection } from '../hooks/useAICameraMonitor';
import { mockExamService } from '../services/blockchain/examRecordService';
import styles from '../assets/css/ExamTakingPage.module.css';

export const ExamTakingPage: React.FC = () => {
  const [examSessionId, setExamSessionId] = useState<number | null>(null);
  const [violations, setViolations] = useState<CheatingDetection[]>([]);
  const [cameraMetrics, setCameraMetrics] = useState<any>(null);
  const [isCameraAutoStarted, setIsCameraAutoStarted] = useState(false);
  const [currentViolation, setCurrentViolation] = useState<CheatingDetection | null>(null);
  const [showViolationAlert, setShowViolationAlert] = useState(false);
  const [examStopped, setExamStopped] = useState(false);

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

  // Initialize exam session on blockchain
  React.useEffect(() => {
    const initializeExamSession = async () => {
      if (currentExam && !examSessionId) {
        try {
          const sessionId = await mockExamService.startExamSessionOnChain(
            parseInt(currentExam.id),
            '0x1234567890123456789012345678901234567890', // Mock student address
            currentExam.title
          );
          setExamSessionId(sessionId);
        } catch (error) {
          console.error('Failed to start exam session on blockchain:', error);
        }
      }
    };

    initializeExamSession();
  }, [currentExam, examSessionId]);

  // Auto-start camera when exam loads
  React.useEffect(() => {
    if (currentExam && !isCameraAutoStarted && status === 'idle') {
      setIsCameraAutoStarted(true);
    }
  }, [currentExam, isCameraAutoStarted, status]);

  // Handle cheating detection with alert
  const handleViolationDetected = useCallback(async (detection: CheatingDetection) => {
    setViolations(prev => [...prev, detection]);
    
    // Log detection with metadata
    console.log('[ExamTakingPage] Violation detected:', {
      type: detection.type,
      severity: detection.severity,
      confidence: detection.confidence,
      description: detection.description,
      metadata: detection.metadata,
      timestamp: new Date(detection.timestamp).toISOString()
    });
    
    // Show alert for medium, high, and critical violations
    if (detection.severity === 'medium' || detection.severity === 'high' || detection.severity === 'critical') {
      setCurrentViolation(detection);
      setShowViolationAlert(true);
    }
    
    if (examSessionId) {
      try {
        const violationTypeMap = {
          'FACE_NOT_DETECTED': 1,
          'MULTIPLE_FACES': 3,
          'MOBILE_PHONE_DETECTED': 7,
          'CAMERA_TAMPERED': 8,
          'LOOKING_AWAY': 9,
          'tab_switch': 4
        };

        const severityMap = {
          'low': 1,
          'medium': 2,
          'high': 3,
          'critical': 4
        };

        await mockExamService.recordCheatingViolationOnChain(
          examSessionId,
          violationTypeMap[detection.type],
          severityMap[detection.severity],
          detection.confidence,
          detection.description,
          detection.screenshot || ''
        );
      } catch (error) {
        console.error('Failed to record violation on blockchain:', error);
      }
    }
  }, [examSessionId]);

  // Handle violation alert dismiss
  const handleViolationAlertDismiss = useCallback(() => {
    setShowViolationAlert(false);
    setCurrentViolation(null);
  }, []);

  // Handle exam stop due to violation
  const handleExamStop = useCallback(() => {
    setExamStopped(true);
    setShowViolationAlert(false);
    
    // Record exam termination on blockchain
    if (examSessionId && currentExam) {
      mockExamService.completeExamSessionOnChain(
        examSessionId,
        0, // Score 0 due to violation
        100,
        0,
        `${currentExam.title} - Dừng do vi phạm`
      ).catch(console.error);
    }
    
    // Navigate to result page or show stopped message
    setTimeout(() => {
      navigate('/exam/stopped');
    }, 2000);
  }, [examSessionId, currentExam, navigate]);

  // Handle camera metrics update
  const handleMetricsUpdate = useCallback((metrics: any) => {
    setCameraMetrics(metrics);
  }, []);

  // Enhanced submit exam with blockchain recording
  const handleSubmitExamWithBlockchain = useCallback(async () => {
    if (!examSessionId || !currentExam) return;

    try {
      // Calculate score and time spent
      const answeredCount = Object.values(answers).filter(answer => answer?.answer).length;
      const score = Math.round((answeredCount / totalQuestions) * 100); // Mock score based on answered questions
      const timeSpent = Math.floor((Date.now() - Date.now()) / 1000); // Mock time calculation

      // Record exam completion on blockchain
      await mockExamService.completeExamSessionOnChain(
        examSessionId,
        score,
        100, // maxScore
        timeSpent,
        currentExam.title
      );
    } catch (error) {
      console.error('Failed to complete exam on blockchain:', error);
    }

    // Call original submit handler
    handleSubmitExam();
  }, [examSessionId, currentExam, answers, totalQuestions, handleSubmitExam]);

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

        {/* Right Column - Sidebar with AI Camera Monitor */}
        <div className={styles.rightColumn}>
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
          
              {/* AI Camera Monitor - Hidden but functional */}
              {currentExam && (
                <div style={{ 
                  position: 'absolute', 
                  top: '-9999px', 
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden'
                }}>
                  <AICameraMonitor
                    examId={currentExam.id}
                    studentId="mock-student-id"
                    onViolationDetected={handleViolationDetected}
                    onMetricsUpdate={handleMetricsUpdate}
                    className={styles.aiCameraMonitor}
                  />
                </div>
              )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={showSubmitModal}
        answeredQuestions={answeredQuestions}
        totalQuestions={totalQuestions}
        isSubmitting={isSubmitting}
        onConfirm={handleSubmitExamWithBlockchain}
        onCancel={() => setShowSubmitModal(false)}
      />

      {/* Violation Alert */}
      <ExamViolationAlert
        violation={currentViolation}
        onDismiss={handleViolationAlertDismiss}
        onStopExam={handleExamStop}
        isVisible={showViolationAlert}
      />

      {/* Exam Stopped Overlay */}
      {examStopped && (
        <div className={styles.examStoppedOverlay}>
          <div className={styles.examStoppedContainer}>
            <div className={styles.stoppedIcon}>⚠️</div>
            <h2 className={styles.stoppedTitle}>Bài thi đã bị dừng</h2>
            <p className={styles.stoppedMessage}>
              Bài thi đã bị dừng do phát hiện hành vi gian lận.
              <br />
              Kết quả sẽ được ghi lại và báo cáo cho giảng viên.
            </p>
            <div className={styles.stoppedActions}>
              <button 
                onClick={() => navigate('/user/home')}
                className={styles.returnButton}
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
