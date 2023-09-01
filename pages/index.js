import { useTheme } from 'next-themes';
import { Banner } from '../components';
import images from '../assets';

const Home = () => {
  const { theme } = useTheme();

  const bannerTheme = () => (theme === 'light' ? images.bannerDay : images.bannerNight);

  return (
    <div className="flex justify-center">
      <div className="w-full minmd:w-4/5">
        <Banner parentStyles="justify-start " bannerImage={bannerTheme(theme)} bannerName="The NFT Estates" />
      </div>
    </div>
  );
};

export default Home;
