'use client';

import { usePopupAlert } from '@/providers/AlertProvider';
import { useRouter } from 'next/navigation';

const LogoutBtn: React.FC = () => {
  const router = useRouter();
  const { setAlert } = usePopupAlert();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/v1/auth/logout', { method: 'POST' });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        setAlert('Unable to logout', 'error');
        console.error('Logout attempt failed', response.statusText);
      }
    } catch (error) {
      setAlert('Unable to logout', 'error');
      console.error('Logout request failure', error);
    }
  };

  return (
    <button className="border border-gray-300 rounded-md px-4 py-2 text-red-700" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutBtn;
