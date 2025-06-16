import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onOTPChange?: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  onOTPChange,
  disabled = false,
  error = false,
  autoFocus = true
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    
    // Chỉ cho phép số
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const otpString = newOtp.join('');
    onOTPChange?.(otpString);

    // Tự động chuyển sang ô tiếp theo
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Gọi onComplete khi đã nhập đủ
    if (otpString.length === length) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Xử lý phím Backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Nếu ô hiện tại rỗng, chuyển về ô trước
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        onOTPChange?.(newOtp.join(''));
      } else {
        // Xóa ô hiện tại
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onOTPChange?.(newOtp.join(''));
      }
    }
    // Xử lý phím ArrowLeft và ArrowRight
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    
    // Chỉ lấy số và giới hạn độ dài
    const digits = pasteData.replace(/\D/g, '').substring(0, length);
    
    if (digits.length > 0) {
      const newOtp = new Array(length).fill('');
      for (let i = 0; i < digits.length; i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);
      onOTPChange?.(newOtp.join(''));
      
      // Focus vào ô cuối cùng đã điền hoặc ô đầu tiên trống
      const focusIndex = Math.min(digits.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
      
      if (digits.length === length) {
        onComplete(digits);
      }
    }
  };

  const clearOTP = () => {
    const newOtp = new Array(length).fill('');
    setOtp(newOtp);
    onOTPChange?.('');
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex items-center justify-center space-x-3">
      {otp.map((data, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg
            focus:outline-none focus:ring-2 transition-all duration-200
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
              : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-200 bg-white'
            }
            ${disabled 
              ? 'bg-gray-100 cursor-not-allowed opacity-50' 
              : 'hover:border-emerald-400'
            }
            ${data 
              ? (error ? 'bg-red-50' : 'bg-emerald-50 border-emerald-400') 
              : ''
            }
          `}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInput; 