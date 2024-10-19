'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
    <form onSubmit={handleSearch}>
      <div className="flex items-center">
        <input type="text" placeholder="Search" className="border rounded-md px-3 py-2 mr-2" value={searchTerm} onChange={handleInputChange} onKeyDown={handlePressEnter} />
        <button className="bg-blue-500 text-white px-3 py-2 rounded-md" type="submit">
          Search
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
