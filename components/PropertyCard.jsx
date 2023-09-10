import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RealEstateContext } from '../context/RealEstateContext';
import { shortenAddress } from '../utils/shortenAddress';

import images from '../assets';

const PropertyCard = ({ key, property, displayAddress }) => {
  const { currency } = useContext(RealEstateContext);

  return (
    <Link href={{ pathname: '/property-details', query: property }}>
      <div className="flex-2 min-w-215 max-w-max xs:max-w-none sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md border-2 border-black dark:border-white">
        <div className="relative w-full h-52 sm:h-36 xs:h-56 mind:h-60 minlg:h-300 rounded-2xl overflow-hidden border-2 border-black dark:border-white">
          <Image
            key={key}
            src={property.image}
            layout="fill"
            objectFit="cover"
            alt={`nft${property.i}`}
          />
        </div>
        <div className="mt-3 flex flex-col">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-lg">{property.name}</p>
          <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-sol xs:items-start xs:mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-xl">{property.price} <span className="normal">{currency}</span></p><br />
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-xl">{displayAddress ? (property.seller.length > 10 ? shortenAddress(property.seller) : realEstate.seller) : undefined}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
