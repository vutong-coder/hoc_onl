import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Filter, 
  Search, 
  Grid3x3, 
  List,
  Clock,
  Users,
  Star,
  ChevronRight,
  Award,
  TrendingUp,
  Play
} from 'lucide-react'
import courseApi, { Course } from '../services/api/courseApi'
import { useAppSelector } from '../store/hooks'
import '../assets/css/UserCoursesPage.css'

export default function UserCoursesPage(): JSX.Element {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Fetch courses from backend
  useEffect(() => {
    fetchCourses()
  }, [currentPage])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseApi.getAllCourses(currentPage, 12)
      setCourses(response.data.content)
      setTotalPages(response.data.totalPages)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching courses:', err)
      setError(err.message || 'Không thể tải danh sách khóa học')
    } finally {
      setLoading(false)
    }
  }

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    const matchesCategory = selectedCategory === 'all' || course.category?.name === selectedCategory
    return matchesSearch && matchesLevel && matchesCategory
  })

  const handleCourseClick = (courseId: string) => {
    navigate(`/user/courses/${courseId}`)
  }

  const handleEnrollCourse = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement enrollment logic
    console.log('Enroll course:', courseId)
    handleCourseClick(courseId)
  }

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'var(--success)'
      case 'intermediate': return 'var(--accent)'
      case 'advanced': return 'var(--destructive)'
      default: return 'var(--muted-foreground)'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Cơ bản'
      case 'intermediate': return 'Trung cấp'
      case 'advanced': return 'Nâng cao'
      default: return level
    }
  }

  return (
    <div className="user-courses-page">
      {/* Header */}
      <div className="courses-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <BookOpen size={32} />
            </div>
            <div>
              <h1>Khóa học</h1>
              <p>Khám phá và học tập các khóa học chất lượng</p>
            </div>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <BookOpen size={20} />
              <span>{courses.length} khóa học</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="courses-filters">
        <div className="filters-left">
          {/* Search */}
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="beginner">Cơ bản</option>
            <option value="intermediate">Trung cấp</option>
            <option value="advanced">Nâng cao</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả danh mục</option>
            {/* Will be populated dynamically */}
          </select>
        </div>

        <div className="filters-right">
          {/* View Mode Toggle */}
          <div className="view-mode-toggle">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
              title="Hiển thị dạng lưới"
            >
              <Grid3x3 size={20} />
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
              title="Hiển thị dạng danh sách"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="courses-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải khóa học...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchCourses} className="btn-retry">
              Thử lại
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={64} />
            <h3>Không tìm thấy khóa học</h3>
            <p>Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
          </div>
        ) : (
          <>
            <div className={`courses-grid ${viewMode}`}>
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="course-card"
                  onClick={() => handleCourseClick(course.id)}
                >
                  {/* Thumbnail */}
                  <div className="course-thumbnail">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} />
                    ) : (
                      <div className="thumbnail-placeholder">
                        <BookOpen size={48} />
                      </div>
                    )}
                    
                    {/* Level Badge */}
                    <div 
                      className="level-badge"
                      style={{ background: getLevelBadgeColor(course.level) }}
                    >
                      {getLevelText(course.level)}
                    </div>

                    {/* Featured Badge */}
                    {course.isFeatured && (
                      <div className="featured-badge">
                        <Star size={14} />
                        <span>Nổi bật</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="course-content">
                    {/* Category */}
                    {course.category && (
                      <div className="course-category">
                        {course.category.name}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="course-title">{course.title}</h3>

                    {/* Description */}
                    <p className="course-description">
                      {course.shortDescription || course.description}
                    </p>

                    {/* Instructor */}
                    {course.instructor && (
                      <div className="course-instructor">
                        <Users size={16} />
                        <span>{course.instructor.name}</span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="course-stats">
                      <div className="stat">
                        <Clock size={16} />
                        <span>{course.duration}h</span>
                      </div>
                      
                      {course.enrollmentCount !== undefined && (
                        <div className="stat">
                          <Users size={16} />
                          <span>{course.enrollmentCount} học viên</span>
                        </div>
                      )}

                      {course.rating !== undefined && (
                        <div className="stat rating">
                          <Star size={16} fill="currentColor" />
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="course-footer">
                      <div className="course-price">
                        {course.price === 0 ? (
                          <>
                            <span className="free">Miễn phí</span>
                          </>
                        ) : (
                          <>
                            <span className="price">{course.price}</span>
                            <span className="token">{course.tokenSymbol || 'LEARN'}</span>
                          </>
                        )}
                      </div>

                      <button
                        className="btn-enroll"
                        onClick={(e) => handleEnrollCourse(course.id, e)}
                      >
                        <Play size={18} />
                        <span>Học ngay</span>
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="btn-page"
                >
                  Trước
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`btn-page-number ${currentPage === i ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="btn-page"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

