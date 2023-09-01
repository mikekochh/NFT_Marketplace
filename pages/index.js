import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Banner, OwnerCard } from '../components';

import images from '../assets';
import { makeId } from '../utils/makeId';

const Home = () => {
  const { theme } = useTheme();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);

  const bannerTheme = () => (theme === 'light' ? images.bannerDay : images.bannerNight);

  return (
    <div className="flex justify-center">
      <div className="w-full">
        <Banner parentStyles="justify-start " bannerImage={bannerTheme(theme)} bannerName="The NFT Estates" />
        <h1 className="font-poppins dark:text-white text-nft-black text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0 py-4">Highest Networth's</h1>
        <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
          <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <OwnerCard
                key={`owner-${i}`}
                rank={i}
                ownerImage={images[`owner${i}`]}
                ownerName={`0x${makeId(3)}...${makeId(4)}`}
                ownerEths={10 - i * 0.5}
              />
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};

export default Home;
