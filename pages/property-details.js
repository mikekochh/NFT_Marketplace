import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, RealEstateCard, Loader, Modal } from '../components';

import { RealEstateContext } from '../context/RealEstateContext';

import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';

const PaymentBodyCmp = ({ property, currency }) => (
  <div className="flex flex-col">
    <div className="flexBetween font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
      <p>Property</p>
      <p>Subtotal</p>
    </div>
    <div className="flexBetweenStart my-5">
      <div className="flex-1 flexStartCenter">
        <div className="relative w-28 h-28">
          <Image src={property.image} layout="fill" objectFit="cover" />
        </div>
        <div className="flexCenterStart flex-col ml-5">
          <p className="flexBetween font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">{shortenAddress(property.seller)}</p>
          <p className="flexBetween font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">{property.name}</p>
        </div>
      </div>
      <div>
        <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl">{property.price} <span className="font-semibold">{currency}</span> </p>
      </div>
    </div>
    <div className="flexBetween mt-10">
      <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl">Total</p>
      <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl">{property.price} <span className="font-semibold">{currency}</span></p>
    </div>
  </div>
);

const PaymentFooterCmp = ({ handleClose, createPropertySale }) => (
  <div className="flex flex-row sm:flex-col">
    <Button btnName="Checkout" classStyles="mr-5 sm:mb-5 rounded-xl sm:mr-0" handleClick={() => createPropertySale()} />
    <Button btnName="Cancel" classStyles="rounded-xl" handleClick={() => handleClose()} />
  </div>
);

const PropertyDetails = () => {
  const { currentAccount, currency, createPropertySale } = useContext(RealEstateContext);
  const [isLoading, setIsLoading] = useState(true);

  const [property, setProperty] = useState({ image: '', tokenId: '', name: '', price: '', seller: '', owner: '' });

  const router = useRouter();

  const [paymentModal, setPaymentModal] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    setProperty(router.query); // router.query is an object that contains the query string parameters
    setIsLoading(false);
  }, [router.isReady]);

  const routeToRelist = () => {
    router.push({
      pathname: '/list',
      query: property,
    });
  };

  const sold = parseInt(property.seller, 16) === 0;

  if (isLoading) return <Loader />;

  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b border-black dark:border-white">
        <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557">
          <Image src={property.image} alt="property" objectFit="cover" className="rounded-xl shadow-lg" layout="fill" />
        </div>
      </div>

      <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">{property.name}</h2>
        </div>

        <div className="mt-10">
          <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal">Owner</p>
          <div className="flex flex-row items-center mt-3">
            <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
              <Image src={images.owner1} objectFit="cover" alt="owner" className="rounded-full" />
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-semibold">{sold ? shortenAddress(property.owner) : shortenAddress(property.seller)}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <div className="w-full border-b dark:border-nft-black border-nft-gray-1 flex flex-row">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal mb-2">Details</p>
          </div>
          <div className="mt-3">
            <p>{property.description}</p>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col mt-10">
          {currentAccount === property.seller.toLowerCase() ? (
            <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal border border-gray p-2">You own this property</p>
          ) : sold ? (
            <Button btnName="Relist Property" classStyles="mr-5 sm:mr-0 rounded-xl" handleClick={() => routeToRelist()} />
          ) : (
            <Button btnName={`Buy for ${property.price} ${currency}`} classStyles="mr-5 sm:mr-0 rounded-xl" handleClick={() => setPaymentModal(true)} />
          )}
        </div>

      </div>
      {paymentModal && (
        <Modal
          header="Checkout"
          body={<PaymentBodyCmp property={property} currency={currency} />}
          footer={<PaymentFooterCmp handleClose={() => setPaymentModal(false)} createPropertySale={() => createPropertySale(property.tokenId, property.price, router)} />}
          handleClose={() => setPaymentModal(false)}
        />
      )}

    </div>
  );
};

export default PropertyDetails;
