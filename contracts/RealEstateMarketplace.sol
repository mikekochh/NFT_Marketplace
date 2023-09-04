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

contract NFTMarketplace is ERC721URIStorage {
    error NFTMarketplace__MustBeOwner();

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.025 ether; // this is what someone pays for listing a property on website

    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold; // not sure if I need this
    }

    event MarketItemCreated (
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    modifier MustBeOwner(address user) {
        if (owner != user) {
            revert NFTMarketplace__MustBeOwner();
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

    function listNewProperty(uint256 tokenId, uint256 price) public {

    }

}