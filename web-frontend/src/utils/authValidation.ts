export const validateEmail = (email: string): string | null => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!email) return 'Email is required'
	if (!emailRegex.test(email)) return 'Please enter a valid email address'
	return null
}

export const validatePassword = (password: string): string | null => {
	if (!password) return 'Password is required'
	if (password.length < 6) return 'Password must be at least 6 characters'
	
	// Check for Vietnamese characters (có dấu)
	const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/
	if (vietnameseRegex.test(password)) {
		return 'Password cannot contain Vietnamese characters with diacritics'
	}
	
	// Check for spaces
	if (password.includes(' ')) {
		return 'Password cannot contain spaces'
	}
	
	return null
}

export const validateName = (name: string): string | null => {
	if (!name) return 'Name is required'
	if (name.length < 2) return 'Name must be at least 2 characters'
	return null
}

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
	if (!confirmPassword) return 'Please confirm your password'
	if (password !== confirmPassword) return 'Passwords do not match'
	return null
}

export const checkPasswordStrength = (password: string): 'weak' | 'fair' | 'good' | 'strong' => {
	if (!password) return 'weak'
	
	let score = 0
	
	// Length check
	if (password.length >= 8) score += 1
	if (password.length >= 12) score += 1
	
	// Character variety checks
	if (/[a-z]/.test(password)) score += 1
	if (/[A-Z]/.test(password)) score += 1
	if (/[0-9]/.test(password)) score += 1
	if (/[^a-zA-Z0-9]/.test(password)) score += 1
	
	// Penalty for Vietnamese characters or spaces
	const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/
	if (vietnameseRegex.test(password) || password.includes(' ')) {
		score = Math.max(0, score - 2) // Heavy penalty
	}
	
	if (score <= 2) return 'weak'
	if (score <= 4) return 'fair'
	if (score <= 5) return 'good'
	return 'strong'
}
