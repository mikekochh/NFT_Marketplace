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

contract RealEstateMarketplace is ERC721URIStorage {
    error RealEstateMarketplace__MustBeOwner();
    error RealEstateMarketplace__GreaterThanZero();
    error RealEstateMarketplace__ValueMustEqualListingPrice();

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.025 ether; // this is what someone pays for listing a property on website

    address payable owner;

    mapping(uint256 => Property) private idToProperty;

    struct Property {
        uint256 tokenId;
        address payable owner;
        uint256 price;
    }

    event PropertyListed (
        uint256 indexed tokenId,
        address owner,
        uint256 price
    );

    modifier MustBeOwner(address user) {
        if (owner != user) {
            revert RealEstateMarketplace__MustBeOwner();
        }
    }

    modifier GreaterThanZero(uint256 amount) {
        if (amount <= 0) {
            revert RealEstateMarketplace__GreaterThanZero();
        }
    } 

    constructor() {
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

    function listNewProperty(uint256 tokenId, uint256 price) private GreaterThanZero(price) {
        if (msg.value != listingPrice) {
            revert RealEstateMarketplace__ValueMustEqualListingPrice();
        }

        idToProperty[tokenId] = Property(
            tokenId,
            payable(msg.sender),
            price
        );

        _transfer(msg.sender, address(this), tokenId); // I don't understand why ownership of token is transferred to this contract yet

        emit PropertyListed(
            tokenId,
            msg.sender,
            price
        );
    }

}