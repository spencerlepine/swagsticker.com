import CartNavLink from '@/components/CartNavLink';
import SearchBar from '@/components/SearchBar';
import SignInNavLink from '@/components/SignInNavLink';

const Header = () => {
  return (
    <header className="flex justify-between items-center px-4 py-2 bg-stone-900 text-white shadow-md">
      <div className="container flex flex-col sm:flex-row items-center mx-auto w-full gap-4 sm:gap-0">
        <a href="/" className="text-xl text-sky-300 font-bold font-mono">
          SwagSticker
        </a>

        <div className="flex-grow w-full sm:w-auto flex justify-center">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-4">
          <SignInNavLink />
          <CartNavLink />
        </div>
      </div>
    </header>
  );
};

export default Header;
