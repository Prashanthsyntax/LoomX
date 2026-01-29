import { expect } from "chai";
import { ethers } from "hardhat";

describe("LoomXLending", function () {
  async function deployFixture() {
    const [owner, borrower] = await ethers.getSigners();

    const LoomXLending = await ethers.getContractFactory("LoomXLending");
    const lending = await LoomXLending.deploy();
    await lending.waitForDeployment();

    return { lending, owner, borrower };
  }

  it("should approve loan if credit score is good", async function () {
    const { lending, borrower } = await deployFixture();

    await (lending as any).connect(borrower).requestLoan(
      ethers.parseEther("1"),
      ethers.parseEther("0.1"),
      30,
      1
    );

    const loan = await (lending as any).loans(borrower.address);
    expect(loan[4]).to.equal(true); // approved
  });

  it("should reject loan if credit score is bad", async function () {
    const { lending, borrower } = await deployFixture();

    await expect(
      (lending as any).connect(borrower).requestLoan(
        ethers.parseEther("1"),
        ethers.parseEther("0.1"),
        30,
        0
      )
    ).to.be.revertedWith("Loan Rejected: Bad Credit Score");
  });

  it("should allow loan repayment", async function () {
    const { lending, borrower } = await deployFixture();

    await (lending as any).connect(borrower).requestLoan(
      ethers.parseEther("1"),
      ethers.parseEther("0.1"),
      30,
      1
    );

    await (lending as any).connect(borrower).repayLoan({
      value: ethers.parseEther("1.1"),
    });

    const loan = await (lending as any).loans(borrower.address);
    expect(loan[5]).to.equal(true); // repaid
  });
});
