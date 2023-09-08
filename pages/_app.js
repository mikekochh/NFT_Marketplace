import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import { RealEstateProvider } from '../context/RealEstateContext';
import { Navbar, Footer } from '../components';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => (
  <RealEstateProvider>
    <ThemeProvider attribute="class">
      <div className="dark:bg-nft-dark bg-white min-h-screen">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
      <Script src="https://kit.fontawesome.com/673be014b0.js" crossorigin="anonymous" />
    </ThemeProvider>
  </RealEstateProvider>

);

export default MyApp;
