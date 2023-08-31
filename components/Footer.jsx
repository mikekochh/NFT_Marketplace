import Image from 'next/image';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import images from '../assets';
import { Button } from '.';

const Footer = () => {
  const { theme } = useTheme();

  const generateSocialLink = (i) => {
    switch (i) {
      case 0: return 'https://twitter.com/MichaelKochDev';
      case 1: return 'https://discord.com/users/mikekochh';
      case 2: return 'https://github.com/mikekochh';
      case 3: return 'https://www.linkedin.com/in/michael-koch-6378831a2/';
      default: return '/';
    }
  };

  return (
    <footer className="flexCenter flex-col border-t dark:border-nft-black-1 border-nft-gray-1 sm:py-8 py-16">
      <div className="w-full minmd:w-4/5 flex flex-row md:flex-col sm:px-4 px-16">
        <div className="flexStart flex-1 flex-col">
          <div className="flexCenter cursor-pointer">
            <Image src={images.mkLogo} objectFit="contain" width={32} heigth={32} alt="logo" />
            <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1 p-1">Michael Koch</p>
          </div>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base mt-6">Contact Me!</p>
          <div className="flexBetween md:w-full minlg:w-557 w-357 mt-6 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 rounded-md">
            <input type="email" placeholder="Your Email" className="h-full flex-1 w-full dark:bg-nft-black-2 bg-white px-4 rounded-md dark:text-white text-nft-black-1 font-normal text-xs minlg:text-lg outline-none" />
            <div className="flex">
              <Button btnName="Email Me" classStyles="rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="flexCenter w-full mt-5 border-t dark:border-nft-black-1 border-nft-gray-1 sm:px-4 px-16">
        <div className="flexBetween flex-row w-full minmd:w-4/5 sm:flex-col mt-7">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base">Michael Koch, NFT Real Estate Marketplace.</p>
          <div className="flex flex-row sm:mt-4">
            {[images.Xlogo, images.discord, images.github, images.linkedin].map((image, index) => (
              <div className="mx-2 cursor-pointer" key={index}>
                <Link href={generateSocialLink(index)}>
                  <Image
                    src={image}
                    objectFit="contain"
                    width={24}
                    height={24}
                    alt="social"
                    className={theme === 'light' && 'filter invert'}
                  />
                </Link>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="flex-1 flexBetweenStart flex-wrap ml-10 md:ml-0 md:mt-8">
        <FooterLinks heading="Michael Koch" />
      </div> */}
    </footer>

  );
};

export default Footer;
