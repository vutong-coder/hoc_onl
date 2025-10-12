import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import AuthForm from '../components/molecules/AuthForm'
import Input from '../components/atoms/Input'
import Checkbox from '../components/atoms/Checkbox'
import SocialAuthButtons from '../components/molecules/SocialAuthButtons'
import { validateEmail, validatePassword } from '../utils/authValidation'
import { loginUser, clearError } from '../store/slices/authSlice'

export default function LoginPage(): JSX.Element {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [rememberMe, setRememberMe] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { loading, error, loggedIn, role } = useAppSelector((state) => state.auth)

	// Redirect based on role after successful login
	useEffect(() => {
		if (loggedIn) {
			if (role === 'admin') {
				navigate('/admin/dashboard')
			} else if (role === 'user') {
				navigate('/user')
			}
		}
	}, [loggedIn, role, navigate])

	// Clear error when component mounts
	useEffect(() => {
		dispatch(clearError())
	}, [dispatch])

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

		// Dispatch login action
		dispatch(loginUser({
			email: formData.email,
			password: formData.password
		}))
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
			title="Chào mừng trở lại"
			subtitle="Đăng nhập vào tài khoản của bạn để tiếp tục"
			onSubmit={handleSubmit}
			buttonText="Đăng nhập"
			loading={loading}
			error={error}
			afterButton={
				<SocialAuthButtons
					onGoogleAuth={handleGoogleAuth}
					onGitHubAuth={handleGitHubAuth}
				/>
			}
			footer={
				<p style={{ margin: 0 }}>
					Chưa có tài khoản?{' '}
					<Link 
						to="/auth/register"
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
						Đăng ký
					</Link>
				</p>
			}
		>
			<Input
				id="email"
				name="email"
				type="email"
				value={formData.email}
				onChange={handleInputChange}
				placeholder="Nhập email của bạn"
				error={errors.email}
				required
			/>
			
			<Input
				id="password"
				name="password"
				type="password"
				value={formData.password}
				onChange={handleInputChange}
				placeholder="Nhập mật khẩu của bạn"
				error={errors.password}
				required
			/>
			
			<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginTop: '-0.5rem'
			}}>
				<Checkbox
					id="remember"
					label="Ghi nhớ đăng nhập"
					checked={rememberMe}
					onChange={setRememberMe}
				/>
				<Link 
					to="/auth/forgot"
					style={{
						background: 'none',
						border: 'none',
						color: 'var(--primary)',
						cursor: 'pointer',
						fontSize: '0.875rem',
						textDecoration: 'none'
					}}
				>
					Quên mật khẩu?
				</Link>
			</div>
		</AuthForm>
	)
}