// const { expect } = require("chai");

// describe("Real Estate", () => {
//   let RealEstate, Escrow;

//   beforeEach(async () => {
//     const realEstate =
//       await ethers.getContractFactory(
//         "RealEstate"
//       );
//     const escrow =
//       await ethers.getContractFactory("Escrow");
//     RealEstate = await realEstate.deploy();
//     Escrow = await escrow.deploy();
//   });

//   describe("Deployment", async () => {});
// });

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealEstate", function () {
  let realEstate;

  beforeEach(async function () {
    const RealEstate =
      await ethers.getContractFactory(
        "RealEstate"
      );
    realEstate = await RealEstate.deploy();
    await realEstate.deployed();
  });

  it("should have minted an NFT", async function () {
    // Check the owner of the token
    const owner = await realEstate.ownerOf(1);
    expect(owner).to.equal(
      await (
        await ethers.getSigner()
      ).getAddress()
    );
  });
});
