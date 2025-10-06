import React from 'react'

interface InputProps {
	id: string
	name: string
	type: 'text' | 'email' | 'password'
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	placeholder: string
	error?: string
	required?: boolean
	showPassword?: boolean
	onTogglePassword?: () => void
}

export default function Input({
	id,
	name,
	type,
	value,
	onChange,
	placeholder,
	error,
	required = false,
	showPassword,
	onTogglePassword
}: InputProps): JSX.Element {
	const inputType = type === 'password' && showPassword ? 'text' : type
	const hasPasswordToggle = type === 'password' && onTogglePassword

	return (
		<div>
			<label htmlFor={id} style={{
				display: 'block',
				fontSize: '0.875rem',
				fontWeight: '500',
				color: 'var(--card-foreground)',
				marginBottom: '0.25rem'
			}}>
				{name.charAt(0).toUpperCase() + name.slice(1)}
			</label>
			
			<div style={{ position: 'relative' }}>
				<input
					type={inputType}
					id={id}
					name={name}
					value={value}
					onChange={onChange}
					style={{
						width: '100%',
						padding: hasPasswordToggle ? '0.75rem 3rem 0.75rem 1rem' : '0.75rem 1rem',
						border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
						background: 'var(--background)',
						borderRadius: 'var(--radius-md)',
						outline: 'none',
						color: 'var(--foreground)',
						fontSize: '0.875rem',
						animation: error ? 'shake 0.4s ease-in-out' : 'none',
						boxSizing: 'border-box'
					}}
					placeholder={placeholder}
					required={required}
				/>
				
				{hasPasswordToggle && (
					<button
						type="button"
						onClick={onTogglePassword}
						onMouseEnter={(e) => {
							e.currentTarget.style.color = 'var(--primary)'
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.color = 'var(--muted-foreground)'
						}}
						style={{
							position: 'absolute',
							right: '0.75rem',
							top: '50%',
							transform: 'translateY(-50%)',
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							color: 'var(--muted-foreground)',
							fontSize: '1.2rem',
							padding: '0.25rem',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: '4px',
							transition: 'color 0.2s ease',
							minWidth: '2rem',
							minHeight: '2rem'
						}}
					>
						👁
					</button>
				)}
			</div>
			
			{error && (
				<p style={{
					fontSize: '0.875rem',
					color: 'var(--destructive)',
					marginTop: '0.25rem',
					margin: 0
				}}>{error}</p>
			)}
		</div>
	)
}
