'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoSearch } from 'react-icons/io5';

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.type === 'keydown' && event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = (event?: React.FormEvent) => {
    if (event) event.preventDefault();

    const encodedTerm = encodeURIComponent(searchTerm.toLowerCase());

    const existingSearchParams = Object.fromEntries(searchParams || {});
    existingSearchParams.query = encodedTerm; // ?query=github%20sticker
    const updatedSearchParams = new URLSearchParams(existingSearchParams);

    router.push(`/?${updatedSearchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md">
      <div className="flex bg-white rounded-md border">
        <input
          data-testid="searchbar-input"
          type="text"
          name="search"
          placeholder="Search"
          className="text-black rounded-l-md px-3 py-2 flex-grow focus:outline-none"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handlePressEnter}
        />
        <button data-testid="searchbar-btn" className="text-gray-500 px-3 py-2 rounded-r-md flex items-center justify-center hover:bg-gray-100" type="submit" aria-label="Search">
          <IoSearch />
        </button>
      </div>
    </form>
  );
};

const WrappedSearchBar = () => (
  <Suspense>
    <SearchBar />
  </Suspense>
);
export default WrappedSearchBar;
