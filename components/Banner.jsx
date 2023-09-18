import React from 'react';

// const Banner = ({ bannerImage, bannerName }) => (
//   <div className="relative overflow-hidden">
//     <img
//       className="w-full h-72 object-cover "
//       src={bannerImage}
//       alt="banner"
//     />
//     {/* <div className="absolute inset-0 bg-opacity-50 bg-black" /> */}
//     <div className="absolute inset-0 flex items-center justify-center">
//       <div className="bg-black rounded-md p-4 backdrop-blur-md">
//         <p className="dark:text-nft-black text-nft-black text-4xl font-bold ">{bannerName}</p>
//       </div>
//     </div>
//   </div>
// );

const Banner = ({ bannerImage, bannerName }) => (
  <div className="relative overflow-hidden">
    <div className="w-full h-72 relative">
      <img
        className="w-full h-full object-cover filter" // Use filter blur-lg for a stronger blur
        src={bannerImage}
        alt="banner"
      />
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Pseudo-Element for Transparent Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md z-0" />
        <p className="dark:text-white text-nft-black-1 text-4xl font-bold z-10">{bannerName}</p>
      </div>
    </div>
  </div>
);

export default Banner;
