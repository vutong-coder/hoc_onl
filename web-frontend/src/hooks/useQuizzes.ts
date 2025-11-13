import { useState, useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import onlineExamApi, { type Quiz } from '../services/api/onlineExamApi';
import { examService } from '../services/examService';
import proctoringApi from '../services/api/proctoringApi';

const isBrowser = typeof window !== 'undefined';
const DEFAULT_PROCTORING_WS_URL =
  (isBrowser && (window as any)?.__PROCTORING_WS_URL) ??
  ((import.meta as any)?.env?.VITE_PROCTORING_WS_URL as string | undefined) ??
  'http://localhost:8082';

interface UpcomingExam {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'scheduled' | 'practice' | 'certification';
  status: 'upcoming' | 'registered' | 'ready';
  proctoring?: boolean;
  isStopped?: boolean; // Bài thi đã bị dừng bởi giám thị
}

export function useQuizzes() {
  const [quizzes, setQuizzes] = useState<UpcomingExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const socketsRef = useRef<Socket[]>([]);

  // ✅ FIX: Add guard to prevent duplicate fetch in React StrictMode
  useEffect(() => {
    if (hasFetched) return;
    
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await onlineExamApi.getAllQuizzes();
        
        // Fetch user submissions to determine quiz status
        const submissions = await examService.getMySubmissions();
        
        // Fetch proctoring sessions to check for terminated sessions
        let terminatedSessions: string[] = [];
        try {
          const allSessions = await proctoringApi.getAllSessions();
          const userIdStr = localStorage.getItem('userId') || localStorage.getItem('user_id');
          const userId = userIdStr ? Number(userIdStr) : null;
          
          if (userId) {
            terminatedSessions = allSessions
              .filter(session => 
                session.status === 'terminated' && 
                session.userId === userId
              )
              .map(session => String(session.examId));
            
            // Debug log
            if (terminatedSessions.length > 0) {
              console.log('[useQuizzes] Found terminated sessions:', terminatedSessions);
            }
          }
        } catch (err) {
          console.warn('Error fetching proctoring sessions:', err);
          // Continue without terminated sessions check
        }
        
        // Transform backend Quiz to frontend UpcomingExam format
        // Filter out completed quizzes (only show not-started and in-progress)
        const transformedQuizzes = data
          .map((quiz: Quiz): UpcomingExam | null => {
            const resolveDurationMinutes = (): number => {
              const extendedQuiz = quiz as Quiz & {
                duration?: number | string | null;
                durationMinutes?: number | string | null;
                timeLimit?: number | string | null;
                examDuration?: number | string | null;
              };

              const candidates: Array<number | string | null | undefined> = [
                quiz.timeLimitMinutes,
                extendedQuiz.durationMinutes,
                extendedQuiz.duration,
                extendedQuiz.timeLimit,
                extendedQuiz.examDuration
              ];

              const firstValid = candidates.find(
                (value) => value !== undefined && value !== null && value !== ''
              );

              if (firstValid === undefined) {
                return 60;
              }

              const parsed =
                typeof firstValid === 'string'
                  ? parseInt(firstValid, 10)
                  : Number(firstValid);

              if (!Number.isFinite(parsed) || parsed <= 0) {
                return 60;
              }

              return parsed;
            };

            const submission = submissions.find((s: any) => s.quizId === quiz.id);
            
            // CRITICAL: Skip completed quizzes (must have valid submittedAt timestamp)
            const hasValidSubmittedAt = submission?.submittedAt && 
              submission.submittedAt !== null && 
              submission.submittedAt !== '' &&
              submission.submittedAt !== 'null';
            
            if (hasValidSubmittedAt) {
              return null; // Filter out completed quizzes
            }
            
            // Determine status
            let status: 'upcoming' | 'registered' | 'ready' = 'ready';
            if (submission) {
              // Has submission but not submitted = in-progress
              status = 'registered'; // Use 'registered' to show different UI
            }
            
            // Check if this exam has a terminated session
            // Normalize both IDs to string for comparison
            const quizIdStr = String(quiz.id);
            const isStopped = terminatedSessions.includes(quizIdStr);
            
            // Debug log for stopped exams
            if (isStopped) {
              console.log('[useQuizzes] Exam stopped:', quizIdStr, quiz.title);
            }
            
            return {
              id: quiz.id,
              title: quiz.title,
              date: 'Hôm nay', // Default to today, can be enhanced with real scheduling data
              time: '2:00 chiều',
              duration: `${resolveDurationMinutes()} phút`,
              type: 'practice' as const, // Default type, can be determined from quiz metadata
              status,
              proctoring: false, // Default to no proctoring
              isStopped
            };
          })
          .filter((quiz): quiz is UpcomingExam => quiz !== null) as UpcomingExam[]; // Remove nulls

        setQuizzes(transformedQuizzes);
        setError(null);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Không thể tải danh sách bài thi');
        
        // Fallback to mock data on error
        setQuizzes([
          {
            id: 'javascript-advanced',
            title: 'JavaScript nâng cao',
            date: 'Hôm nay',
            time: '2:00 chiều',
            duration: '90 phút',
            type: 'certification',
            status: 'ready',
            proctoring: true
          },
          {
            id: 'react-fundamentals',
            title: 'Phát triển React cơ bản',
            date: 'Ngày mai',
            time: '10:00 sáng',
            duration: '60 phút',
            type: 'scheduled',
            status: 'registered',
            proctoring: true
          },
          {
            id: 'data-structures',
            title: 'Bài kiểm tra Cấu trúc dữ liệu',
            date: '15 tháng 12, 2024',
            time: '3:30 chiều',
            duration: '45 phút',
            type: 'practice',
            status: 'upcoming',
            proctoring: false
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
    setHasFetched(true);
  }, [hasFetched]);

  // Listen for proctoring_session_terminated events to update state in real-time
  // Create one socket connection per exam to listen for terminated events
  useEffect(() => {
    if (!isBrowser || !hasFetched || quizzes.length === 0) return;

    const userIdStr = localStorage.getItem('userId') || localStorage.getItem('user_id');
    const userId = userIdStr ? String(userIdStr) : null;

    if (!userId) {
      console.warn('[useQuizzes] No userId found, skipping socket connections');
      return;
    }

    // Create socket connections for each exam
    // Backend requires examId in query and automatically joins the room
    const sockets: Socket[] = [];

    quizzes.forEach(quiz => {
      const examIdStr = String(quiz.id);
      
      const socket = io(DEFAULT_PROCTORING_WS_URL, {
        query: {
          examId: examIdStr,
          userId,
          userType: 'student',
        },
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        console.log(`[useQuizzes] Socket connected for exam ${examIdStr}`);
      });

      socket.on('disconnect', () => {
        console.warn(`[useQuizzes] Socket disconnected for exam ${examIdStr}`);
      });

      // Listen for proctoring_session_terminated events
      socket.on('proctoring_session_terminated', (data: {
        sessionId?: string;
        examId?: string;
        userId?: string;
        reason?: string;
        terminatedBy?: string | null;
      }) => {
        console.log(`[useQuizzes] Received proctoring_session_terminated event for exam ${examIdStr}:`, data);

        // Check if this event is for the current user
        if (data.userId && String(data.userId) !== userId) {
          console.log('[useQuizzes] Event is for different user, ignoring');
          return;
        }

        // If examId is provided, update that specific exam
        if (data.examId) {
          const receivedExamIdStr = String(data.examId);
          console.log('[useQuizzes] Marking exam as stopped:', receivedExamIdStr);

          setQuizzes(prevQuizzes => 
            prevQuizzes.map(q => {
              if (String(q.id) === receivedExamIdStr) {
                console.log('[useQuizzes] ✅ Updated exam to stopped:', q.title);
                return {
                  ...q,
                  isStopped: true
                };
              }
              return q;
            })
          );
        } else {
          console.warn('[useQuizzes] Received terminated event without examId');
        }
      });

      sockets.push(socket);
    });

    // Store all sockets in ref for cleanup
    socketsRef.current = sockets;

    return () => {
      sockets.forEach(socket => {
        socket.disconnect();
      });
      socketsRef.current = [];
    };
  }, [hasFetched, quizzes]);

  return { quizzes, loading, error };
}

