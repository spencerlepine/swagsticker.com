import { cookies } from 'next/headers';
import { FaUser } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import { verifyJwt } from '@/lib/auth';

const SignInBtn = () => {
  const cookieStore = cookies();
  const token = cookieStore.get('swagAuthToken')?.value;
  const { error } = verifyJwt(token);

  const isAuthenticated = !error;

  return (
    <>
      {isAuthenticated ? (
        <div className="flex items-center space-x-2">
          <FaUser className="text-gray-400 w-6 h-6" />
          <a href="/account" className="font-semibold hover:underline">
            Account
          </a>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <MdLogin className="text-gray-400 w-6 h-6" />
          <a data-testid="signin-nav-link" href="/signin" className="text-sky-300 font-semibold hover:underline">
            Sign In
          </a>
        </div>
      )}
    </>
  );
};

export default SignInBtn;
