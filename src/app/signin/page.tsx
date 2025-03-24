'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePopupAlert } from '@/providers/AlertProvider';

export default function SignInPage() {
  const router = useRouter();
  const { setAlert } = usePopupAlert();

  const [isEmailStep, setIsEmailStep] = useState(true);
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/v1/auth/verify');
      const data = await response.json();
      if (data.isAuthenticated) {
        router.push('/');
      }
    } catch (error) {
      setAlert('Unable to authenticate at this time', 'error');
      console.error('Auth check error:', error);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (!isEmailStep && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isEmailStep]);

  const handleEmailSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsEmailStep(false);
      } else {
        setError(data.error || 'Login unavailable at this time');
      }
    } catch (error) {
      setAlert('Login unavailable at this time', 'error');
      console.error('Login issue, OTP email failure', error);
      setError('Unable to send OTP email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const otp = otpDigits.join('');
    try {
      const response = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();
      if (response.ok) {
        // Preload the home page to reduce CLS
        router.prefetch('/');
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          router.push('/');
          // Remove router.refresh() unless needed for server state
        }, 100);
      } else {
        setError(data.error || 'Invalid OTP, please try again');
      }
    } catch (error) {
      setAlert('Login unavailable at this time', 'error');
      console.error('Login issue, unable to verify OTP', error);
      setError('Unable to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Backspace' || e.key === 'Delete') && index > 0 && !otpDigits[index]) {
      inputRefs.current[index - 1]?.focus();
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index - 1] = '';
      setOtpDigits(newOtpDigits);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    if (!/^\d{6}$/.test(text)) return;
    const digits = text.split('');
    setOtpDigits(digits);
    inputRefs.current[5]?.focus();
  };

  useEffect(() => {
    if (emailInputRef.current && document.activeElement !== emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [email]);

  return (
    <div className="min-h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-2">{isEmailStep ? 'Sign In with OTP' : 'Confirm OTP'}</h2>
        <div className="mb-6 text-gray-500 text-sm text-center">{isEmailStep ? "We'll email you a one-time-password (OTP)" : 'Your code was sent to you via email'}</div>

        {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

        {isEmailStep ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <input
                data-testid="signin-email-input"
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email address"
                value={email}
                ref={emailInputRef}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              data-testid="signin-email-submit-btn"
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send Code'}
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleOtpSubmit}>
              <div className="flex items-center justify-center gap-3 mb-6">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    data-testid={`confirm-otp-input-${index}`}
                    type="text"
                    className="w-12 h-14 text-center text-xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    value={digit}
                    onChange={handleInput(index)}
                    onKeyDown={handleKeyDown(index)}
                    onFocus={handleFocus}
                    onPaste={index === 0 ? handlePaste : undefined}
                    maxLength={1}
                    pattern="\d*"
                    ref={el => {
                      inputRefs.current[index] = el;
                    }}
                  />
                ))}
              </div>
              <button
                data-testid="confirm-otp-btn"
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={isLoading}>
                {isLoading ? 'Verifying OTP...' : 'Confirm'}
              </button>
            </form>
            <div className="text-sm text-slate-500 mt-4 text-center">
              {"Didn't receive code? "}{' '}
              <a className="font-medium text-indigo-500 hover:text-indigo-600" href="/signin">
                Resend
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
