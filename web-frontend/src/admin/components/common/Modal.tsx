import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import '../../styles/common.css'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title: string
	children: React.ReactNode
	footer?: React.ReactNode
	maxWidth?: string
}

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	footer,
	maxWidth = '500px'
}: ModalProps): JSX.Element | null {
	
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
		}

		return () => {
			document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div 
				className="modal-content" 
				style={{ maxWidth }}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="modal-header">
					<h3 className="modal-title">{title}</h3>
					<button
						onClick={onClose}
						className="btn btn-icon btn-secondary"
						style={{ 
							position: 'absolute', 
							top: '16px', 
							right: '16px' 
						}}
					>
						<X size={18} />
					</button>
				</div>
				
				<div className="modal-body">
					{children}
				</div>
				
				{footer && (
					<div className="modal-footer">
						{footer}
					</div>
				)}
			</div>
		</div>
	)
}

