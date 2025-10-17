// Document Registrar Component

import React, { useState } from 'react'
import { Upload, FileText, Hash, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { DocumentForm, RegistrationResult } from '../../types/copyright'

interface DocumentRegistrarProps {
	onRegister: (form: DocumentForm) => Promise<RegistrationResult>
	loading?: boolean
}

export const DocumentRegistrar: React.FC<DocumentRegistrarProps> = ({ onRegister, loading = false }) => {
	const [form, setForm] = useState<DocumentForm>({
		title: '',
		author: '',
		description: '',
		file: null,
		category: 'academic',
		keywords: [],
		language: 'en',
		version: '1.0',
		license: 'copyright',
		originalSource: '',
		references: [],
		doi: '',
		isbn: ''
	})
	
	const [keywordInput, setKeywordInput] = useState('')
	const [referenceInput, setReferenceInput] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [result, setResult] = useState<RegistrationResult | null>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setForm(prev => ({ ...prev, file }))
		}
	}

	const addKeyword = () => {
		if (keywordInput.trim() && !form.keywords.includes(keywordInput.trim())) {
			setForm(prev => ({
				...prev,
				keywords: [...prev.keywords, keywordInput.trim()]
			}))
			setKeywordInput('')
		}
	}

	const removeKeyword = (keyword: string) => {
		setForm(prev => ({
			...prev,
			keywords: prev.keywords.filter(k => k !== keyword)
		}))
	}

	const addReference = () => {
		if (referenceInput.trim() && !form.references?.includes(referenceInput.trim())) {
			setForm(prev => ({
				...prev,
				references: [...(prev.references || []), referenceInput.trim()]
			}))
			setReferenceInput('')
		}
	}

	const removeReference = (reference: string) => {
		setForm(prev => ({
			...prev,
			references: prev.references?.filter(r => r !== reference) || []
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!form.file) {
			alert('Please select a file to upload')
			return
		}

		setIsSubmitting(true)
		setResult(null)

		try {
			const result = await onRegister(form)
			setResult(result)
			
			if (result.success) {
				// Reset form on success
				setForm({
					title: '',
					author: '',
					description: '',
					file: null,
					category: 'academic',
					keywords: [],
					language: 'en',
					version: '1.0',
					license: 'copyright',
					originalSource: '',
					references: [],
					doi: '',
					isbn: ''
				})
				setKeywordInput('')
				setReferenceInput('')
			}
		} catch (error) {
			setResult({
				success: false,
				documentId: '',
				error: error instanceof Error ? error.message : 'Registration failed'
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="document-registrar">
			<div className="registrar-header">
				<h3>Đăng ký bản quyền tài liệu mới</h3>
				<p>Upload và đăng ký tài liệu của bạn lên blockchain để bảo vệ bản quyền</p>
			</div>

			<form onSubmit={handleSubmit} className="registrar-form">
				{/* File Upload Section */}
				<div className="form-section">
					<h4>Thông tin tài liệu</h4>
					<div className="file-upload-area">
						<div className="file-upload-box">
							<Upload className="upload-icon" />
							<div className="upload-content">
								{form.file ? (
									<div className="file-selected">
										<FileText className="file-icon" />
										<div className="file-info">
											<span className="file-name">{form.file.name}</span>
											<span className="file-size">{(form.file.size / 1024 / 1024).toFixed(2)} MB</span>
										</div>
									</div>
								) : (
									<div className="upload-prompt">
										<p>Kéo thả file vào đây hoặc click để chọn</p>
										<p className="upload-hint">Hỗ trợ: PDF, DOCX, TXT, MD, PPT, XLSX (tối đa 10MB)</p>
									</div>
								)}
							</div>
							<input
								type="file"
								onChange={handleFileChange}
								accept=".pdf,.docx,.txt,.md,.ppt,.xlsx"
								className="file-input"
							/>
						</div>
					</div>
				</div>

				{/* Basic Information */}
				<div className="form-section">
					<h4>Thông tin cơ bản</h4>
					<div className="form-grid">
						<div className="form-group">
							<label htmlFor="title">Tiêu đề tài liệu *</label>
							<input
								type="text"
								id="title"
								value={form.title}
								onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
								required
								placeholder="Nhập tiêu đề tài liệu"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="author">Tác giả *</label>
							<input
								type="text"
								id="author"
								value={form.author}
								onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
								required
								placeholder="Nhập tên tác giả"
							/>
						</div>
						<div className="form-group full-width">
							<label htmlFor="description">Mô tả</label>
							<textarea
								id="description"
								value={form.description}
								onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
								placeholder="Mô tả ngắn gọn về nội dung tài liệu"
								rows={3}
							/>
						</div>
					</div>
				</div>

				{/* Metadata */}
				<div className="form-section">
					<h4>Thông tin metadata</h4>
					<div className="form-grid">
						<div className="form-group">
							<label htmlFor="category">Danh mục</label>
							<select
								id="category"
								value={form.category}
								onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as any }))}
							>
								<option value="academic">Học thuật</option>
								<option value="research">Nghiên cứu</option>
								<option value="textbook">Sách giáo khoa</option>
								<option value="thesis">Luận văn</option>
								<option value="article">Bài báo</option>
								<option value="presentation">Thuyết trình</option>
							</select>
						</div>
						<div className="form-group">
							<label htmlFor="language">Ngôn ngữ</label>
							<select
								id="language"
								value={form.language}
								onChange={(e) => setForm(prev => ({ ...prev, language: e.target.value }))}
							>
								<option value="vi">Tiếng Việt</option>
								<option value="en">English</option>
								<option value="zh">中文</option>
								<option value="ja">日本語</option>
								<option value="ko">한국어</option>
							</select>
						</div>
						<div className="form-group">
							<label htmlFor="version">Phiên bản</label>
							<input
								type="text"
								id="version"
								value={form.version}
								onChange={(e) => setForm(prev => ({ ...prev, version: e.target.value }))}
								placeholder="1.0"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="license">Giấy phép</label>
							<select
								id="license"
								value={form.license}
								onChange={(e) => setForm(prev => ({ ...prev, license: e.target.value as any }))}
							>
								<option value="copyright">Bản quyền</option>
								<option value="cc-by">CC BY</option>
								<option value="cc-by-sa">CC BY-SA</option>
								<option value="cc-by-nc">CC BY-NC</option>
								<option value="public-domain">Public Domain</option>
							</select>
						</div>
					</div>
				</div>

				{/* Keywords */}
				<div className="form-section">
					<h4>Từ khóa</h4>
					<div className="keywords-input">
						<div className="keyword-input-group">
							<input
								type="text"
								value={keywordInput}
								onChange={(e) => setKeywordInput(e.target.value)}
								placeholder="Nhập từ khóa"
								onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
							/>
							<button type="button" onClick={addKeyword} className="btn btn-secondary btn-sm">
								Thêm
							</button>
						</div>
						<div className="keywords-list">
							{form.keywords.map((keyword, index) => (
								<span key={index} className="keyword-tag">
									{keyword}
									<button
										type="button"
										onClick={() => removeKeyword(keyword)}
										className="remove-keyword"
									>
										×
									</button>
								</span>
							))}
						</div>
					</div>
				</div>

				{/* References */}
				<div className="form-section">
					<h4>Tham khảo</h4>
					<div className="references-input">
						<div className="reference-input-group">
							<input
								type="url"
								value={referenceInput}
								onChange={(e) => setReferenceInput(e.target.value)}
								placeholder="Nhập URL tham khảo"
								onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addReference())}
							/>
							<button type="button" onClick={addReference} className="btn btn-secondary btn-sm">
								Thêm
							</button>
						</div>
						<div className="references-list">
							{form.references?.map((reference, index) => (
								<div key={index} className="reference-item">
									<a href={reference} target="_blank" rel="noopener noreferrer">
										{reference}
									</a>
									<button
										type="button"
										onClick={() => removeReference(reference)}
										className="remove-reference"
									>
										×
									</button>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Additional Information */}
				<div className="form-section">
					<h4>Thông tin bổ sung</h4>
					<div className="form-grid">
						<div className="form-group">
							<label htmlFor="originalSource">Nguồn gốc</label>
							<input
								type="text"
								id="originalSource"
								value={form.originalSource || ''}
								onChange={(e) => setForm(prev => ({ ...prev, originalSource: e.target.value }))}
								placeholder="Nguồn gốc của tài liệu"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="doi">DOI</label>
							<input
								type="text"
								id="doi"
								value={form.doi || ''}
								onChange={(e) => setForm(prev => ({ ...prev, doi: e.target.value }))}
								placeholder="10.1000/182"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="isbn">ISBN</label>
							<input
								type="text"
								id="isbn"
								value={form.isbn || ''}
								onChange={(e) => setForm(prev => ({ ...prev, isbn: e.target.value }))}
								placeholder="978-0-123456-78-9"
							/>
						</div>
					</div>
				</div>

				{/* Result Display */}
				{result && (
					<div className={`result-display ${result.success ? 'success' : 'error'}`}>
						{result.success ? (
							<>
								<CheckCircle className="result-icon" />
								<div className="result-content">
									<h4>Đăng ký thành công!</h4>
									<p>Document ID: {result.documentId}</p>
									{result.transactionHash && (
										<p>Transaction Hash: {result.transactionHash}</p>
									)}
									{result.blockNumber && (
										<p>Block Number: {result.blockNumber}</p>
									)}
									{result.gasUsed && (
										<p>Gas Used: {result.gasUsed.toLocaleString()}</p>
									)}
									{result.ipfsHash && (
										<p>IPFS Hash: {result.ipfsHash}</p>
									)}
								</div>
							</>
						) : (
							<>
								<AlertCircle className="result-icon" />
								<div className="result-content">
									<h4>Đăng ký thất bại</h4>
									<p>{result.error}</p>
								</div>
							</>
						)}
					</div>
				)}

				{/* Submit Button */}
				<div className="form-actions">
					<button
						type="submit"
						disabled={isSubmitting || loading}
						className="btn btn-primary btn-lg"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="spinner" />
								Đang đăng ký...
							</>
						) : (
							<>
								<Shield className="btn-icon" />
								Đăng ký bản quyền
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	)
}
