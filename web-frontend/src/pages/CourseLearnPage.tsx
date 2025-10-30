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
  BookOpen
} from 'lucide-react'
import courseApi, { Course, Material, Progress, Quiz } from '../services/api/courseApi'
import { useAppSelector } from '../store/hooks'
import '../assets/css/CourseLearnPage.css'

export default function CourseLearnPage(): JSX.Element {
  const { courseId } = useParams<{ courseId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  
  const [course, setCourse] = useState<Course | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [completingMaterial, setCompletingMaterial] = useState(false)

  useEffect(() => {
    if (courseId) {
      fetchCourseData()
    }
  }, [courseId])

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
  }, [searchParams, materials])

  const fetchCourseData = async () => {
    if (!courseId) return
    
    try {
      setLoading(true)
      console.log('Fetching course data for:', courseId)
      
      // Fetch course details
      const courseResponse = await courseApi.getCourseById(courseId)
      console.log('Course data:', courseResponse.data)
      setCourse(courseResponse.data)

      // Fetch materials
      try {
        const materialsResponse = await courseApi.getCourseMaterials(courseId)
        const sortedMaterials = materialsResponse.data.sort((a, b) => a.order - b.order)
        console.log('Materials:', sortedMaterials)
        setMaterials(sortedMaterials)
      } catch (err) {
        console.log('No materials found, setting empty array')
        setMaterials([])
      }

      // Fetch progress
      if (user?.id) {
        try {
          const progressResponse = await courseApi.getStudentProgress(Number(user.id), courseId)
          setProgress(progressResponse.data)
        } catch (err) {
          console.log('No progress found')
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
        setQuiz(quizResponse.data)
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
    
    setCompletingMaterial(true)
    try {
      const response = await courseApi.updateProgress(
        Number(user.id),
        courseId,
        currentMaterial.id
      )
      setProgress(response.data)
      
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
    return progress?.completedMaterials?.includes(materialId) || false
  }

  const getCurrentMaterialIndex = () => {
    if (!currentMaterial) return 0
    return materials.findIndex(m => m.id === currentMaterial.id) + 1
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '24px',
        background: 'var(--background)'
      }}>
        <div className="spinner"></div>
        <p style={{ fontSize: '16px', color: 'var(--muted-foreground)' }}>
          Đang tải bài học...
        </p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '24px',
        background: 'var(--background)'
      }}>
        <p style={{ fontSize: '18px', color: 'var(--destructive)' }}>
          {error || 'Không tìm thấy khóa học'}
        </p>
        <button 
          onClick={() => navigate(`/user/courses/${courseId}`)} 
          style={{
            padding: '12px 24px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Quay lại khóa học
        </button>
      </div>
    )
  }

  // If no materials, show empty state
  if (materials.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '24px',
        padding: '40px',
        background: 'var(--background)'
      }}>
        <BookOpen size={64} style={{ color: 'var(--muted-foreground)' }} />
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>
          Khóa học chưa có tài liệu
        </h2>
        <p style={{ margin: 0, color: 'var(--muted-foreground)', textAlign: 'center' }}>
          Khóa học "{course.title}" hiện chưa có tài liệu học tập nào.
        </p>
        <button 
          onClick={() => navigate(`/user/courses/${courseId}`)} 
          style={{
            padding: '12px 24px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Quay lại khóa học
        </button>
      </div>
    )
  }

  // If no currentMaterial after materials loaded, show error
  if (!currentMaterial) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '24px',
        background: 'var(--background)'
      }}>
        <p style={{ fontSize: '18px', color: 'var(--destructive)' }}>
          Không thể tải tài liệu
        </p>
        <button 
          onClick={() => navigate(`/user/courses/${courseId}`)} 
          style={{
            padding: '12px 24px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Quay lại khóa học
        </button>
      </div>
    )
  }

  return (
    <div className="course-learn-page">
      {/* Header */}
      <div className="learn-header">
        <button onClick={() => navigate(`/user/courses/${courseId}`)} className="btn-back-nav">
          <ArrowLeft size={20} />
        </button>

        <div className="header-info">
          <h1>{course.title}</h1>
          <p className="material-position">
            Bài {getCurrentMaterialIndex()} / {materials.length}
          </p>
        </div>

        {progress && (
          <div className="header-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress.progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">{progress.progressPercentage}%</span>
          </div>
        )}

        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="btn-toggle-sidebar"
          title={sidebarOpen ? 'Ẩn nội dung' : 'Hiện nội dung'}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

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
            <p>{materials.filter(m => isMaterialCompleted(m.id)).length} / {materials.length} hoàn thành</p>
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

