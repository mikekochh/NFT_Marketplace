import { FormatTypes } from 'ethers/lib/utils';
import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';

import { MarketAddress, MarketAddressAbi } from './constants';

export const RealEstateContext = React.createContext();

export const RealEstateProvider = ({ children }) => {
  const currency = 'BTC';

  return (
    <RealEstateContext.Provider value={{ currency }}>
      {children}
    </RealEstateContext.Provider>
  );
};
