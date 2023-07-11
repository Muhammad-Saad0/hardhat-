const { expect } = require("chai");
const { ethers } = require("hardhat");

// describe("RealEstate", function () {
//   let realEstate, escrow, deployer;
//   let nftID = 1;

//   beforeEach(async () => {
//     //GETTING EVERYONE WHO SIGNS THE CONTRACT
//     const accounts = await ethers.getSigners();
//     //FIRST SIGNER IS THE DEPLOYER
//     deployer = accounts[0];
//     seller = deployer;
//     // HARDHAT SIMULATES THE REAL BLOCKCHAIN AND GIVES US
//     // MULTIPLES SIGNERS FOR TESTING
//     buyer = accounts[1];
//     const RealEstate =
//       await ethers.getContractFactory(
//         "RealEstate"
//       );
//     const Escrow =
//       await ethers.getContractFactory("Escrow");
//     realEstate = await RealEstate.deploy();
//     escrow = await Escrow.deploy(
//       realEstate.address,
//       nftID,
//       seller.address,
//       buyer.address
//     );
//     const transaction = await realEstate
//       .connect(seller)
//       .approve(escrow.address, nftID);
//     await transaction.wait();
//   });

//   it("should have minted an NFT", async function () {
//     // OWNER OF THE NFT WITH ID 1 (THAT WILL BE OUT DEPLOYER)
//     const owner = await realEstate.ownerOf(1);
//     expect(owner).to.equal(
//       await deployer.getAddress()
//     );
//   });

//   describe("Transfer", () => {
//     it("Transfer an NFT", async () => {
//       await escrow.connect(buyer)
//       const owner = await realEstate.ownerOf(1);
//       expect(owner).to.equal(
//         await buyer.getAddress()
//       );
//     });
//   });
// });

const priceInEther = (purchasePriceEther) => {
  const purchasePriceWei =
    ethers.utils.parseEther(
      purchasePriceEther.toString()
    );
  return purchasePriceWei;
};

describe("Real Estate", () => {
  let realEstate,
    escrow,
    accounts,
    deployer,
    seller,
    buyer,
    inspector;
  //THE ID OF FIRST NFT WILL BE 1
  let nftID = 1;
  beforeEach(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    seller = deployer;
    buyer = accounts[1];
    inspector = accounts[2];
    const RealEstate =
      ethers.getContractFactory("RealEstate");
    realEstate = await (
      await RealEstate
    ).deploy();
    const Escrow =
      await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.address,
      nftID,
      seller.address,
      buyer.address,
      priceInEther(100),
      priceInEther(20),
      inspector.address
    );
    //WE ARE CONNECTING THE SELLER WHO OWNS THE NFT IN
    //REALESTATE CONTRACT AND APPROVES THE ESCROW CONTRACT
    //TO TRANSFER THAT NFT
    await realEstate
      .connect(seller)
      .approve(escrow.address, nftID);
  });

  describe("Deployment", () => {
    it("mints an nft successfully", async () => {
      const owner = await realEstate.ownerOf(
        nftID
      );
      expect(owner).to.equal(deployer.address);
    });
  });

  describe("Transfer", () => {
    it("Transfers an NFT", async () => {
      await escrow
        .connect(buyer)
        .finalizeTransaction();
      const owner = await realEstate.ownerOf(
        nftID
      );
      expect(owner).to.equal(buyer.address);
    });

    it("Sending the down payment", async () => {
      await escrow
        .connect(buyer)
        .payEscrowAmount({
          value: priceInEther(20),
        });
      const balance =
        await ethers.provider.getBalance(
          escrow.address
        );
      const balanceInEther =
        ethers.utils.formatEther(balance);
      expect(parseInt(balanceInEther)).to.equal(
        20
      );
    });
  });
});
