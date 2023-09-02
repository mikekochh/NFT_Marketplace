import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import images from '../assets';

const RealEstateCard = ({ realEstate }) => (
  <Link href={{ pathname: '/real-estate-details', query: { realEstate } }}>
    <div className="flex-2 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl">
      {realEstate.name}
    </div>
  </Link>
);

export default RealEstateCard;
