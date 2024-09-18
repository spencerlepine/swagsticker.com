import Image from 'next/image';
import { getSession } from '@auth0/nextjs-auth0';

export default async function AccountPage() {
  const { user } = (await getSession()) || {};

  return (
    user && (
      <div>
        <Image src={user.picture} alt={user.name} width="100" height="100" />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <a href="/api/auth/logout">Logout</a>
      </div>
    )
  );
}
