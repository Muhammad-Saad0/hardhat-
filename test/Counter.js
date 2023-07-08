const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", () => {
  let counter;

  //TO AVOID SAME CODE
  beforeEach(async () => {
    const Counter =
      await ethers.getContractFactory("Counter");
    //WHILE DEPLOYING WE WILL GIVE IT CONSTRUCTOR ARGUEMENTS
    counter = await Counter.deploy(
      "My Counter",
      1
    );
  });

  describe("Deployment", () => {
    it("stores the count", async () => {
      const count = await counter.getCount();
      expect(count).to.equal(1);
    });

    it("stores the name", async () => {
      const name = await counter.getName();
      expect(name).to.equal("My Counter");
    });
  });

  describe("Counting", () => {
    it("increments the count", async () => {
      await counter.increment();
      expect(await counter.getCount()).to.equal(
        2
      );
    });

    it("decrements under 0 is reverted", async () => {
      await counter.decrement();
      await expect(counter.decrement()).to.be
        .reverted;
    });
  });

  describe("Setting", () => {
    it("sets the name", async () => {
      await counter.setName("Moh Saad");
      expect(await counter.getName()).to.equal(
        "Moh Saad"
      );
    });
  });
});
