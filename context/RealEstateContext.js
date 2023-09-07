import { FormatTypes } from 'ethers/lib/utils';
import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

import { MarketAddress, MarketAddressAbi } from './constants';

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
    const projectId = '2V2vAmc5cvXm85Qe68gp5kpd5eQ';
    const projectSecretKey = '1466dc2cf451ec5583a9b56bd0c04e81';
    // const projectId = process.env.REACT_APP_PROJECT_ID;
    // const projectSecretKey = process.env.REACT_APP_PROJECT_SECRET_KEY;
    // console.log('projectId: ', projectId);
    // console.log('projectSecretKey: ', projectSecretKey);

    const authorization = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString('base64')}`;

    console.log(file[0]);
    console.log('authorization: ', authorization);

    try {
      const ipfs = ipfsHttpClient({
        url: 'https://ipfs.infura.io:5001/api/v0',
        headers: {
          authorization,
        },
      });

      const result = await ipfs.add(file[0]);

      console.log('result: ', result);

      console.log('ipfs.get(result.path): ', ipfs.get(result.path));

      // return ipfs.get(result.path);

      return `https://real-estate-marketplace.infura-ipfs.io/${result.path}`;
    } catch (e) {
      console.log('There was an error uploading to IPFS: ', e);
    }
  };

  // const uploadToIPFS = async (file) => {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   // 'https://ipfs.infura.io:5001/api/v0/add'

  //   const { data } = await axios.post('http://127.0.0.1:5001/api/v0/', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });

  //   return `https://ipfs.infura.io/ipfs/${data.Hash}`;
  // };

  return (
    <RealEstateContext.Provider value={{ currency, connectWallet, currentAccount, uploadToIPFS }}>
      {children}
    </RealEstateContext.Provider>
  );
};
