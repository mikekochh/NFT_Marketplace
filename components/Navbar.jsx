import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

import { RealEstateContext } from '../context/RealEstateContext';
import images from '../assets';
import Button from './Button';

// Helper component for menu items in nav bar
const MenuItems = ({ isMobile, active, setActive, setIsOpen }) => {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/') {
      setActive('Buy');
    } else if (router.pathname === '/list') {
      setActive('List');
    } else if (router.pathname === '/rent') {
      setActive('Rent');
    } else if (router.pathname === '/my-properties') {
      setActive('My Properties');
    }
  }, [router.pathname]);

  const generateLink = (i) => {
    switch (i) {
      case 0: return '/';
      case 1: return '/list';
      case 2: return '/my-properties';
      default: return '/';
    }
  };

  const onClickActivity = (item) => {
    setActive(item);
    setIsOpen(false);
  };

  return (
    <ul className={`list-none flexCenter flex-row ${isMobile && 'flex-col h-full'}`}>
      {['Buy', 'List', 'My Properties'].map((item, i) => (
        <li key={i} onClick={() => onClickActivity(item)} className={`md:text-3xl md:p-2 flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-nft-dark mx-3 ${active === item ? 'dark:text-white text-nft-black-1' : 'dark:text-nft-gray-3 text-nft-gray-2'}`}>
          <Link href={generateLink(i)}>
            {item}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const ButtonGroup = () => {
  const { connectWallet, currentAccount } = useContext(RealEstateContext);

  return currentAccount ? <div /> : (
    <Button classStyles="mx-2 rounded-xl" btnName="Connect" handleClick={() => connectWallet()} />
  );
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState('Buy');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flexBetween w-full z-10 p-4 flex-row border-b dark:bg-nft-dark bg-white dark:border-nft-black-1 border-nft-gray-1">

      {/* Section for logo and ability to change based off of screen size */}
      <div className="flex flex-1 flex-row justify-start">
        <Link href="https://www.michaelgkoch.com">
          <div className="flexCenter md:hidden cursor-pointer" onClick={() => {}}>
            <Image src={images.mkLogo} objectFit="contain" width={32} heigth={32} alt="logo" />
            <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1">Michael Koch</p>
          </div>
        </Link>
        <Link href="https://www.michaelgkoch.com">
          <div className="hidden md:flex cursor-pointer" onClick={() => {}}>
            <Image src={images.mkLogo} objectFit="contain" width={32} height={32} alt="logo" />
          </div>
        </Link>
      </div>

      {/* Section for light dark mode switch, larger devices */}
      <div className="flex flex-initial flex-row justify-end">
        <div className="flex items-center mr-2 ">
          <input type="checkbox" className="checkbox" id="checkbox" onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
          <label htmlFor="checkbox" className="flexBetween w-8 h-4 bg-black rounded-2xl p-1 relative label cursor-pointer">
            <i className="fas fa-sun" />
            <i className="fas fa-moon" />
            <div className="w-3 h-3 absolute bg-white rounded-full ball" />
          </label>
        </div>

        {/* Section for menu items */}
        <div className="md:hidden flex justify-end">
          <MenuItems active={active} setActive={setActive} setIsOpen={setIsOpen} />
          <ButtonGroup />
        </div>

      </div>

      <div className="hidden md:flex ml-2">
        {isOpen ? (
          <Image
            src={images.cross}
            objectFit="contain"
            width={20}
            height={20}
            alt="close"
            onClick={() => setIsOpen(false)}
            className={theme === 'light' && 'filter invert'}
          />
        ) : (
          <Image
            src={images.menu}
            objectFit="contain"
            width={25}
            height={25}
            alt="menu"
            onClick={() => setIsOpen(true)}
            className={theme === 'light' && 'filter invert'}
          />
        )}

        {isOpen && (
          <div className="fixed inset-0 top-65 dark:bg-nft-dark bg-white z-20 nav-h flex justify-between flex-col items-center">
            <div className="flex-1 p-4">
              <MenuItems active={active} setActive={setActive} isMobile setIsOpen={setIsOpen} />
            </div>
            <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1">
              <ButtonGroup />
            </div>
          </div>
        )}

      </div>

    </nav>

  );
};

export default Navbar;
