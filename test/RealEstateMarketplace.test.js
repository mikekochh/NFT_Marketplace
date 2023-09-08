// Import required libraries
const { expect } = require('chai');
const { ethers } = require('hardhat');

// Describe the contract and its tests
describe('RealEstateMarketplace', () => {
  let contract;
  let owner;
  let user;

  beforeEach(async () => {
    // Deploy the contract before each test
    [owner, user] = await ethers.getSigners();
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

  it('should create a new token', async () => {
    const tokenId = await contract.createToken('tokenURI', ethers.utils.parseEther('0.1'), { value: ethers.utils.parseEther('0.025') });
    expect(tokenId).to.be.gt(0);
  });

  /// /////////////////////////
  /// / bad tests /////////////
  /// /////////////////////////

  //   it('should create a token and list a property', async () => {
  //     const tokenId = await contract.createToken('tokenURI', ethers.utils.parseEther('0.03'));
  //     const property = await contract.idToProperty(tokenId);

  //     expect(property.tokenId).to.equal(tokenId);
  //     expect(property.seller).to.equal(owner.address);
  //     expect(property.owner).to.equal(contract.address);
  //     expect(property.price).to.equal(ethers.utils.parseEther('0.03'));
  //     expect(property.sold).to.be.false;
  //   });

  // Add more tests for other contract functions as needed
});
