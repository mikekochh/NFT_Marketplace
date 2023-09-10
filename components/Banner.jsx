import React from 'react';

const Banner = ({ bannerImage, bannerName }) => {
  console.log(bannerImage);

  return (
    <div className="relative overflow-hidden">
      <img
        className="w-full h-72 object-cover"
        src={bannerImage}
        alt="banner"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="dark:text-nft-black text-nft-black text-4xl font-bold">{bannerName}</p>
      </div>
    </div>
  );
};

export default Banner;
