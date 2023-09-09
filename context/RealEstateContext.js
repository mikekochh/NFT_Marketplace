import { FormatTypes } from 'ethers/lib/utils';
import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import FormData from 'form-data';
// import { pinataSDK } from '@pinata/sdk';

import { MarketAddress, MarketAddressAbi } from './constants';

const fetchContract = (signerOrProvider) => (new ethers.Contract(MarketAddress, MarketAddressAbi, signerOrProvider)); // address from when we deployed the contract

export const RealEstateContext = React.createContext();

export const RealEstateProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const currency = 'ETH';

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install MetaMask!');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
      console.log('There are accounts.');
    } else {
      console.log('No accounts found');
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setCurrentAccount(accounts[0]);

    window.location.reload();
  };

  const uploadToIPFS = async (file) => {
    try {
      const data = new FormData();
      data.append('file', file[0]);
      data.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));
      data.append('pinataMetadata', JSON.stringify({ name: file[0].name }));
      data.append('pinataContent', JSON.stringify({ name: file[0].name }));

      console.log('data', data);

      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      });
      console.log('View the file here: https://gateway.pinata.cloud/ipfs/', res.data.IpfsHash);
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      console.log(error);
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    const contract = fetchContract(signer);

    const listingPrice = await contract.getListingPrice();

    const transaction = await contract.createToken(url, price, { value: listingPrice.toString() });

    await transaction.wait();

    console.log('contract', contract);
  };

  // const createNFT = async (formInput, fileUrl, router) => {
  //   const { name, description, price } = formInput;
  //   if (!name || !description || !price || !fileUrl) return alert('Please fill in all fields');

  //   const data = new FormData();
  //   data.append('pinataMetadata', JSON.stringify({ name, description, image: fileUrl }));

  //   try {
  //     const response = await fetch('/api/uploadToPinata', {
  //       method: 'POST',
  //       body: data,
  //     });

  //     console.log('Are we getting here? Hey: ', response.ok);
  //     console.log('response: ', response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const createNFT = async (formInput, fileUrl, router) => {
    console.log('createNFT');
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return alert('Please fill in all fields');

    const data = new FormData();
    data.append('pinataMetadata', JSON.stringify({ name }));
    data.append('pinataContent', JSON.stringify({ name, description, image: fileUrl }));

    const json = JSON.stringify({ name, description, image: fileUrl });

    try {
      console.log(1);

      const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', json, {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      });

      console.log(2);

      const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      console.log('url: ', url);

      console.log(3);

      await createSale(url, price);

      console.log(4);

      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUnsoldProperties = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider); // we are using providers here because we are fetching all the NFTs, not just the ones that belong to a user

    const data = await contract.fetchUnsoldProperties();

    console.log(data);
  };

  return (
    <RealEstateContext.Provider value={{ currency, connectWallet, currentAccount, uploadToIPFS, createNFT, fetchUnsoldProperties }}>
      {children}
    </RealEstateContext.Provider>
  );
};
