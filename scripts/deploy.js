
const hre = require('hardhat');

async function main() {
  const RealEstateMarketplace = await hre.ethers.getContractFactory('RealEstateMarketplace');
  const realEstateMarketplace = await RealEstateMarketplace.deploy();

  await realEstateMarketplace.deployed();

  console.log('Real Estate Marketplace deployed to:', realEstateMarketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
