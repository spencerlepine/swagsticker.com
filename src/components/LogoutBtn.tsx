'use client';

import { useRouter } from 'next/navigation';

const LogoutBtn: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/v1/auth/logout', { method: 'POST' });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <button className="border border-gray-300 rounded-md px-4 py-2" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutBtn;
