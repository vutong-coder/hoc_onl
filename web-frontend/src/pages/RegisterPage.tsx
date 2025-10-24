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
	const [webAuthnLoading, setWebAuthnLoading] = useState(false)

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

	// WebAuthn Registration
	const startWebAuthnRegistration = async () => {
		setWebAuthnLoading(true)
		try {
			// Step 1: Get registration options from server (qua API Gateway - localhost:8080)
			const response = await fetch('http://localhost:8080/api/webauthn/registration/options', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: formData.email,
					displayName: formData.name || formData.email
				})
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const options = await response.json()
			console.log('Registration options:', options)

			// Step 2: Create PublicKeyCredential with WebAuthn API
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

			console.log('Created credential:', credential)

			// Step 3: Send registration result to server (qua API Gateway - localhost:8080)
			const response2 = await fetch('http://localhost:8080/api/webauthn/registration/result', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: formData.email,
					credentialId: arrayBufferToBase64Url(credential.rawId),
					clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON),
					attestationObject: arrayBufferToBase64Url((credential.response as any).attestationObject),
					publicKey: '' // Simplified for demo
				})
			})

			const result = await response2.json()
			console.log('Registration result:', result)

			if (result.success) {
				alert('Đăng ký WebAuthn thành công! Bạn có thể đăng nhập không mật khẩu.')
			} else {
				alert('Đăng ký WebAuthn thất bại: ' + result.message)
			}

		} catch (error: any) {
			console.error('WebAuthn registration error:', error)
			alert('Lỗi đăng ký WebAuthn: ' + error.message)
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
				id="name"
				name="name"
				type="text"
				value={formData.name}
				onChange={handleInputChange}
				placeholder="Nhập họ và tên của bạn"
				error={errors.name}
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