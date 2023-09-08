// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// internal & private view & pure functions
// external & public view & pure functions

import { Counters } from "@openzeppelin/contracts/utils/Counters.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import { console } from "hardhat/console.sol";

/**
    * @title RealEstateMarketplace
    * @dev This contract allows users to create and list properties for sale, and allows other users to purchase those properties.
    * @author Michael Koch
    * Improvements to make once tutorial is done:
    * 1. Add a function that allows users to upload a property, but not list it for sale.
    * 2. Do we really need the sold variable? I don't think so.
 */

contract RealEstateMarketplace is ERC721URIStorage {
    error RealEstateMarketplace__MustBeOwner();
    error RealEstateMarketplace__GreaterThanZero();
    error RealEstateMarketplace__ValueMustEqualListingPrice();
    error RealEstateMarketplace__MatchAskingPrice();


    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _propertiesSold; // should be properties listed for sale

    uint256 listingPrice = 0.025 ether; // this is what someone pays for listing a property on website. I think that this will be the initial price of the property. So it is not always going to be 0.025 ether

    address payable owner;

    mapping(uint256 => Property) private idToProperty;

    struct Property {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event PropertyListed (
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    modifier MustBeOwner(address user) {
        if (owner != user) {
            revert RealEstateMarketplace__MustBeOwner();
        }
        _;
    }

    modifier GreaterThanZero(uint256 amount) {
        if (amount <= 0) {
            revert RealEstateMarketplace__GreaterThanZero();
        }
        _;
    } 

    modifier ValueMustEqualListingPrice() {
        if (msg.value != listingPrice) {
            revert RealEstateMarketplace__ValueMustEqualListingPrice();
        }
        _;
    }

    modifier MatchAskingPrice(uint256 amount) {
        if (msg.value != amount) {
            revert RealEstateMarketplace__MatchAskingPrice();
        }
        _;
    }

    constructor() ERC721("NFT Estates", "NEST") {
        owner = payable(msg.sender);
    }

    function updateListingPrice(uint256 _listingPrice) public payable MustBeOwner(msg.sender) {
        listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns(uint256) {
        return listingPrice;
    }

    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        listNewProperty(newTokenId, price);

        return newTokenId;
    }

    // for this function, I believe we want the ability for user to upload a property, but not list it for sale. This function assumes that owner wants to sell property. Well come back to this
    function listNewProperty(uint256 tokenId, uint256 price) private GreaterThanZero(price) ValueMustEqualListingPrice {
        idToProperty[tokenId] = Property(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId); // Contract needs to be owner to sell property for previous owner. 

        emit PropertyListed(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    function resellToken(uint256 tokenId, uint256 price) public payable GreaterThanZero(price) ValueMustEqualListingPrice {
        if (idToProperty[tokenId].owner != msg.sender) {
            revert RealEstateMarketplace__MustBeOwner();
        }

        idToProperty[tokenId].price = price;
        idToProperty[tokenId].seller = payable(msg.sender);
        idToProperty[tokenId].owner = payable(address(this));
        idToProperty[tokenId].sold = false;

        _propertiesSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    function createPropertySale(uint256 tokenId) public payable MatchAskingPrice(idToProperty[tokenId].price) {
        idToProperty[tokenId].owner = payable(msg.sender);
        idToProperty[tokenId].seller = payable(address(0));
        idToProperty[tokenId].sold = true;

        _propertiesSold.increment(); 

        _transfer(address(this), msg.sender, tokenId);

        payable(owner).transfer(listingPrice); 
        payable(idToProperty[tokenId].seller).transfer(msg.value); 
    }

    // get all market items still listed and not sold
    function fetchUnsoldProperties() public view returns(Property[] memory) {
        uint256 propertyCount = _tokenIds.current();
        uint256 unsoldPropertyCount = _tokenIds.current() - _propertiesSold.current();
        uint256 currentIndex;

        Property[] memory unsoldProperties = new Property[](unsoldPropertyCount);

        for (uint256 i = 1; i <= propertyCount; i++) {
            if(idToProperty[i].owner == address(this)) {
                unsoldProperties[currentIndex] = idToProperty[i];
                currentIndex += 1;
            }
        }

        return unsoldProperties;
    }

    function fetchMyProperties() public view returns (Property[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 currentIndex = 0;

        Property[] memory myProperties = new Property[](getMyNumberOfProperties());

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToProperty[i].owner == msg.sender) {
                myProperties[currentIndex] = idToProperty[i];
                currentIndex += 1;
            }
        }

        return myProperties;
    }

    function fetchMyListedProperties() public view returns (Property[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 currentIndex = 0;

        Property[] memory myListedProperties = new Property[](getMyNumberOfListedProperties());

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToProperty[i].seller == msg.sender) {
                myListedProperties[currentIndex] = idToProperty[i];
                currentIndex += 1;
            }
        }

        return myListedProperties;
    }

    function getMyNumberOfProperties() private view returns (uint256) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;

        for (uint256 i = 1; i <= totalItemCount; i++) { 
            if (idToProperty[i].owner == msg.sender) {
                itemCount += 1;
            }
        }

        return itemCount;
    }

    function getMyNumberOfListedProperties() private view returns (uint256) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToProperty[i].seller == msg.sender) {
                itemCount += 1;
            }
        }

        return itemCount;
    }

}