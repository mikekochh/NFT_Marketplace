import { FormatTypes } from 'ethers/lib/utils';
import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import FormData from 'form-data';

import { create as ipfsHttpClient } from 'ipfs-http-client';

import { MarketAddress, MarketAddressAbi } from './constants';

require('dotenv').config();

export const RealEstateContext = React.createContext();

const https = require('https');

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

  // Pinata
  const uploadToIPFS = async (file) => {
    console.log('file[0]:');
    console.log(file[0]);
    try {
      const data = new FormData();
      data.append('file', file[0]);
      data.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));
      data.append('pinataMetadata', JSON.stringify({ name: 'MyCustomName' }));

      console.log('JWT: ', process.env.REACT_APP_PINATA_JWT);

      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2MGUxNjhkZC1mZWJjLTQ0ZTktOWQ5OS1lNWY1MWVhMzAxMTMiLCJlbWFpbCI6Im1pY2hhZWxrb2NoNDQ0NEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNjM2N2M5YzM2ZWE3YjZkMDU4M2EiLCJzY29wZWRLZXlTZWNyZXQiOiIyNDlmYmUxMmNkY2Q4OWY0ODYxZWIzNDFjYTBhYzNjMGI2Njg1N2FjOTQ4NDNjOWRmYzQ5NDQzMzNhZWI0NDc0IiwiaWF0IjoxNjk0MTk4NTk5fQ._P-gaXW0okU940CMB69jo5MHB3YyX8l3H88wStpek28',
        },
      });
      console.log('res: ', res);
      console.log('View the file here: https://gateway.pinata.cloud/ipfs/', res.data.IpfsHash);
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      console.log(error);
    }
  };

  /// //////////////////////////
  // testing code /////////////
  /// //////////////////////////

  const uploadToIPFS4 = async (file) => {
    const projectId = '2V2vAmc5cvXm85Qe68gp5kpd5eQ';
    const projectSecretKey = '1466dc2cf451ec5583a9b56bd0c04e81';
    const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString('base64')}`;

    const res = await axios.post('https://ipfs.infura.io:5001/api/v0/add?pin=true&wrap-with-directory=true', file[0], { headers: { Authorization: auth } });

    console.log('res: ', res);
  };

  const uploadToIPFS3 = async (file) => {
    const projectId = '2V2vAmc5cvXm85Qe68gp5kpd5eQ';
    const projectSecretKey = '1466dc2cf451ec5583a9b56bd0c04e81';

    const options = {
      host: 'ipfs.infura.io',
      port: 5001,
      path: `/api/v0/add?arg=${file[0]}`,
      method: 'POST',
      auth: `${projectId}:${projectSecretKey}`,
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        console.log(body);
      });
    });
    req.end();
  };

  const uploadToIPFS2 = async (file) => {
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

  return (
    <RealEstateContext.Provider value={{ currency, connectWallet, currentAccount, uploadToIPFS }}>
      {children}
    </RealEstateContext.Provider>
  );
};
