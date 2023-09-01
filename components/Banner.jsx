import React from 'react';
import Image from 'next/image';

const Banner = ({ parentStyles, bannerImage, bannerName }) => (
  <div className={`object-fill relative w-full flex items-center z-0 overflow-hidden ${parentStyles}`}>
    <Image src={bannerImage} />
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="dark:text-white text-black text-4xl font-bold">{bannerName}</p>
    </div>
  </div>
);

export default Banner;
