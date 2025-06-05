export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface EmailValidationResult extends ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordValidationResult extends ValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

// Email validation
export const validateEmail = (email: string): EmailValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email là bắt buộc');
  } else if (!email.trim()) {
    errors.push('Email không được để trống');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Vui lòng nhập địa chỉ email hợp lệ');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Password validation
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  if (!password) {
    errors.push('Mật khẩu là bắt buộc');
    return { isValid: false, errors, strength };
  }
  
  if (password.length < 8) {
    errors.push('Mật khẩu phải có ít nhất 8 ký tự');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất một chữ cái in hoa');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất một chữ cái thường');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất một số');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Mật khẩu phải chứa ít nhất một ký tự đặc biệt');
  }
  
  // Calculate strength
  const strongConditions = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  ];
  
  const metConditions = strongConditions.filter(Boolean).length;
  
  if (metConditions >= 5) {
    strength = 'strong';
  } else if (metConditions >= 3) {
    strength = 'medium';
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
};

// Name validation
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Họ tên là bắt buộc');
  } else if (!name.trim()) {
    errors.push('Họ tên không được để trống');
  } else if (name.trim().length < 2) {
    errors.push('Họ tên phải có ít nhất 2 ký tự');
  } else if (name.trim().length > 50) {
    errors.push('Họ tên không được quá 50 ký tự');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// OTP validation
export const validateOTP = (otp: string[]): ValidationResult => {
  const errors: string[] = [];
  const otpString = otp.join('');
  
  if (otpString.length !== 6) {
    errors.push('Vui lòng nhập đầy đủ 6 chữ số');
  } else if (!/^\d{6}$/.test(otpString)) {
    errors.push('Mã OTP chỉ được chứa các chữ số');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Password confirmation validation
export const validatePasswordConfirmation = (password: string, confirmPassword: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push('Vui lòng xác nhận mật khẩu');
  } else if (password !== confirmPassword) {
    errors.push('Mật khẩu xác nhận không khớp');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Form validation for login
export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  
  const allErrors = [...emailValidation.errors, ...passwordValidation.errors];
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

// Form validation for registration
export const validateRegistrationForm = (
  name: string, 
  email: string, 
  password: string, 
  confirmPassword: string
): ValidationResult => {
  const nameValidation = validateName(name);
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);
  const confirmValidation = validatePasswordConfirmation(password, confirmPassword);
  
  const allErrors = [
    ...nameValidation.errors,
    ...emailValidation.errors,
    ...passwordValidation.errors,
    ...confirmValidation.errors
  ];
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

// Form validation for change password
export const validateChangePasswordForm = (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): ValidationResult => {
  const errors: string[] = [];
  
  if (!currentPassword) {
    errors.push('Mật khẩu hiện tại là bắt buộc');
  }
  
  const newPasswordValidation = validatePassword(newPassword);
  errors.push(...newPasswordValidation.errors);
  
  const confirmValidation = validatePasswordConfirmation(newPassword, confirmPassword);
  errors.push(...confirmValidation.errors);
  
  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push('Mật khẩu mới phải khác mật khẩu hiện tại');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 