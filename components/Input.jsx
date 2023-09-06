import React, { useContext } from 'react';
import { RealEstateContext } from '../context/RealEstateContext';

const Input = ({ inputType, title, placeholder, handleClick }) => {
  const { currency } = useContext(RealEstateContext);

  return (
    <div className="mt-10 w-full">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl">{title}</p>

      {inputType === 'number' ? (
        <div className="rounded-lg text-2xl p-4 w-full dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 outline-none font-poppins dark:text-white text-nft-gray-2 flexBetween flex-row">
          <input type="number" className="flex w-full dark:bg-nft-black-1 bg-white outline-none" placeholder={placeholder} onChange={handleClick} />
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">{currency}</p>
        </div>
      ) : inputType === 'textarea' ? (
        <textarea className="w-full rounded-lg text-2xl p-4 dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 outline-none font-poppins dark:text-white text-nft-gray-2" rows="5" placeholder={placeholder} onChange={handleClick} />
      ) : (
        <input type="text" className="rounded-lg text-2xl p-4 w-full dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 outline-none font-poppins dark:text-white text-nft-gray-2" placeholder={placeholder} onChange={handleClick} />
      )}

    </div>
  );
};

export default Input;
