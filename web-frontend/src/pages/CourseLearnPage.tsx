import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock,
  FileText,
  Video,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Award,
  AlertCircle
} from 'lucide-react'
import courseApi, { Course, Material, Progress, Quiz } from '../services/api/courseApi'
import { awardCourseCompletion } from '../services/api/tokenApi'
import { useAppSelector } from '../store/hooks'
import '../assets/css/CourseLearnPage.css'

type ProgressState = Progress & {
  progressPercentage?: number;
  completedMaterials?: string[];
  lastAccessedAt?: string;
};

const COURSE_COMPLETION_REWARD = Number(import.meta.env.VITE_COURSE_COMPLETION_REWARD ?? 100);

export default function CourseLearnPage(): JSX.Element {
  const { courseId } = useParams<{ courseId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  
  const [course, setCourse] = useState<Course | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [progress, setProgress] = useState<ProgressState | null>(null)
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [completingMaterial, setCompletingMaterial] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)
  const [hasAwardedCompletion, setHasAwardedCompletion] = useState(false)
  const [isAwardingTokens, setIsAwardingTokens] = useState(false)
  const [awardMessage, setAwardMessage] = useState<string | null>(null)
  const [awardError, setAwardError] = useState<string | null>(null)

  const getPercentComplete = (value?: ProgressState | null): number => {
    if (!value) {
      return 0
    }
    const rawPercent =
      value.percentComplete ??
      value.progressPercentage ??
      (value as any).progress ??
      0
    const numericPercent = Number(rawPercent)
    return Number.isFinite(numericPercent) ? numericPercent : 0
  }

  const normalizeProgress = (data: any): ProgressState | null => {
    if (!data) {
      return null
    }
    const percent = Number(
      data?.percentComplete ?? data?.progressPercentage ?? data?.progress ?? 0
    )
    const normalizedPercent = Number.isFinite(percent) ? percent : 0
    const completedMaterials = Array.isArray(data?.completedMaterials)
      ? data.completedMaterials
      : []

    return {
      ...data,
      percentComplete: normalizedPercent,
      progressPercentage: normalizedPercent,
      completedMaterials,
    } as ProgressState
  }

  const handleCourseCompletionReward = async (): Promise<void> => {
    if (!user?.id || !courseId) {
      return
    }

    setIsAwardingTokens(true)
    setAwardMessage(null)
    setAwardError(null)

    try {
      const transaction = await awardCourseCompletion({
        userId: user.id,
        courseId,
        amount: COURSE_COMPLETION_REWARD,
      })

      setHasAwardedCompletion(true)
      const awardedAmountRaw =
        transaction?.amount ??
        transaction?.tokensAwarded ??
        COURSE_COMPLETION_REWARD
      const awardedAmount = Number.isFinite(Number(awardedAmountRaw))
        ? Number(awardedAmountRaw)
        : COURSE_COMPLETION_REWARD
      setAwardMessage(
        `Bạn đã nhận ${awardedAmount} LEARN khi hoàn thành khóa học${course?.title ? ` "${course.title}"` : ''
        }.`
      )
    } catch (rewardErr: unknown) {
      const message =
        rewardErr instanceof Error
          ? rewardErr.message
          : (rewardErr as { message?: string })?.message || 'Không thể cộng token phần thưởng.'
      setAwardError(message)
    } finally {
      setIsAwardingTokens(false)
    }
  }

  const handleRetryAward = () => {
    if (isAwardingTokens) {
      return
    }
    void handleCourseCompletionReward()
  }

  const percentComplete = getPercentComplete(progress)
  const completedMaterialsCount = progress?.completedMaterials?.length ?? 0

  const rewardBanner = (() => {
    if (isAwardingTokens) {
      return (
        <div className="reward-banner loading">
          <Award />
          <span>Đang cộng token phần thưởng cho bạn...</span>
        </div>
      )
    }

    if (awardMessage) {
      return (
        <div className="reward-banner success">
          <Award />
          <span>{awardMessage}</span>
        </div>
      )
    }

    if (awardError) {
      return (
        <div className="reward-banner error">
          <AlertCircle />
          <span>{awardError}</span>
          <button
            type="button"
            onClick={handleRetryAward}
            disabled={isAwardingTokens}
            className="retry-button"
          >
            Thử lại
          </button>
        </div>
      )
    }

    return null
  })()

  // ✅ FIX: Add guard to prevent duplicate fetch
  useEffect(() => {
    if (courseId && !hasFetched) {
      fetchCourseData()
      setHasFetched(true)
    }
  }, [courseId, hasFetched])

  // ✅ FIX: Separate effect for material selection (doesn't re-fetch course data)
  useEffect(() => {
    const materialId = searchParams.get('material')
    if (materialId && materials.length > 0) {
      const material = materials.find(m => m.id === materialId)
      if (material) {
        setCurrentMaterial(material)
        loadMaterialContent(material)
      }
    } else if (materials.length > 0 && !currentMaterial) {
      // Load first material by default
      setCurrentMaterial(materials[0])
      loadMaterialContent(materials[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, materials.length])

  const fetchCourseData = async () => {
    if (!courseId) return
    
    try {
      setLoading(true)
      
      // Fetch course details
      const courseResponse = await courseApi.getCourseById(courseId)
      setCourse(courseResponse.data ?? null)

      // Fetch materials
      const materialsResponse = await courseApi.getCourseMaterials(courseId)
      const sortedMaterials = (materialsResponse.data ?? []).sort((a, b) => {
        const orderA = a.order ?? a.displayOrder ?? 0
        const orderB = b.order ?? b.displayOrder ?? 0
        return orderA - orderB
      })
      setMaterials(sortedMaterials)

      // Fetch progress
      if (user?.id) {
        try {
          const progressResponse = await courseApi.getStudentProgress(Number(user.id), courseId)
          const normalizedProgress = normalizeProgress(progressResponse.data)
          setProgress(normalizedProgress)
          setHasAwardedCompletion(getPercentComplete(normalizedProgress) >= 100)
        } catch (err) {
          // Backend có thể trả 404/500 khi chưa có progress
          const fallbackProgress = normalizeProgress({
            id: 0,
            studentId: Number(user.id),
            courseId,
            completedMaterials: [],
            percentComplete: 0,
            progressPercentage: 0,
            lastAccessedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as ProgressState)
          setProgress(fallbackProgress)
          setHasAwardedCompletion(false)
        }
      }

      setError(null)
    } catch (err: any) {
      console.error('Error fetching course data:', err)
      setError(err.message || 'Không thể tải thông tin khóa học')
    } finally {
      setLoading(false)
    }
  }

  const loadMaterialContent = async (material: Material) => {
    if (material.type === 'quiz') {
      // Load quiz content
      try {
        const quizResponse = await courseApi.getQuizDetails(material.id)
        setQuiz(quizResponse.data ?? null)
      } catch (err) {
        console.error('Error loading quiz:', err)
      }
    } else {
      setQuiz(null)
    }
  }

  const handleMaterialSelect = (material: Material) => {
    setCurrentMaterial(material)
    setSearchParams({ material: material.id })
    loadMaterialContent(material)
  }

  const handleMarkComplete = async () => {
    if (!currentMaterial || !user?.id || !courseId) return
    
    const previousPercent = getPercentComplete(progress)
    setCompletingMaterial(true)
    try {
      const response = await courseApi.updateProgress(
        Number(user.id),
        courseId,
        currentMaterial.id
      )
      const normalizedProgress = normalizeProgress(response.data)
      setProgress(normalizedProgress)

      const newPercent = getPercentComplete(normalizedProgress)
      if (!hasAwardedCompletion && previousPercent < 100 && newPercent >= 100) {
        await handleCourseCompletionReward()
      }
      
      // Move to next material
      const currentIndex = materials.findIndex(m => m.id === currentMaterial.id)
      if (currentIndex < materials.length - 1) {
        handleMaterialSelect(materials[currentIndex + 1])
      }
    } catch (err) {
      console.error('Error marking material complete:', err)
      alert('Không thể cập nhật tiến độ')
    } finally {
      setCompletingMaterial(false)
    }
  }

  const handlePrevious = () => {
    if (!currentMaterial) return
    const currentIndex = materials.findIndex(m => m.id === currentMaterial.id)
    if (currentIndex > 0) {
      handleMaterialSelect(materials[currentIndex - 1])
    }
  }

  const handleNext = () => {
    if (!currentMaterial) return
    const currentIndex = materials.findIndex(m => m.id === currentMaterial.id)
    if (currentIndex < materials.length - 1) {
      handleMaterialSelect(materials[currentIndex + 1])
    }
  }

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={20} />
      case 'quiz': return <FileQuestion size={20} />
      case 'document': return <FileText size={20} />
      default: return <FileText size={20} />
    }
  }

  const isMaterialCompleted = (materialId: string) => {
    const completed = progress?.completedMaterials || []
    return Array.isArray(completed) ? completed.includes(materialId) : false
  }

  const getCurrentMaterialIndex = () => {
    if (!currentMaterial) return 0
    return materials.findIndex(m => m.id === currentMaterial.id) + 1
  }

  if (loading) {
    return (
      <div className="course-learn-loading">
        <div className="spinner"></div>
        <p>Đang tải bài học...</p>
      </div>
    )
  }

  if (error || !course || !currentMaterial) {
    return (
      <div className="course-learn-error">
        <p>{error || 'Không tìm thấy bài học'}</p>
        <button onClick={() => navigate(`/user/courses/${courseId}`)} className="btn-back">
          Quay lại khóa học
        </button>
      </div>
    )
  }

  return (
    <div className="course-learn-page">
      {/* Header */}
      <div className="learn-header">
        <div className="header-info">
          <h1>{course.title}</h1>
          <p className="material-position">
            Bài {getCurrentMaterialIndex()} / {materials.length}
          </p>
        </div>

          <div className="header-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
              style={{ width: `${percentComplete}%` }}
              ></div>
          </div>
          <span className="progress-text">{percentComplete}%</span>
        </div>

        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="btn-toggle-sidebar"
          title={sidebarOpen ? 'Ẩn nội dung' : 'Hiện nội dung'}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {rewardBanner}

      {/* Content Area */}
      <div className="learn-content">
        {/* Main Content */}
        <div className="main-content">
          {/* Material Content */}
          <div className="material-content">
            {/* Video */}
            {currentMaterial.type === 'video' && currentMaterial.videoUrl && (
              <div className="video-container">
                <video 
                  controls 
                  autoPlay
                  key={currentMaterial.id}
                  style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
                >
                  <source src={currentMaterial.videoUrl} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
              </div>
            )}

            {/* Document/Text Content */}
            {(currentMaterial.type === 'document' || currentMaterial.type === 'text') && (
              <div className="document-content">
                <div className="document-header">
                  <FileText size={32} />
                  <h2>{currentMaterial.title}</h2>
                </div>
                {currentMaterial.description && (
                  <div className="document-body">
                    <p>{currentMaterial.description}</p>
                  </div>
                )}
                {currentMaterial.contentUrl && (
                  <div className="document-actions">
                    <a 
                      href={currentMaterial.contentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-download"
                    >
                      <FileText size={20} />
                      Tải tài liệu
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Quiz */}
            {currentMaterial.type === 'quiz' && quiz && (
              <div className="quiz-content">
                <div className="quiz-header">
                  <FileQuestion size={32} />
                  <div>
                    <h2>{quiz.title}</h2>
                    {quiz.description && <p>{quiz.description}</p>}
                  </div>
                </div>

                <div className="quiz-info">
                  {quiz.timeLimit && (
                    <div className="quiz-info-item">
                      <Clock size={20} />
                      <span>Thời gian: {quiz.timeLimit} phút</span>
                    </div>
                  )}
                  <div className="quiz-info-item">
                    <FileQuestion size={20} />
                    <span>{quiz.questions.length} câu hỏi</span>
                  </div>
                  <div className="quiz-info-item">
                    <Award size={20} />
                    <span>Điểm đạt: {quiz.passingScore}%</span>
                  </div>
                </div>

                <button className="btn-start-quiz">
                  Bắt đầu làm bài
                </button>

                <p className="quiz-note">
                  💡 Lưu ý: Bạn cần đạt ít nhất {quiz.passingScore}% để hoàn thành bài quiz này.
                </p>
              </div>
            )}
          </div>

          {/* Material Info & Description */}
          <div className="material-info-section">
            <div className="material-header">
              <div className="material-icon-large">
                {getMaterialIcon(currentMaterial.type)}
              </div>
              <div>
                <h3>{currentMaterial.title}</h3>
                {currentMaterial.duration && (
                  <p className="material-duration">
                    <Clock size={16} />
                    {currentMaterial.duration} phút
                  </p>
                )}
              </div>
            </div>

            {currentMaterial.description && currentMaterial.type !== 'quiz' && (
              <div className="material-description">
                <h4>Mô tả</h4>
                <p>{currentMaterial.description}</p>
              </div>
            )}

            {/* Mark Complete Button */}
            {!isMaterialCompleted(currentMaterial.id) && (
              <button 
                onClick={handleMarkComplete}
                disabled={completingMaterial}
                className="btn-complete"
              >
                <CheckCircle size={20} />
                {completingMaterial ? 'Đang lưu...' : 'Đánh dấu hoàn thành'}
              </button>
            )}

            {isMaterialCompleted(currentMaterial.id) && (
              <div className="completed-badge">
                <CheckCircle size={20} />
                <span>Đã hoàn thành</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="material-navigation">
            <button
              onClick={handlePrevious}
              disabled={getCurrentMaterialIndex() === 1}
              className="btn-nav"
            >
              <ChevronLeft size={20} />
              <span>Bài trước</span>
            </button>
            <button
              onClick={handleNext}
              disabled={getCurrentMaterialIndex() === materials.length}
              className="btn-nav"
            >
              <span>Bài tiếp theo</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`materials-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h3>Nội dung khóa học</h3>
            <p>{completedMaterialsCount} / {materials.length} hoàn thành</p>
          </div>

          <div className="materials-list">
            {materials.map((material, index) => (
              <div
                key={material.id}
                className={`material-item ${material.id === currentMaterial?.id ? 'active' : ''} ${isMaterialCompleted(material.id) ? 'completed' : ''}`}
                onClick={() => handleMaterialSelect(material)}
              >
                <div className="material-number">{index + 1}</div>
                <div className="material-icon">
                  {getMaterialIcon(material.type)}
                </div>
                <div className="material-details">
                  <h4>{material.title}</h4>
                  {material.duration && (
                    <span className="duration">
                      <Clock size={14} />
                      {material.duration} phút
                    </span>
                  )}
                </div>
                {isMaterialCompleted(material.id) && (
                  <CheckCircle size={20} className="completed-icon" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

