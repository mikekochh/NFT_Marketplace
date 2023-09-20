import React from 'react';

const Banner = ({ bannerImage, bannerName }) => (
  <div className="relative overflow-hidden">
    <div className="w-full h-72 relative">
      <img
        className="w-full h-full object-cover filter"
        src={bannerImage}
        alt="banner"
      />
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative inset-0 bg-black bg-opacity-80 rounded-md z-10 p-4">
        <p className="text-white  text-4xl font-bold z-10">{bannerName}</p>
      </div>
    </div>
  </div>
);

export default Banner;
