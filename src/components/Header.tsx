'use client';

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

const Header: React.FC = () => {
  const { user } = useUser();

  return (
    <header>
      <a href="/">SwagSticker</a>
      {user ? <a href="/account">Account</a> : <a href="/api/auth/login">Login</a>}
    </header>
  );
};

export default Header;
