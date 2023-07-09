// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Escrow {
    uint256 nftID;
    address nftAddress;
    address seller;
    address buyer;

    constructor(
        address _nftAddress,
        uint256 _nftID,
        address _seller,
        address _buyer
    ) {
        nftID = _nftID;
        nftAddress = _nftAddress;
        seller = _seller;
        buyer = _buyer;
    }

    function transferNFT() external {
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(nftID) == seller, "Not the owner of the NFT");
        nft.transferFrom(seller, buyer, nftID);
    }
}
