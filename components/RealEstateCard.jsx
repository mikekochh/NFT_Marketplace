import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import images from '../assets';

const RealEstateCard = ({ realEstate }) => (
  <Link href={{ pathname: '/real-estate-details', query: realEstate }}>
    <div className="flex-2 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md border-2 border-black dark:border-white">
      <div className="relative w-full h-52 sm:h-36 xs:h-56 mind:h-60 minlg:h-300 rounded-2xl overflow-hidden border-2 border-black dark:border-white">
        <Image
          src={realEstate.image || images[`estate${realEstate.i}`]}
          layout="fill"
          objectFit="cover"
          alt={`nft${realEstate.i}`}
        />
      </div>
      <div className="mt-3 flex flex-col">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-lg">{realEstate.name}</p>
        <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-sol xs:items-start xs:mt-3">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-xl">{realEstate.price} <span className="normal">ETH</span></p><br />
          <p>{realEstate.seller}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default RealEstateCard;
