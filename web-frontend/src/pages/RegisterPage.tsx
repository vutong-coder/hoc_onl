import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import AuthForm from '../components/molecules/AuthForm'
import Input from '../components/atoms/Input'
import PasswordStrength from '../components/atoms/PasswordStrength'
import SocialAuthButtons from '../components/molecules/SocialAuthButtons'
import { validateEmail, validatePassword, validateName, validateConfirmPassword, checkPasswordStrength } from '../utils/authValidation'
import { registerUser, clearError } from '../store/slices/authSlice'

export default function RegisterPage(): JSX.Element {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { loading, error } = useAppSelector((state) => state.auth)

	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: ''
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak')
	const [webAuthnLoading, setWebAuthnLoading] = useState(false)
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// Validate form
		const usernameError = validateName(formData.username)
		const emailError = validateEmail(formData.email)
		const passwordError = validatePassword(formData.password)
		const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword)
		const firstNameError = validateName(formData.firstName)
		const lastNameError = validateName(formData.lastName)

		if (usernameError || emailError || passwordError || confirmPasswordError || firstNameError || lastNameError) {
			setErrors({
				username: usernameError || '',
				email: emailError || '',
				password: passwordError || '',
				confirmPassword: confirmPasswordError || '',
				firstName: firstNameError || '',
				lastName: lastNameError || ''
			})
			return
		}

		// Dispatch register action
		const result = await dispatch(registerUser({
			username: formData.username,
			email: formData.email,
			password: formData.password,
			firstName: formData.firstName,
			lastName: formData.lastName
		}))

		if (registerUser.fulfilled.match(result)) {
			// Registration success, redirect to login
			alert('Registration successful! Please log in.')
			navigate('/auth/login')
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))

		// Clear errors when user starts typing
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}))
		}

		// Update password strength
		if (name === 'password') {
			setPasswordStrength(checkPasswordStrength(value))
		}
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

	// WebAuthn Registration
	const startWebAuthnRegistration = async () => {
		// First, validate the form data required for user registration
		const usernameError = validateName(formData.username)
		const emailError = validateEmail(formData.email)
		const passwordError = validatePassword(formData.password)
		const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword)
		const firstNameError = validateName(formData.firstName)
		const lastNameError = validateName(formData.lastName)

		if (usernameError || emailError || passwordError || confirmPasswordError || firstNameError || lastNameError) {
			setErrors({
				username: usernameError || '',
				email: emailError || '',
				password: passwordError || '',
				confirmPassword: confirmPasswordError || '',
				firstName: firstNameError || '',
				lastName: lastNameError || ''
			})
			return
		}

		setWebAuthnLoading(true)
		try {
			// Step 1: Register the user with their password first
			const registerResult = await dispatch(registerUser({
				username: formData.username,
				email: formData.email,
				password: formData.password,
				firstName: formData.firstName,
				lastName: formData.lastName
			}))

			if (!registerUser.fulfilled.match(registerResult)) {
				throw new Error(registerResult.payload as string || 'User registration failed. Please check the details and try again.')
			}

			// Step 2: Get WebAuthn registration options from the server
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/identity/api/webauthn/registration/options`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: formData.email, // Use email as the username for WebAuthn
					displayName: `${formData.firstName} ${formData.lastName}`.trim() || formData.email
				})
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
			}

			const options = await response.json()

			// Step 3: Create PublicKeyCredential with WebAuthn API
			const publicKeyCredentialCreationOptions = {
				challenge: base64UrlToArrayBuffer(options.challenge),
				rp: options.rp,
				user: {
					id: base64UrlToArrayBuffer(options.user.id),
					name: options.user.name,
					displayName: options.user.displayName
				},
				pubKeyCredParams: options.pubKeyCredParams,
				authenticatorSelection: options.authenticatorSelection,
				attestation: options.attestation
			}

			const credential = await navigator.credentials.create({
				publicKey: publicKeyCredentialCreationOptions
			}) as PublicKeyCredential

			// Step 4: Send registration result to the server
			const response2 = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/identity/api/webauthn/registration/result`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: formData.email,
					credentialId: arrayBufferToBase64Url(credential.rawId),
					clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON),
					attestationObject: arrayBufferToBase64Url((credential.response as any).attestationObject),
					publicKey: '' // Simplified for demo, backend might not need it if parsing attestationObject
				})
			})

			const result = await response2.json()

			if (result.success && result.data) {
				alert('Registration and WebAuthn setup successful! You are now logged in.')

				const { accessToken, refreshToken, user: backendUser } = result.data;

				const user = {
					id: backendUser.id.toString(),
					email: backendUser.email,
					name: `${backendUser.firstName} ${backendUser.lastName}`.trim(),
					role: backendUser.roles[0]?.toLowerCase(),
					avatar: backendUser.avatarUrl
				};

				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('refreshToken', refreshToken);
				localStorage.setItem('user', JSON.stringify(user));

				dispatch({
					type: 'auth/loginUser/fulfilled',
					payload: user,
				});
			} else {
				alert('WebAuthn registration failed: ' + result.message)
			}

		} catch (error: any) {
			console.error('WebAuthn registration error:', error)
			alert('An error occurred during WebAuthn registration: ' + error.message)
		} finally {
			setWebAuthnLoading(false)
		}
	}

	// Utility functions for WebAuthn
	function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
		const bytes = new Uint8Array(buffer)
		let binary = ''
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i])
		}
		return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
	}

	function base64UrlToArrayBuffer(base64Url: string): ArrayBuffer {
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
		const binary = atob(padded)
		const buffer = new ArrayBuffer(binary.length)
		const bytes = new Uint8Array(buffer)
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i)
		}
		return buffer
	}

	// Check WebAuthn support (runtime check)
	const isWebAuthnSupported = typeof window !== 'undefined' &&
									window.navigator &&
									'credentials' in window.navigator &&
									typeof window.navigator.credentials.create === 'function' &&
									typeof window.navigator.credentials.get === 'function'

	return (
		<AuthForm
			title="Tạo tài khoản"
			subtitle="Đăng ký để bắt đầu với EduPlatform"
			onSubmit={handleSubmit}
			buttonText="Tạo tài khoản"
			loading={loading}
			error={error}
			afterButton={
				<div>
					<SocialAuthButtons
						onGoogleAuth={handleGoogleAuth}
						onGitHubAuth={handleGitHubAuth}
					/>
					{isWebAuthnSupported && (
						<div style={{ marginTop: '1rem', textAlign: 'center' }}>
							<button
								type="button"
								onClick={startWebAuthnRegistration}
								disabled={webAuthnLoading}
								style={{
									width: '100%',
									padding: '0.75rem',
									backgroundColor: webAuthnLoading ? '#ccc' : '#007bff',
									color: 'white',
									border: 'none',
									borderRadius: '0.375rem',
									fontSize: '1rem',
									cursor: webAuthnLoading ? 'not-allowed' : 'pointer'
								}}
							>
								{webAuthnLoading ? '⏳ Đang đăng ký...' : '🔐 Đăng ký không mật khẩu (WebAuthn)'}
							</button>
							<p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.5rem' }}>
								Đăng ký thiết bị bảo mật để đăng nhập không cần mật khẩu sau này
							</p>
						</div>
					)}
				</div>
			}
			footer={
				<p style={{ margin: 0 }}>
					Đã có tài khoản?{' '}
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
						Đăng nhập
					</Link>
				</p>
			}
		>
			<Input
				id="username"
				name="username"
				type="text"
				value={formData.username}
				onChange={handleInputChange}
				placeholder="Nhập tên đăng nhập"
				error={errors.username}
				required
			/>

			<Input
				id="firstName"
				name="firstName"
				type="text"
				value={formData.firstName}
				onChange={handleInputChange}
				placeholder="Nhập họ"
				error={errors.firstName}
				required
			/>

			<Input
				id="lastName"
				name="lastName"
				type="text"
				value={formData.lastName}
				onChange={handleInputChange}
				placeholder="Nhập tên"
				error={errors.lastName}
				required
			/>

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
			
			<div>
				<Input
					id="password"
					name="password"
					type="password"
					value={formData.password}
					onChange={handleInputChange}
					placeholder="Tạo mật khẩu"
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
				placeholder="Xác nhận mật khẩu"
				error={errors.confirmPassword}
				required
			/>
		</AuthForm>
	)
}