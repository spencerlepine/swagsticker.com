import { cookies } from 'next/headers';
import { FaUser } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import CartBtn from '@/components/CartBtn';
import SearchBar from '@/components/SearchBar';
import { verifyJwt } from '@/lib/auth';

const Header = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;
  const { error } = verifyJwt(token);

  const isAuthenticated = !error;

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-stone-900 text-white shadow-md">
      <div className="container flex items-center mx-auto">
        <a href="/" className="text-xl text-sky-300 font-bold font-mono mr-auto">
          SwagSticker
        </a>

        <div className="flex-grow flex justify-center">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-4 ml-auto">
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
              <a href="/signin" className="text-sky-300 font-semibold hover:underline">
                Sign In
              </a>
            </div>
          )}

          <CartBtn />
        </div>
      </div>
    </header>
  );
};

export default Header;
