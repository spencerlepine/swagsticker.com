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

  const handleSearch = () => {
    const encodedTerm = encodeURIComponent(searchTerm.toLowerCase());

    const existingSearchParams = Object.fromEntries(searchParams);
    existingSearchParams.query = encodedTerm; // ?query=github%20sticker
    const updatedSearchParams = new URLSearchParams(existingSearchParams);

    router.push(`/?${updatedSearchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-96">
      <div className="flex bg-white rounded-md border">
        <input
          type="text"
          placeholder="Search"
          className="text-black rounded-md px-3 py-2 flex-grow"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handlePressEnter}
        />
        <button className="text-white px-3 py-2 rounded-md flex items-center justify-center" type="submit" aria-label="Search">
          <IoSearch className="text-gray-500" />
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
