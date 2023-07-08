const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", () => {
  it("stores the count", async () => {
    const Counter =
      await ethers.getContractFactory("Counter");
    //WHILE DEPLOYING WE WILL GIVE IT CONSTRUCTOR ARGUEMENTS
    const counter = await Counter.deploy(
      "My Counter",
      1
    );
    await counter.increment();
    const count = await counter.getCount();
    expect(count).to.equal(2);
  });
});
