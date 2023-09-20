import { useState, useEffect, useRef, useContext } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { getTopSellers } from '../utils/getTopSellers';
import { shortenAddress } from '../utils/shortenAddress';
import { sortByAddress, sortByRecentlyListed, sortByPriceHighToLow, sortByPriceLowToHigh } from '../utils/propertySorts';

import { RealEstateContext } from '../context/RealEstateContext';
import { Banner, OwnerCard, PropertyCard, SearchBar } from '../components';
import images from '../assets';

const Home = () => {
  const [hideButtons, setHideButtons] = useState(false);
  const [properties, setProperties] = useState([]);
  const [activeSelect, setActiveSelect] = useState('A-Z');
  const [propertiesOriginal, setPropertiesOriginal] = useState([]);

  const { theme } = useTheme();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);

  const { fetchUnsoldProperties } = useContext(RealEstateContext);

  useEffect(() => {
    fetchUnsoldProperties().then((items) => {
      setProperties(items);
      setPropertiesOriginal(items);
    });
  }, []);

  const bannerTheme = () => (theme === 'light' ? 'bannerDay.jpg' : 'bannerNight.jpg');

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };

  const onHandleSearch = (value) => {
    setProperties(propertiesOriginal.filter((property) => property.name.toLowerCase().includes(value.toLowerCase())));
  };

  const onClearSearch = () => {
    if (propertiesOriginal.length) {
      setProperties(propertiesOriginal);
    }
  };

  const newSearchSort = (item) => {
    switch (item) {
      case 'A-Z':
        setProperties(sortByAddress(properties));
        break;
      case 'Recently Listed':
        setProperties(sortByRecentlyListed(properties));
        break;
      case 'Price (low to high)':
        setProperties(sortByPriceLowToHigh(properties));
        break;
      case 'Price (high to low)':
        setProperties(sortByPriceHighToLow(properties));
        break;
      default:
        setProperties(sortByAddress(properties));
        break;
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  return (
    <div className="flex justify-center">
      <div className="w-full">
        <Banner bannerImage={bannerTheme(theme)} bannerName="The NFT Estates" />
        <h1 className="font-poppins dark:text-white text-nft-black text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0 py-4">High Seller's</h1>
        <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
          <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
            {getTopSellers(propertiesOriginal).map((seller) => (
              <OwnerCard
                ownerName={shortenAddress(seller.seller)}
                ownerEths={seller.totalValue}
                ownerImage={images[`owner${seller.rank}`]}
                rank={seller.rank}
                key={`owner-${seller.rank}`}
              />
            ))}
            {!hideButtons && (
            <>
              <div onClick={() => handleScroll('left')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0">
                <Image src={images.left} layout="fill" objectFit="contain" alt="left_arrow" className={theme === 'light' && 'filter invert'} />
              </div>
              <div onClick={() => handleScroll('right')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0">
                <Image src={images.right} layout="fill" objectFit="contain" alt="left_arrow" className={theme === 'light' && 'filter invert'} />
              </div>
            </>
            )}
            <div />
          </div>
        </div>

        <div className="mt-10">
          <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
            <h1 className="font-poppins dark:text-white text-nft-black text-2xl minlg:text-4xl font-semibold sm:mb-4 flex-1">For Sale</h1>
          </div>
          <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8 pt-2">
            <SearchBar activeSelect={activeSelect} setActiveSelect={setActiveSelect} onHandleSearch={onHandleSearch} onClearSearch={onClearSearch} newSearchSort={newSearchSort} />
          </div>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {properties.map((i, index) => (
              <PropertyCard
                key={`property-${index}-${i.name}`}
                property={{
                  i,
                  name: i.name,
                  seller: i.seller,
                  owner: i.owner,
                  description: i.description,
                  price: i.price,
                  image: i.image,
                  tokenId: i.tokenId,
                  date: i.date,
                }}
                displayAddress
              />
            ))}
          </div>
        </div>

      </div>
    </div>

  );
};

export default Home;
