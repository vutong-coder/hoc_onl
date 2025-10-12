import React from 'react'
import CourseCard from '../atoms/CourseCard'

interface Course {
    id: string
    title: string
    progress: number
    totalLessons: number
    completedLessons: number
    duration: string
    nextLesson?: string
    certificate?: boolean
}

interface CourseProgressProps {
    courses?: Course[]
    onContinueCourse?: (courseId: string) => void
    onViewCourse?: (courseId: string) => void
}

export default function CourseProgress({ 
    courses = [
        {
            id: '1',
            title: 'Lập trình Python toàn diện',
            progress: 75,
            totalLessons: 20,
            completedLessons: 15,
            duration: '8 giờ',
            nextLesson: 'Lập trình hướng đối tượng',
            certificate: true
        },
        {
            id: '2',
            title: 'Khóa học Phát triển Web',
            progress: 45,
            totalLessons: 30,
            completedLessons: 13,
            duration: '12 giờ',
            nextLesson: 'Các thành phần React',
            certificate: false
        },
        {
            id: '3',
            title: 'Khoa học dữ liệu cơ bản',
            progress: 20,
            totalLessons: 25,
            completedLessons: 5,
            duration: '10 giờ',
            nextLesson: 'Cơ bản về Pandas',
            certificate: false
        },
        {
            id: '4',
            title: 'JavaScript nâng cao',
            progress: 90,
            totalLessons: 15,
            completedLessons: 14,
            duration: '6 giờ',
            nextLesson: 'JavaScript bất đồng bộ',
            certificate: true
        }
    ],
    onContinueCourse,
    onViewCourse
}: CourseProgressProps): JSX.Element {
    return (
        <div 
            className="card stagger-load hover-lift interactive" 
            style={{ 
                animationDelay: '400ms', 
                height: '490px', 
                padding: '16px',
                display: 'flex', 
                flexDirection: 'column' 
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
                    Tiến độ khóa học
                </h3>
                <button style={{ fontSize: '14px', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    Xem khóa học
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onContinueCourse={onContinueCourse}
                            onViewCourse={onViewCourse}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}