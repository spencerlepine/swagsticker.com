'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [isEmailStep, setIsEmailStep] = useState(true);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/v1/auth/verify');
      const data = await response.json();

      if (data.isAuthenticated) {
        router.push('/');
      }
    } catch (err) {
      console.error('Error checking authentication status:', err);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  // Handle form submit for email
  const handleEmailSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsEmailStep(false);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submit for OTP
  const handleOtpSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/');
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      setError('Error verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-8 mx-20">
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6">{isEmailStep ? 'Sign In with OTP' : 'Enter OTP'}</h2>

            {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

            {isEmailStep ? (
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200" disabled={isLoading}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    maxLength={6}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    required
                  />
                </div>
                <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200" disabled={isLoading}>
                  {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
