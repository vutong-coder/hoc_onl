import React from 'react'
import { CourseFilters, CourseCategory, Instructor } from '../../types/course'
import SearchBar from '../common/SearchBar'
import Dropdown from '../common/Dropdown'
import { Filter, SortAsc, SortDesc } from 'lucide-react'

interface CourseFilterBarProps {
	filters: CourseFilters
	onFilterChange: (key: keyof CourseFilters, value: any) => void
	categories: CourseCategory[]
	instructors: Instructor[]
	onClearFilters: () => void
}

export default function CourseFilterBar({ 
	filters, 
	onFilterChange, 
	categories, 
	instructors,
	onClearFilters 
}: CourseFilterBarProps): JSX.Element {
	
	const categoryOptions = [
		{ value: 'all', label: 'Tất cả danh mục' },
		...categories.map(cat => ({
			value: cat.id,
			label: `${cat.icon} ${cat.name}`
		}))
	]

	const levelOptions = [
		{ value: 'all', label: 'Tất cả cấp độ' },
		{ value: 'beginner', label: 'Cơ bản' },
		{ value: 'intermediate', label: 'Trung bình' },
		{ value: 'advanced', label: 'Nâng cao' },
		{ value: 'expert', label: 'Chuyên gia' }
	]

	const statusOptions = [
		{ value: 'all', label: 'Tất cả trạng thái' },
		{ value: 'published', label: 'Đã xuất bản' },
		{ value: 'draft', label: 'Bản nháp' },
		{ value: 'archived', label: 'Đã lưu trữ' },
		{ value: 'suspended', label: 'Tạm dừng' }
	]

	const instructorOptions = [
		{ value: 'all', label: 'Tất cả giảng viên' },
		...instructors.map(inst => ({
			value: inst.id,
			label: inst.name
		}))
	]

	const priceRangeOptions = [
		{ value: 'all', label: 'Tất cả giá' },
		{ value: 'free', label: 'Miễn phí' },
		{ value: 'paid', label: 'Có phí' }
	]

	const publishedOptions = [
		{ value: 'all', label: 'Tất cả' },
		{ value: 'true', label: 'Đã xuất bản' },
		{ value: 'false', label: 'Chưa xuất bản' }
	]

	const featuredOptions = [
		{ value: 'all', label: 'Tất cả' },
		{ value: 'true', label: 'Nổi bật' },
		{ value: 'false', label: 'Không nổi bật' }
	]

	const sortByOptions = [
		{ value: 'title', label: 'Tên khóa học' },
		{ value: 'createdAt', label: 'Ngày tạo' },
		{ value: 'updatedAt', label: 'Ngày cập nhật' },
		{ value: 'enrollmentCount', label: 'Số học viên' },
		{ value: 'rating', label: 'Đánh giá' },
		{ value: 'price', label: 'Giá' }
	]

	const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
		if (key === 'search') return value !== ''
		if (key === 'sortBy') return value !== 'title'
		if (key === 'sortOrder') return value !== 'asc'
		return value !== 'all'
	})

	return (
		<div className="course-filter-bar">
			{/* Search */}
			<div className="filter-section">
				<SearchBar
					value={filters.search}
					onChange={(value) => onFilterChange('search', value)}
					placeholder="Tìm kiếm khóa học, giảng viên..."
				/>
			</div>

			{/* Filters */}
			<div className="filter-section">
				<div className="filter-group">
					<label className="filter-label">Danh mục</label>
					<Dropdown
						options={categoryOptions}
						value={filters.category}
						onChange={(value) => onFilterChange('category', value)}
					/>
				</div>

				<div className="filter-group">
					<label className="filter-label">Cấp độ</label>
					<Dropdown
						options={levelOptions}
						value={filters.level}
						onChange={(value) => onFilterChange('level', value)}
					/>
				</div>

				<div className="filter-group">
					<label className="filter-label">Trạng thái</label>
					<Dropdown
						options={statusOptions}
						value={filters.status}
						onChange={(value) => onFilterChange('status', value)}
					/>
				</div>

				<div className="filter-group">
					<label className="filter-label">Giảng viên</label>
					<Dropdown
						options={instructorOptions}
						value={filters.instructor}
						onChange={(value) => onFilterChange('instructor', value)}
					/>
				</div>

				<div className="filter-group">
					<label className="filter-label">Giá</label>
					<Dropdown
						options={priceRangeOptions}
						value={filters.priceRange}
						onChange={(value) => onFilterChange('priceRange', value)}
					/>
				</div>

				<div className="filter-group">
					<label className="filter-label">Xuất bản</label>
					<Dropdown
						options={publishedOptions}
						value={filters.isPublished.toString()}
						onChange={(value) => onFilterChange('isPublished', value === 'all' ? 'all' : value === 'true')}
					/>
				</div>

				<div className="filter-group">
					<label className="filter-label">Nổi bật</label>
					<Dropdown
						options={featuredOptions}
						value={filters.isFeatured.toString()}
						onChange={(value) => onFilterChange('isFeatured', value === 'all' ? 'all' : value === 'true')}
					/>
				</div>
			</div>

			{/* Sort */}
			<div className="filter-section">
				<div className="sort-controls">
					<div className="sort-group">
						<label className="filter-label">Sắp xếp theo</label>
						<Dropdown
							options={sortByOptions}
							value={filters.sortBy}
							onChange={(value) => onFilterChange('sortBy', value)}
						/>
					</div>
					
					<button
						className={`btn btn-icon ${filters.sortOrder === 'asc' ? 'btn-primary' : 'btn-secondary'}`}
						onClick={() => onFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
						title={`Sắp xếp ${filters.sortOrder === 'asc' ? 'tăng dần' : 'giảm dần'}`}
					>
						{filters.sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
					</button>
				</div>
			</div>

			{/* Actions */}
			<div className="filter-section">
				<div className="filter-actions">
					{hasActiveFilters && (
						<button
							className="btn btn-secondary btn-sm"
							onClick={onClearFilters}
						>
							<Filter size={16} />
							Xóa bộ lọc
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
