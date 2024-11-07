'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';

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
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutBtn;
