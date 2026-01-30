import { expect } from "chai";
import { ethers } from "hardhat";

describe("LoomXLending", function () {

  async function deployFixture() {
    const [admin, borrower] = await ethers.getSigners();

    const LoomXLending = await ethers.getContractFactory("LoomXLending");
    const lending = await LoomXLending.deploy();
    await lending.waitForDeployment();

    return { lending, admin, borrower };
  }

  it("should allow user to request a loan", async function () {
    const { lending, borrower } = await deployFixture();

    await lending.connect(borrower).requestLoan(
      ethers.parseEther("1"),
      30
    );

    const loan = await lending.loans(borrower.address);

    expect(loan.loanAmount).to.equal(ethers.parseEther("1"));
    expect(loan.approved).to.equal(false);
    expect(loan.repaid).to.equal(false);
  });

  it("should allow admin to approve loan", async function () {
    const { lending, admin, borrower } = await deployFixture();

    await lending.connect(borrower).requestLoan(
      ethers.parseEther("1"),
      30
    );

    await lending.connect(admin).approveLoan(
      borrower.address,
      ethers.parseEther("0.1")
    );

    const loan = await lending.loans(borrower.address);

    expect(loan.approved).to.equal(true);
    expect(loan.interest).to.equal(ethers.parseEther("0.1"));
  });

  it("should allow borrower to repay loan", async function () {
    const { lending, admin, borrower } = await deployFixture();

    await lending.connect(borrower).requestLoan(
      ethers.parseEther("1"),
      30
    );

    await lending.connect(admin).approveLoan(
      borrower.address,
      ethers.parseEther("0.1")
    );

    await lending.connect(borrower).repayLoan({
      value: ethers.parseEther("1.1"),
    });

    const loan = await lending.loans(borrower.address);
    expect(loan.repaid).to.equal(true);
  });

  it("should reject non-admin approval", async function () {
    const { lending, borrower } = await deployFixture();

    await lending.connect(borrower).requestLoan(
      ethers.parseEther("1"),
      30
    );

    await expect(
      lending.connect(borrower).approveLoan(
        borrower.address,
        ethers.parseEther("0.1")
      )
    ).to.be.revertedWith("Not authorized");
  });
});
