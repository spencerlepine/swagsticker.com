'use client';

import Image from 'next/image';
import React, { useState } from 'react';

const MAX_CAROUSEL_IMAGES = 4;

const PhotoCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [selectedImageIndx, setSelectedImageIndx] = useState(0);
  const defaultAlt = 'Sticker Product Image';

  const handleClick = (direction: string) => {
    if (direction === 'prev' && selectedImageIndx > 0) {
      setSelectedImageIndx(currentIndex => currentIndex - 1);
    }

    if (direction === 'next' && selectedImageIndx < 3) {
      setSelectedImageIndx(currentIndex => currentIndex + 1);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/12 mr-2">
        {images.map((imageUrl, index) => (
          <Image
            width={150}
            height={150}
            key={index}
            onClick={() => setSelectedImageIndx(index)}
            aria-hidden="true"
            src={imageUrl}
            alt={defaultAlt}
            className={`mb-2 border ${index === selectedImageIndx ? 'border-black border-2' : 'hover:border hover:border-black hover:border-2'}`}
          />
        ))}
      </div>
      <div className="w-4/6 flex h-fit">
        <div className="w-1/12 mr-2 flex items-center justify-between mx-4">
          <button
            disabled={selectedImageIndx === 0}
            onClick={() => handleClick('prev')}
            className="m-auto text-xl rounded-full px-4 py-2 shadow-md hover:shadow-lg hover:bg-gray-200"
          >
            {'<'}
          </button>
        </div>
        <Image width={600} height={600} src={images[selectedImageIndx]} alt={defaultAlt} className="w-full h-auto object-contain" />
        <div className="w-1/12 mr-2 flex items-center justify-between mx-4">
          <button
            disabled={selectedImageIndx === MAX_CAROUSEL_IMAGES - 1}
            onClick={() => handleClick('next')}
            className="m-auto text-xl rounded-full px-4 py-2 shadow-md hover:shadow-lg hover:bg-gray-200"
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCarousel;
