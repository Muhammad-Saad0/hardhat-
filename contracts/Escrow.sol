// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Escrow {
    uint256 public nftID;
    address public nftAddress;
    uint256 public purchasePrice;
    uint256 public escrowPrice;
    address payable public seller;
    address payable public buyer;
    address public inspector;

    constructor(
        address _nftAddress,
        uint256 _nftID,
        address payable _seller,
        address payable _buyer,
        uint256 _purchasePrice,
        uint256 _escrowPrice,
        address _inspector
    ) {
        nftID = _nftID;
        nftAddress = _nftAddress;
        seller = _seller;
        buyer = _buyer;
        purchasePrice = _purchasePrice;
        escrowPrice = _escrowPrice;
        inspector = _inspector;
    }

    function payEscrowAmount() public payable{
        require(msg.sender == buyer);
    }

    function finalizeTransaction() public payable {
        IERC721 nft = IERC721(nftAddress);
        nft.transferFrom(seller, buyer, nftID);
    }
}
