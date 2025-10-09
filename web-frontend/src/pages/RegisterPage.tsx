import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthForm from '../components/molecules/AuthForm'
import Input from '../components/atoms/Input'
import PasswordStrength from '../components/atoms/PasswordStrength'
import SocialAuthButtons from '../components/molecules/SocialAuthButtons'
import { validateEmail, validatePassword, validateName, validateConfirmPassword, checkPasswordStrength } from '../utils/authValidation'

export default function RegisterPage(): JSX.Element {
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

	const handleGoogleAuth = () => {
		console.log('Google authentication')
		// TODO: Implement Google OAuth
	}

	const handleFacebookAuth = () => {
		console.log('Facebook authentication')
		// TODO: Implement Facebook OAuth
	}

	const handleGitHubAuth = () => {
		console.log('GitHub authentication')
		// TODO: Implement GitHub OAuth
	}

	return (
		<AuthForm
			title="Create Account"
			subtitle="Sign up to get started with EduPlatform"
			onSubmit={handleSubmit}
			buttonText="Create Account"
			loading={loading}
			afterButton={
				<SocialAuthButtons
					onGoogleAuth={handleGoogleAuth}
					onGitHubAuth={handleGitHubAuth}
				/>
			}
			footer={
				<p style={{ margin: 0 }}>
					Already have an account?{' '}
					<Link 
						to="/auth/login"
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
					</Link>
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
			/>
		</AuthForm>
	)
}