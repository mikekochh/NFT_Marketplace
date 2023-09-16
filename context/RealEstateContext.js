import { FormatTypes } from 'ethers/lib/utils';
import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import FormData from 'form-data';

import { MarketAddress, MarketAddressAbi } from './constants';

const fetchContract = (signerOrProvider) => (new ethers.Contract(MarketAddress, MarketAddressAbi, signerOrProvider)); // address from when we deployed the contract

export const RealEstateContext = React.createContext();

export const RealEstateProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const currency = 'ETH';

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) { return alert('Please install MetaMask!'); }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length && currentAccount !== accounts[0]) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('Wallet not connected');
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

    console.log('last id check: ', id);

    const transaction = isReselling ? await contract.relistProperty(id, url, price, { value: listingPrice.toString() }) : await contract.createToken(url, price, { value: listingPrice.toString() });

    await transaction.wait(); // waiting for metamask to confirm the transaction
  };

  const delistProperty = async (tokenId, router) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    console.log('before');
    console.log('contract', contract);

    console.log('tokenId', tokenId);

    const transaction = await contract.delistProperty(tokenId);

    console.log('after');

    await transaction.wait();

    router.push('/my-properties');
  };

  const createPropertySale = async (tokenId, formInputPrice, router) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');

    const contract = fetchContract(signer);

    const transaction = await contract.createPropertySale(tokenId, { value: price });

    await transaction.wait();

    router.push('/my-properties');
  };

  const listProperty = async (formInput, fileUrl, router, relistOrList) => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return alert('Please fill in all fields');

    const relist = relistOrList === 'relist';

    try {
      const json = JSON.stringify({ name, description, image: fileUrl });
      const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', json, {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          'Content-Type': 'application/json',
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;

      console.log('tokenId', formInput.tokenId);

      await createSale(url, price, relist, formInput.tokenId);

      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUnsoldProperties = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider); // we are using providers here because we are fetching all the NFTs, not just the ones that belong to a user

    const data = await contract.fetchUnsoldProperties();

    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));

    return items;
  };

  const fetchMyProperties = async (type) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const data = type === 'listed' ? await contract.fetchMyListedProperties() : await contract.fetchMyPurchasedProperties();

    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));

    return items;
  };

  return (
    <RealEstateContext.Provider value={{
      currency,
      connectWallet,
      currentAccount,
      uploadToIPFS,
      listProperty,
      fetchUnsoldProperties,
      fetchMyProperties,
      createPropertySale,
      delistProperty }}
    >
      {children}
    </RealEstateContext.Provider>
  );
};
