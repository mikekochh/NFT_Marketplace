import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { Banner, PropertyCard, Loader, SearchBar } from '../components';

import { RealEstateContext } from '../context/RealEstateContext';

import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';

const MyListedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { fetchMyProperties } = useContext(RealEstateContext);

  useEffect(() => {
    fetchMyProperties().then((items) => {
      setProperties(items);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <div className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4 flex-1">My Listed Properties</div>
        {properties.length === 0 ? (
          <div className="w-full m-2 flex justify-center ">
            <p className="text-nft-black-1 dark:text-white font-poppins font-semibold text-2xl">No properties found</p>
          </div>
        ) : (
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} displayAddress={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PropertiesComponent = ({ ownedOrListed }) => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSelect, setActiveSelect] = useState('Recently added');
  const [propertiesOriginal, setPropertiesOriginal] = useState([]);

  const { fetchMyProperties } = useContext(RealEstateContext);

  const propertyTitles = ownedOrListed === 'owned' ? 'My Properties' : 'Listed Properties';
  const noPropertyMessage = ownedOrListed === 'owned' ? 'No Properties Owned' : 'No Properties Listed';

  useEffect(() => {
    fetchMyProperties(ownedOrListed).then((items) => {
      setProperties(items);
      setPropertiesOriginal(items);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  const onHandleSearch = (value) => {
    setProperties(propertiesOriginal.filter((property) => property.name.toLowerCase().includes(value.toLowerCase())));
  };

  const onClearSearch = () => {
    if (propertiesOriginal.length) {
      setProperties(propertiesOriginal);
    }
  };

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <div className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4 flex-1">{propertyTitles}</div>
        <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8 py-12">
          <SearchBar activeSelect={activeSelect} setActiveSelect={setActiveSelect} onHandleSearch={onHandleSearch} onClearSearch={onClearSearch} />
        </div>
        {properties.length === 0 ? (
          <div className="sm:px-4 p-12 w-full minmd:w-4/5 flexCenter flex-col">
            <p className="text-nft-black-1 dark:text-white font-poppins font-semibold text-2xl">{noPropertyMessage}</p>
          </div>
        ) : (
          <div className="sm:px-4 w-full minmd:w-4/5 flexCenter flex-col">
            <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} displayAddress={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileSection = () => {
  const { currentAccount } = useContext(RealEstateContext);
  return (
    <div>
      <Banner name="You Properties" childStyles="text-center mb-4" parentStyles="h-80 justify-center" />
      <div className="flexCenter flex-col -mt-20 z-0">
        <div className="flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-nft-black-2 rounded-full">
          <Image src={images.owner1} className="rounded-full object-cover" objectFit="cover" />
        </div>
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">{shortenAddress(currentAccount)}</p>
      </div>
    </div>

  );
};

const MyProperties = () => (
  <div>
    <ProfileSection />
    <PropertiesComponent ownedOrListed="owned" />
    <PropertiesComponent ownedOrListed="listed" />
  </div>
);

export default MyProperties;
