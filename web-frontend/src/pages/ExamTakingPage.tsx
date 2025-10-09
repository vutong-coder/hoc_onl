import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Clock, Flag, ChevronLeft, ChevronRight, CheckCircle, XCircle, AlertCircle, Camera, Minimize2, Maximize2 } from 'lucide-react';
import { ProctoringView } from '../components/molecules/ProctoringView';
import { ExamQuestion } from '../components/molecules/ExamQuestion';
import Button from '../components/atoms/Button';
import { 
  fetchExamDetails, 
  startExamSession,
  setCurrentQuestion,
  updateAnswer,
  goToNextQuestion,
  goToPreviousQuestion,
  toggleQuestionFlag,
  tickTimer,
  submitExam,
  setCameraReady,
  setCameraError,
  setStatus
} from '../store/slices/examSlice';
import { examService } from '../services/examService';
import { RootState, AppDispatch } from '../store';

export const ExamTakingPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const [isProctoringMinimized, setIsProctoringMinimized] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    currentExam, 
    questions,
    currentQuestionIndex,
    answers,
    timeRemaining,
    status,
    error,
    visitedQuestions,
    flaggedQuestions,
    session
  } = useSelector((state: RootState) => state.exam);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;

  // Initialize exam
  useEffect(() => {
    if (examId && status === 'idle') {
      dispatch(fetchExamDetails(examId));
    }
  }, [examId, status, dispatch]);

  // Start timer when exam is active
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (status === 'active' && timeRemaining > 0) {
      timer = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, timeRemaining, dispatch]);

  // Start exam session when exam details are loaded
  useEffect(() => {
    if (status === 'idle' && currentExam && !session) {
      dispatch(startExamSession(currentExam.id));
    }
  }, [status, currentExam, session, dispatch]);

  // Update status to active when session starts
  useEffect(() => {
    if (status === 'pre-check' && session) {
      dispatch(setStatus('active'));
    }
  }, [status, session, dispatch]);

  // Auto-save answers periodically
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (session && currentQuestion && answers[currentQuestion.id]) {
        examService.saveAnswer(session.id, currentQuestion.id, answers[currentQuestion.id].answer);
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [session, currentQuestion, answers]);

  const handleAnswerChange = useCallback((answer: any) => {
    if (currentQuestion) {
      dispatch(updateAnswer({ 
        questionId: currentQuestion.id, 
        answer 
      }));
    }
  }, [currentQuestion, dispatch]);

  const handleFlagQuestion = useCallback(() => {
    if (currentQuestion) {
      dispatch(toggleQuestionFlag(currentQuestion.id));
    }
  }, [currentQuestion, dispatch]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      dispatch(goToNextQuestion());
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      dispatch(goToPreviousQuestion());
    }
  };

  const handleGoToQuestion = (questionIndex: number) => {
    dispatch(setCurrentQuestion(questionIndex));
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(submitExam());
      navigate(`/exam/${examId}/result`);
    } catch (error) {
      console.error('Error submitting exam:', error);
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  const handleTimeUp = () => {
    setShowSubmitModal(true);
  };

  const handleCameraReady = () => {
    dispatch(setCameraReady(true));
  };

  const handleCameraError = (error: string) => {
    dispatch(setCameraError(error));
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  const timeWarning = timeRemaining < 300; // Less than 5 minutes

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'var(--card)',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid var(--muted)',
            borderTop: '3px solid var(--primary)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }} />
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Đang tải bài thi...
          </h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'var(--card)',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          maxWidth: '400px',
          border: '1px solid var(--destructive)'
        }}>
          <AlertCircle style={{ width: '64px', height: '64px', color: 'var(--destructive)', margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Lỗi</h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '24px' }}>{error}</p>
          <Button onClick={() => navigate('/user/home')} variant="secondary">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  if (!currentExam || !currentQuestion) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Header - Fixed */}
      <div style={{
        background: 'var(--card)',
        borderBottom: '2px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: 'var(--space-4) var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--foreground)',
              margin: 0
            }}>
              {currentExam.title}
            </h1>
            <div style={{
              background: 'var(--accent)',
              color: 'var(--accent-foreground)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 600
            }}>
              Câu {currentQuestionIndex + 1}/{totalQuestions}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                Đã trả lời: <strong style={{ color: 'var(--foreground)' }}>{answeredQuestions}/{totalQuestions}</strong>
              </div>
              <div style={{
                width: '120px',
                height: '8px',
                background: 'var(--muted)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'var(--gradient-accent)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: timeWarning ? '#fee2e2' : 'var(--background)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${timeWarning ? '#f87171' : 'var(--border)'}`,
              boxShadow: timeWarning ? '0 0 20px rgba(239, 68, 68, 0.3)' : 'none'
            }}>
              <Clock style={{ 
                width: '20px', 
                height: '20px', 
                color: timeWarning ? '#dc2626' : 'var(--primary)' 
              }} />
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: timeWarning ? '#dc2626' : 'var(--foreground)'
              }}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'var(--space-6)',
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: 'var(--space-6)',
        alignItems: 'start'
      }}>
        {/* Left Column - Question */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--space-6)'
          }}>
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

          {/* Navigation Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 'var(--space-4)'
          }}>
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <ChevronLeft style={{ width: '18px', height: '18px' }} />
              Câu trước
            </Button>

            <Button
              onClick={() => setShowSubmitModal(true)}
              style={{
                background: 'var(--gradient-primary)',
                color: 'white'
              }}
            >
              Nộp bài
            </Button>

            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              Câu tiếp
              <ChevronRight style={{ width: '18px', height: '18px' }} />
            </Button>
          </div>
        </div>

        {/* Right Column - Timer, Questions Navigator & Camera */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'sticky', top: '90px' }}>
          {/* Question Navigator */}
          <div style={{
            background: 'var(--card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
            padding: 'var(--space-5)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: 'var(--space-4)',
              color: 'var(--foreground)'
            }}>
              Danh sách câu hỏi
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 'var(--space-2)'
            }}>
              {questions.map((question, index) => {
                const isAnswered = answers[question.id];
                const isVisited = visitedQuestions.includes(index);
                const isFlagged = flaggedQuestions.includes(question.id);
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={question.id}
                    onClick={() => handleGoToQuestion(index)}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      border: `2px solid ${
                        isCurrent ? 'var(--primary)' : 
                        isFlagged ? '#f59e0b' : 
                        isAnswered ? '#10b981' : 
                        'var(--border)'
                      }`,
                      borderRadius: 'var(--radius-md)',
                      background: isCurrent 
                        ? 'var(--gradient-primary)' 
                        : isAnswered 
                        ? '#d1fae5' 
                        : isFlagged
                        ? '#fef3c7'
                        : 'var(--background)',
                      color: isCurrent 
                        ? 'white' 
                        : isAnswered
                        ? '#065f46'
                        : isFlagged
                        ? '#92400e'
                        : 'var(--foreground)',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {index + 1}
                    {isFlagged && (
                      <Flag style={{
                        width: '12px',
                        height: '12px',
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        fill: '#f59e0b'
                      }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{
              marginTop: 'var(--space-4)',
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-2)',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  background: '#d1fae5',
                  border: '2px solid #10b981',
                  borderRadius: '4px'
                }} />
                <span style={{ color: 'var(--muted-foreground)' }}>Đã trả lời</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  background: 'var(--background)',
                  border: '2px solid var(--border)',
                  borderRadius: '4px'
                }} />
                <span style={{ color: 'var(--muted-foreground)' }}>Chưa xem</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  background: '#fef3c7',
                  border: '2px solid #f59e0b',
                  borderRadius: '4px'
                }} />
                <span style={{ color: 'var(--muted-foreground)' }}>Chưa xem</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  background: 'var(--gradient-primary)',
                  border: '2px solid var(--primary)',
                  borderRadius: '4px'
                }} />
                <span style={{ color: 'var(--muted-foreground)' }}>Đã đánh dấu</span>
              </div>
            </div>
          </div>

          {/* Camera Monitoring - Always rendered */}
          {!isProctoringMinimized ? (
            <div style={{
              background: 'var(--card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-4)',
                borderBottom: '1px solid var(--border)'
              }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  margin: 0
                }}>
                  <Camera style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                  Camera giám sát
                </h3>
                <button
                  onClick={() => setIsProctoringMinimized(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted-foreground)',
                    padding: '4px',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}
                  title="Thu nhỏ camera"
                >
                  <Minimize2 style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

              <div style={{ 
                padding: 'var(--space-4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ProctoringView
                  width={352}
                  height={264}
                  onStreamReady={handleCameraReady}
                  onError={handleCameraError}
                  showControls={false}
                />
              </div>
            </div>
          ) : (
            <ProctoringView
              width={352}
              height={264}
              onStreamReady={handleCameraReady}
              onError={handleCameraError}
              showControls={false}
              isMinimized={true}
              onToggleMinimize={() => setIsProctoringMinimized(false)}
            />
          )}
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-2xl)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <AlertCircle style={{ 
                width: '64px', 
                height: '64px', 
                color: '#f59e0b',
                margin: '0 auto var(--space-4)'
              }} />
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                marginBottom: 'var(--space-3)',
                color: 'var(--foreground)'
              }}>
                Xác nhận nộp bài
              </h2>
              <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                Bạn đã trả lời <strong>{answeredQuestions}/{totalQuestions}</strong> câu hỏi.
                {answeredQuestions < totalQuestions && (
                  <span style={{ display: 'block', color: '#dc2626', marginTop: 'var(--space-2)' }}>
                    Còn {totalQuestions - answeredQuestions} câu chưa trả lời!
                  </span>
                )}
              </p>
              <p style={{ color: 'var(--muted-foreground)', marginTop: 'var(--space-3)' }}>
                Bạn có chắc chắn muốn nộp bài không?
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: 'var(--space-4)',
              justifyContent: 'center'
            }}>
              <Button
                onClick={() => setShowSubmitModal(false)}
                variant="secondary"
                disabled={isSubmitting}
              >
                Tiếp tục làm bài
              </Button>
              <Button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'white'
                }}
              >
                {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài ngay'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
