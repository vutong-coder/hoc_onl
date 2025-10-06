import React, { useState } from 'react'
import AuthForm from '../components/molecules/AuthForm'
import Input from '../components/atoms/Input'
import Checkbox from '../components/atoms/Checkbox'
import { validateEmail, validatePassword } from '../utils/authValidation'
import { AuthPageType } from '../components/layouts/AuthLayout'

interface LoginPageProps {
	onNavigate: (page: AuthPageType) => void
}

export default function LoginPage({ onNavigate }: LoginPageProps): JSX.Element {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [loading, setLoading] = useState(false)
	const [rememberMe, setRememberMe] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		// Validate form
		const emailError = validateEmail(formData.email)
		const passwordError = validatePassword(formData.password)
		
		if (emailError || passwordError) {
			setErrors({
				email: emailError || '',
				password: passwordError || ''
			})
			return
		}

		setLoading(true)
		
		// Simulate API call
		setTimeout(() => {
			setLoading(false)
			console.log('Login data:', { ...formData, rememberMe })
		}, 1000)
	}

	return (
		<AuthForm
			title="Welcome Back"
			subtitle="Sign in to your account to continue"
			onSubmit={handleSubmit}
			buttonText="Login"
			loading={loading}
			footer={
				<p style={{ margin: 0 }}>
					Don't have an account?{' '}
					<button
						type="button"
						onClick={() => onNavigate('register')}
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
						Sign up
					</button>
				</p>
			}
		>
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
			
			<Input
				id="password"
				name="password"
				type="password"
				value={formData.password}
				onChange={handleInputChange}
				placeholder="Enter your password"
				error={errors.password}
				required
				showPassword={showPassword}
				onTogglePassword={() => setShowPassword(!showPassword)}
			/>
			
			<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginTop: '-0.5rem'
			}}>
				<Checkbox
					id="remember"
					label="Remember me"
					checked={rememberMe}
					onChange={setRememberMe}
				/>
				<button
					type="button"
					onClick={() => onNavigate('forgot')}
					style={{
						background: 'none',
						border: 'none',
						color: 'var(--primary)',
						cursor: 'pointer',
						fontSize: '0.875rem',
						textDecoration: 'none'
					}}
				>
					Forgot Password?
				</button>
			</div>
		</AuthForm>
	)
}