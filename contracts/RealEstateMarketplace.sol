// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import { Counters } from "@openzeppelin/contracts/utils/Counters.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import { console } from "hardhat/console.sol";

contract RealEstateMarketplace is ERC721URIStorage {
    error RealEstateMarketplace__MustBeOwner();
    error RealEstateMarketplace__GreaterThanZero();
    error RealEstateMarketplace__ValueMustEqualListingPrice();
    error RealEstateMarketplace__MatchAskingPrice();


    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _propertiesSold; 

    uint256 s_listingPrice = 0.025 ether; 

    address payable s_owner;

    mapping(uint256 => Property) private s_idToProperty;

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
        if (s_owner != user) {
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
        if (msg.value != s_listingPrice) {
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
        s_owner = payable(msg.sender);
    }

    function updateListingPrice(uint256 _listingPrice) public payable MustBeOwner(msg.sender) {
        s_listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns(uint256) {
        return s_listingPrice;
    }

    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        listNewProperty(newTokenId, price);

        return newTokenId;
    }

    function listNewProperty(uint256 tokenId, uint256 price) private GreaterThanZero(price) ValueMustEqualListingPrice {
        s_idToProperty[tokenId] = Property(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId); 

        emit PropertyListed(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    function resellToken(uint256 tokenId, uint256 price) public payable GreaterThanZero(price) ValueMustEqualListingPrice {
        if (s_idToProperty[tokenId].owner != msg.sender) {
            revert RealEstateMarketplace__MustBeOwner();
        }

        s_idToProperty[tokenId].price = price;
        s_idToProperty[tokenId].seller = payable(msg.sender);
        s_idToProperty[tokenId].owner = payable(address(this));
        s_idToProperty[tokenId].sold = false;

        _propertiesSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    function createPropertySale(uint256 tokenId) public payable MatchAskingPrice(s_idToProperty[tokenId].price) {
        s_idToProperty[tokenId].owner = payable(msg.sender);
        s_idToProperty[tokenId].seller = payable(address(0));
        s_idToProperty[tokenId].sold = true;

        _propertiesSold.increment(); 

        _transfer(address(this), msg.sender, tokenId);

        payable(s_owner).transfer(s_listingPrice); 
        payable(s_idToProperty[tokenId].seller).transfer(msg.value); 
    }

    // get all market items still listed and not sold
    function fetchUnsoldProperties() public view returns(Property[] memory) {
        uint256 propertyCount = _tokenIds.current();
        uint256 unsoldPropertyCount = _tokenIds.current() - _propertiesSold.current();
        uint256 currentIndex;

        Property[] memory unsoldProperties = new Property[](unsoldPropertyCount);

        for (uint256 i = 1; i <= propertyCount; i++) {
            if(s_idToProperty[i].owner == address(this)) {
                unsoldProperties[currentIndex] = s_idToProperty[i];
                currentIndex += 1;
            }
        }

        return unsoldProperties;
    }

    function fetchMyPurchasedProperties() public view returns (Property[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 currentIndex = 0;

        Property[] memory myProperties = new Property[](getMyNumberOfPurchasedProperties());

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (s_idToProperty[i].owner == msg.sender) {
                myProperties[currentIndex] = s_idToProperty[i];
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
            if (s_idToProperty[i].seller == msg.sender) {
                myListedProperties[currentIndex] = s_idToProperty[i];
                currentIndex += 1;
            }
        }

        return myListedProperties;
    }

    function getMyNumberOfPurchasedProperties() private view returns (uint256) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;

        for (uint256 i = 1; i <= totalItemCount; i++) { 
            if (s_idToProperty[i].owner == msg.sender) {
                itemCount += 1;
            }
        }

        return itemCount;
    }

    function getMyNumberOfListedProperties() private view returns (uint256) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (s_idToProperty[i].seller == msg.sender) {
                itemCount += 1;
            }
        }

        return itemCount;
    }


    /////////////////////////
    ///// Getter Methods ////
    ///////////////////////// 
    
    function getOwner() external view returns (address) {
        return s_owner;
    } 


}