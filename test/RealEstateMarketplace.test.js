// Import required libraries
const { expect } = require('chai');
const { ethers } = require('hardhat');

// Describe the contract and its tests
describe('RealEstateMarketplace', () => {
  let contract;
  let owner;
  let user;
  let user2;

  const propertyPrice = ethers.utils.parseEther('100');

  beforeEach(async () => {
    // Deploy the contract before each test
    [owner, user, user2] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory('RealEstateMarketplace');
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it('should set the owner correctly', async () => {
    expect(await contract.getOwner()).to.equal(owner.address);
  });

  it('should update listing price', async () => {
    const newListingPrice = ethers.utils.parseEther('0.05');
    await contract.updateListingPrice(newListingPrice);

    expect(await contract.getListingPrice()).to.equal(newListingPrice);
  });

  it('should not allow non-owner to update listing price', async () => {
    const newListingPrice = ethers.utils.parseEther('0.05');
    await expect(contract.connect(user).updateListingPrice(newListingPrice)).to.be.revertedWith('RealEstateMarketplace__MustBeOwner');
  });

  it('should get listing price', async () => {
    expect(await contract.getListingPrice()).to.equal(ethers.utils.parseEther('0.025'));
  });

  it('should create a new property token', async () => {
    const transaction = await contract.createToken('tokenURI', propertyPrice, { value: ethers.utils.parseEther('0.025') });
    const receipt = await transaction.wait();
    const tokenId = receipt.events[0].args.tokenId.toNumber();
    expect(tokenId).to.be.gt(0);
  });

  it('seller should receive money upon sale', async () => {
    const transaction = await contract.connect(user).createToken('tokenURI', propertyPrice, { value: ethers.utils.parseEther('0.025') });
    const receipt = await transaction.wait();
    const tokenId = receipt.events[0].args.tokenId.toNumber();
    expect(tokenId).to.be.gt(0);

    const userBalanceBeforeSale = await ethers.provider.getBalance(user.address);
    const user2BalanceBeforeSale = await ethers.provider.getBalance(user2.address);

    const transactionSell = await contract.connect(user2).createPropertySale(tokenId, { value: propertyPrice });

    const userBalanceAfterSale = await ethers.provider.getBalance(user.address);
    const user2BalanceAfterSale = await ethers.provider.getBalance(user2.address);

    expect(userBalanceAfterSale).to.be.gt(userBalanceBeforeSale);
    expect(user2BalanceAfterSale).to.be.lt(user2BalanceBeforeSale);
  });
});
