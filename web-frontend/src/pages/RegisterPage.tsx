import React, { useState } from 'react'
import AuthForm from '../components/molecules/AuthForm'
import Input from '../components/atoms/Input'
import PasswordStrength from '../components/atoms/PasswordStrength'
import { validateEmail, validatePassword, validateName, validateConfirmPassword, checkPasswordStrength } from '../utils/authValidation'
import { AuthPageType } from '../components/layouts/AuthLayout'

interface RegisterPageProps {
	onNavigate: (page: AuthPageType) => void
}

export default function RegisterPage({ onNavigate }: RegisterPageProps): JSX.Element {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [loading, setLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak')

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}

		// Update password strength
		if (name === 'password') {
			setPasswordStrength(checkPasswordStrength(value))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		// Validate form
		const nameError = validateName(formData.name)
		const emailError = validateEmail(formData.email)
		const passwordError = validatePassword(formData.password)
		const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword)
		
		if (nameError || emailError || passwordError || confirmPasswordError) {
			setErrors({
				name: nameError || '',
				email: emailError || '',
				password: passwordError || '',
				confirmPassword: confirmPasswordError || ''
			})
			return
		}

		setLoading(true)
		
		// Simulate API call
		setTimeout(() => {
			setLoading(false)
			console.log('Register data:', formData)
		}, 1000)
	}

	return (
		<AuthForm
			title="Create Account"
			subtitle="Sign up to get started with EduPlatform"
			onSubmit={handleSubmit}
			buttonText="Create Account"
			loading={loading}
			footer={
				<p style={{ margin: 0 }}>
					Already have an account?{' '}
					<button
						type="button"
						onClick={() => onNavigate('login')}
						style={{
							background: 'none',
							border: 'none',
							color: 'var(--primary)',
							cursor: 'pointer',
							textDecoration: 'underline',
							fontSize: 'inherit',
							fontFamily: 'inherit'
						}}
					>
						Sign in
					</button>
				</p>
			}
		>
			<Input
				id="name"
				name="name"
				type="text"
				value={formData.name}
				onChange={handleInputChange}
				placeholder="Enter your full name"
				error={errors.name}
				required
			/>
			
			<Input
				id="email"
				name="email"
				type="email"
				value={formData.email}
				onChange={handleInputChange}
				placeholder="Enter your email"
				error={errors.email}
				required
			/>
			
			<div>
				<Input
					id="password"
					name="password"
					type="password"
					value={formData.password}
					onChange={handleInputChange}
					placeholder="Create a password"
					error={errors.password}
					required
					showPassword={showPassword}
					onTogglePassword={() => setShowPassword(!showPassword)}
				/>
				<PasswordStrength strength={passwordStrength} />
			</div>
			
			<Input
				id="confirmPassword"
				name="confirmPassword"
				type="password"
				value={formData.confirmPassword}
				onChange={handleInputChange}
				placeholder="Confirm your password"
				error={errors.confirmPassword}
				required
				showPassword={showConfirmPassword}
				onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
			/>
		</AuthForm>
	)
}