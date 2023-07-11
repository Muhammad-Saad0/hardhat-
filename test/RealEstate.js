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
    lender,
    inspector;
  //THE ID OF FIRST NFT WILL BE 1
  let nftID = 1;
  beforeEach(async () => {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    seller = deployer;
    buyer = accounts[1];
    inspector = accounts[2];
    lender = accounts[3];
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
      inspector.address,
      lender.address
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
    it("Running the complete scenario", async () => {
      await escrow
        .connect(lender)
        .payRemainingAmount({
          value: priceInEther(80),
        });

      console.log("Lender lends the money");
      await escrow
        .connect(buyer)
        .payEscrowAmount({
          value: priceInEther(20),
        });
      console.log("buyer adds the money");
      await escrow
        .connect(inspector)
        .setInspection(true);
      await escrow.connect(buyer).approveSale();
      await escrow.connect(lender).approveSale();
      await escrow.connect(seller).approveSale();

      await escrow.finalizeTransaction();

      const buyerBalance =
        await ethers.provider.getBalance(
          buyer.address
        );

      const lenderBalance =
        await ethers.provider.getBalance(
          lender.address
        );

      const sellerBalance =
        await ethers.provider.getBalance(
          seller.address
        );

      expect(
        parseInt(
          ethers.utils.formatEther(buyerBalance)
        )
      ).to.below(9980);

      expect(
        parseInt(
          ethers.utils.formatEther(lenderBalance)
        )
      ).to.below(9920);

      expect(
        parseFloat(
          ethers.utils.formatEther(sellerBalance)
        )
      ).to.above(10099);
    });
  });
});
