import { useRef } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import images from '../assets';

const Modal = ({ header, body, footer, handleClose }) => {
  const modalRef = useRef(null);
  const { theme } = useTheme();

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  return (
    <div className="bg-overlay-black animated fadeIn z-10 inset-0 fixed flexCenter" onClick={handleClickOutside}>
      <div ref={modalRef} className="w-2/5 md:w-11/12 minlg:w-2/4 dark:bg-nft-dark bg-white flex flex-col rounded-lg">
        <div className="mt-4 mr-4 minlg:mt-6 minlg:mr-6">
          <div className="flex justify-end relative cursor-pointer" onClick={() => handleClose()}>
            <Image src={images.cross} width={10} height={10} alt="cross" className={theme === 'light' && 'filter invert'} />
          </div>

          <div className="flexCenter w-full text-center p-4">
            <h2 className="font-poppins dark:text-white text-nft-black-1 font-normal text-2xl">{header}</h2>
          </div>
          <div className="p-10 sm:px-4 border-t border-b dark:border-nft-black-3 border-nft-gray-1">
            {body}
          </div>
          <div className="flexCenter p-4">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
