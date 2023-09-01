import React from 'react';
import Image from 'next/image';

import images from '../assets';

const OwnerCard = ({ rank, ownerImage, ownerName, ownerEths }) => (
  <div className="min-w-190 minlg:min-w-240 dark:bg-nft-black-3 bg-white border dark:border-nft-black border-nft-gray-1 rounded-3xl flex flex-col p-4 m-4">
    <div className="w-8 h-8 minlg:w-10 minlg:h-10 gray-gradient flexCenter rounded-full">
      <p className="text-white font-poppins font-semibold text-base minlg:text-lg">{rank}</p>
    </div>

    <div className="my-2 flex justify-center">
      <div className="relative w-20 h-20 minlg:w-28 minlg:h-28">
        <Image
          src={ownerImage}
          layout="fill"
          objectFit="cover"
          alt="owner"
          className="rounded-full"
        />
      </div>
    </div>

    <div className="mt-3 minlg:mt-7 text-center flexCenter flex-col">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base">{ownerName}</p>
      <p className="mt-1 font-poppins dark:text-white text-nft-black-1 font-semibold text-base">{ownerEths.toFixed(2)} <span className="font-normal">ETH</span></p>
    </div>

  </div>
);

export default OwnerCard;
