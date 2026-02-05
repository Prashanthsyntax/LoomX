import { expect } from "chai";
import { ethers } from "hardhat";
import { LoomXLending } from "../typechain-types";

describe("LoomXLending Contract", function () {
  let lending: LoomXLending;
  let admin: any;
  let borrower: any;

  async function deployFixture() {
    [admin, borrower] = await ethers.getSigners();

    const LoomXLendingFactory = await ethers.getContractFactory("LoomXLending");
    const lendingInstance = await LoomXLendingFactory.deploy();
    await lendingInstance.waitForDeployment();

    return { lendingInstance };
  }

  beforeEach(async () => {
    const fixture = await deployFixture();
    lending = fixture.lendingInstance;
  });

  it("should allow borrower to request a loan", async () => {
    const amount = ethers.parseEther("1");
    const duration = 30; // 30 days

    await lending.connect(borrower).requestLoan(amount, duration);

    const loan = await lending.getLoan(borrower.address);
    expect(loan.amount).to.equal(amount);
    expect(loan.approved).to.equal(false);
    expect(loan.repaid).to.equal(false);
  });

  it("should allow admin to approve a loan", async () => {
    const amount = ethers.parseEther("1");
    const interest = ethers.parseEther("0.1");
    await lending.connect(borrower).requestLoan(amount, 30);

    await lending.connect(admin).approveLoan(borrower.address, interest);

    const loan = await lending.getLoan(borrower.address);
    expect(loan.approved).to.equal(true);
    expect(loan.interest).to.equal(interest);
  });

  it("should allow borrower to repay the loan", async () => {
    const amount = ethers.parseEther("1");
    const interest = ethers.parseEther("0.1");
    await lending.connect(borrower).requestLoan(amount, 30);
    await lending.connect(admin).approveLoan(borrower.address, interest);

    await lending.connect(borrower).repayLoan({ value: amount + interest });

    const loan = await lending.getLoan(borrower.address);
    expect(loan.repaid).to.equal(true);
  });

  it("should reject non-admin from approving loans", async () => {
    const amount = ethers.parseEther("1");
    const interest = ethers.parseEther("0.1");
    await lending.connect(borrower).requestLoan(amount, 30);

    await expect(
      lending.connect(borrower).approveLoan(borrower.address, interest)
    ).to.be.revertedWith("Not authorized");
  });

  it("should reject repayment if not approved", async () => {
    const amount = ethers.parseEther("1");
    await lending.connect(borrower).requestLoan(amount, 30);

    await expect(
      lending.connect(borrower).repayLoan({ value: amount })
    ).to.be.revertedWith("Loan not approved");
  });
});
