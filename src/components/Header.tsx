import CartBtn from '@/components/CartBtn';
import SearchBar from '@/components/SearchBar';
import SignInBtn from '@/components/SignInBtn';

const Header = () => {
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
          <SignInBtn />

          <CartBtn />
        </div>
      </div>
    </header>
  );
};

export default Header;
