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
    address public lender;
    bool private isInspected;

    mapping(address => bool) approve;

    constructor(
        address _nftAddress,
        uint256 _nftID,
        address payable _seller,
        address payable _buyer,
        uint256 _purchasePrice,
        uint256 _escrowPrice,
        address _inspector,
        address _lender
    ) {
        nftID = _nftID;
        nftAddress = _nftAddress;
        seller = _seller;
        buyer = _buyer;
        purchasePrice = _purchasePrice;
        escrowPrice = _escrowPrice;
        inspector = _inspector;
        lender = _lender;
    }

    modifier OnlyBuyer() {
        require(msg.sender == buyer, "Only Buyer can Call this Method");
        _;
    }

    modifier OnlyLender() {
        require(msg.sender == lender, "Only lender can Call this Method");
        _;
    }

    function approveSale() public {
        approve[msg.sender] = true;
    }

    function setInspection(bool setInspected) public {
        require(msg.sender == inspector);
        isInspected = setInspected;
    }

    function payRemainingAmount() public payable OnlyLender {
        require(msg.value == (purchasePrice - escrowPrice));
    }

    function payEscrowAmount() public payable OnlyBuyer {
        require(msg.value == escrowPrice);
    }

    receive() external payable {}

    function finalizeTransaction() public payable {
        require(isInspected);
        require(approve[lender] && approve[buyer] && approve[seller]);
        require(address(this).balance == purchasePrice);

        (bool success, ) = payable(seller).call{value: address(this).balance}(
            ""
        );
        require(success);

        IERC721 nft = IERC721(nftAddress);
        nft.transferFrom(seller, buyer, nftID);
    }
}
