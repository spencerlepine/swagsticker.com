'use client';

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

const Header: React.FC = () => {
  const { user } = useUser();

  return (
    <header>
      <a href="/">SwagSticker</a>
      <div>
        <p>Searchbar</p>
      </div>
      {user ? <a href="/account">Account</a> : <a href="/api/auth/login">Sign in</a>}
      <a href="/cart">Cart</a>
    </header>
  );
};

export default Header;
