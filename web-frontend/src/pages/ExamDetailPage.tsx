import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Button from '../components/atoms/Button';
import { RootState } from '../store';

export const ExamDetailPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { currentExam, questions, answers, startTime } = useSelector((state: RootState) => state.exam);

  // Calculate exam details from actual data
  const calculateExamDetails = () => {
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
        explanation: `Đây là giải thích cho câu ${question.id}. ${isCorrect ? 'Bạn đã trả lời đúng!' : 'Đáp án đúng giúp bạn hiểu rõ hơn về vấn đề này.'}`
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

  const getQuestionIcon = (isCorrect: boolean, type: string) => {
    if (type === 'essay') return <AlertCircle style={{ width: '24px', height: '24px', color: '#3b82f6' }} />;
    return isCorrect 
      ? <CheckCircle style={{ width: '24px', height: '24px', color: '#10b981' }} />
      : <XCircle style={{ width: '24px', height: '24px', color: '#ef4444' }} />;
  };

  const getQuestionBg = (isCorrect: boolean, type: string) => {
    if (type === 'essay') return 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
    return isCorrect 
      ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
      : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
  };

  const getQuestionBorder = (isCorrect: boolean, type: string) => {
    if (type === 'essay') return '#93c5fd';
    return isCorrect ? '#6ee7b7' : '#fca5a5';
  };

  if (!examDetails) {
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
          <p style={{ color: 'var(--muted-foreground)' }}>Không tìm thấy dữ liệu bài thi</p>
          <Button onClick={handleGoBack} variant="secondary" style={{ marginTop: '20px' }}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-background)',
      fontFamily: 'var(--font-sans)',
      paddingTop: 'var(--space-8)',
      paddingBottom: 'var(--space-12)'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 var(--space-6)'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-8)'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: 'var(--space-2)',
            color: 'var(--foreground)',
            fontFamily: 'var(--font-display)'
          }}>
            Chi tiết bài thi
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--muted-foreground)',
            fontWeight: 500
          }}>
            {examDetails.title}
          </p>
        </div>

        {/* Summary Card */}
        <div style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          gap: 'var(--space-4)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#10b981',
              fontFamily: 'var(--font-display)'
            }}>
              {examDetails.correctAnswers}/{examDetails.totalQuestions}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted-foreground)', fontWeight: 600 }}>
              Câu đúng
            </div>
          </div>

          <div style={{
            width: '1px',
            height: '40px',
            background: 'var(--border)'
          }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#3b82f6',
              fontFamily: 'var(--font-display)'
            }}>
              {examDetails.score}%
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted-foreground)', fontWeight: 600 }}>
              Điểm số
            </div>
          </div>

          <div style={{
            width: '1px',
            height: '40px',
            background: 'var(--border)'
          }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#f59e0b',
              fontFamily: 'var(--font-display)'
            }}>
              {examDetails.timeSpent}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted-foreground)', fontWeight: 600 }}>
              Phút
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-5)'
        }}>
          {examDetails.questions.map((question: any, index: number) => (
            <div 
              key={question.id}
              style={{
                background: 'var(--card)',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${getQuestionBorder(question.isCorrect, question.type)}`,
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden'
              }}
            >
              {/* Question Header */}
              <div style={{
                background: getQuestionBg(question.isCorrect, question.type),
                padding: 'var(--space-4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${getQuestionBorder(question.isCorrect, question.type)}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  {getQuestionIcon(question.isCorrect, question.type)}
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: question.type === 'essay' ? '#1e40af' : question.isCorrect ? '#065f46' : '#991b1b'
                    }}>
                      Câu {index + 1}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: question.type === 'essay' ? '#1e3a8a' : question.isCorrect ? '#047857' : '#7f1d1d',
                      fontWeight: 600
                    }}>
                      {question.type === 'essay' ? 'Tự luận' : question.isCorrect ? 'Đúng' : 'Sai'}
                    </div>
                  </div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: question.isCorrect ? '#10b981' : '#ef4444'
                }}>
                  {question.points} điểm
                </div>
              </div>

              {/* Question Content */}
              <div style={{ padding: 'var(--space-5)' }}>
                {/* Question Text */}
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: 'var(--space-4)',
                  color: 'var(--foreground)',
                  lineHeight: 1.6
                }}>
                  {question.question}
                </h4>

                {/* Multiple Choice */}
                {question.type === 'multiple-choice' && question.options && (
                  <>
                    {/* Show message if no answer */}
                    {(question.yourAnswer === undefined || question.yourAnswer === null) && (
                      <div style={{
                        background: '#fef3c7',
                        border: '1px solid #fbbf24',
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                      }}>
                        <AlertCircle style={{ width: '16px', height: '16px', color: '#92400e', flexShrink: 0 }} />
                        <span style={{ fontSize: '14px', color: '#92400e', fontWeight: 600 }}>
                          Bạn chưa chọn đáp án cho câu này
                        </span>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                      {question.options.map((option: string, optIndex: number) => {
                        const hasAnswer = question.yourAnswer !== undefined && question.yourAnswer !== null;
                        const isYourAnswer = hasAnswer && question.yourAnswer === optIndex;
                        const isCorrectAnswer = question.correctAnswer === optIndex;
                        
                        let bgColor = 'var(--background)';
                        let borderColor = 'var(--border)';
                        let textColor = 'var(--foreground)';
                        let showIcon = false;
                        let icon = null;
                        
                        // CHỈ highlight khi user ĐÃ CHỌN đáp án
                        if (hasAnswer) {
                          // Highlight đáp án đúng
                          if (isCorrectAnswer) {
                            bgColor = '#d1fae5';
                            borderColor = '#10b981';
                            textColor = '#065f46';
                            showIcon = true;
                            icon = <CheckCircle style={{ width: '18px', height: '18px', color: '#10b981', flexShrink: 0 }} />;
                          }
                          // Nếu user chọn sai, highlight đỏ đáp án sai của user
                          if (isYourAnswer && !isCorrectAnswer) {
                            bgColor = '#fee2e2';
                            borderColor = '#ef4444';
                            textColor = '#991b1b';
                            showIcon = true;
                            icon = <XCircle style={{ width: '18px', height: '18px', color: '#ef4444', flexShrink: 0 }} />;
                          }
                        }

                      return (
                        <div
                          key={optIndex}
                          style={{
                            padding: 'var(--space-3)',
                            background: bgColor,
                            border: `2px solid ${borderColor}`,
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)'
                          }}
                        >
                          {showIcon && icon}
                          <span style={{
                            fontSize: '14px',
                            color: textColor,
                            lineHeight: 1.6,
                            fontWeight: showIcon ? 600 : 400
                          }}>
                            {option}
                          </span>
                        </div>
                      );
                    })}
                    </div>
                  </>
                )}

                {/* Code Question */}
                {question.type === 'code' && question.yourAnswer && (
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={{
                      background: '#1e293b',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #334155'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        color: '#94a3b8',
                        marginBottom: 'var(--space-2)',
                        fontWeight: 600
                      }}>
                        Code của bạn:
                      </div>
                      <pre style={{
                        fontSize: '13px',
                        color: '#e2e8f0',
                        fontFamily: 'var(--font-mono)',
                        lineHeight: 1.6,
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word'
                      }}>
                        <code>{question.yourAnswer}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Essay Question */}
                {question.type === 'essay' && question.yourAnswer && (
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={{
                      background: 'var(--background)',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--muted-foreground)',
                        marginBottom: 'var(--space-2)',
                        fontWeight: 600
                      }}>
                        Câu trả lời của bạn:
                      </div>
                      <p style={{
                        fontSize: '14px',
                        color: 'var(--foreground)',
                        lineHeight: 1.8,
                        margin: 0
                      }}>
                        {question.yourAnswer}
                      </p>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {question.explanation && (
                  <div style={{
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #7dd3fc'
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0c4a6e',
                      marginBottom: 'var(--space-2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)'
                    }}>
                      💡 Giải thích:
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: '#075985',
                      lineHeight: 1.6,
                      margin: 0
                    }}>
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div style={{
          marginTop: 'var(--space-8)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button 
            onClick={handleGoBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: '12px 32px',
              background: 'var(--gradient-primary)',
              color: 'white'
            }}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
            Quay lại kết quả
          </Button>
        </div>
      </div>
    </div>
  );
};
