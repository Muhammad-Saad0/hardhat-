const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealEstate", function () {
  let realEstate, escrow, deployer;
  let nftID = 1;

  beforeEach(async () => {
    //GETTING EVERYONE WHO SIGNS THE CONTRACT
    const accounts = await ethers.getSigners();
    //FIRST SIGNER IS THE DEPLOYER
    deployer = accounts[0];
    seller = deployer;
    // HARDHAT SIMULATES THE REAL BLOCKCHAIN AND GIVES US
    // MULTIPLES SIGNERS FOR TESTING
    buyer = accounts[1];
    const RealEstate =
      await ethers.getContractFactory(
        "RealEstate"
      );
    const Escrow =
      await ethers.getContractFactory("Escrow");
    realEstate = await RealEstate.deploy();
    escrow = await Escrow.deploy(
      realEstate.address,
      nftID,
      seller.address,
      buyer.address
    );
    const transaction = await realEstate
      .connect(seller)
      .approve(escrow.address, nftID);
    await transaction.wait();
  });

  it("should have minted an NFT", async function () {
    // OWNER OF THE NFT WITH ID 1 (THAT WILL BE OUT DEPLOYER)
    const owner = await realEstate.ownerOf(1);
    expect(owner).to.equal(
      await deployer.getAddress()
    );
  });

  describe("Transfer", () => {
    it("Transfer an NFT", async () => {
      await escrow.transferNFT();
      const owner = await realEstate.ownerOf(1);
      expect(owner).to.equal(
        await buyer.getAddress()
      );
    });
  });
});
