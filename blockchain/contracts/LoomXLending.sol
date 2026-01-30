// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LoomXLending {

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct Loan {
        uint loanAmount;
        uint interest;
        uint dueDate;
        bool approved;
        bool repaid;
    }

    mapping(address => Loan) public loans;

    event LoanRequested(address indexed borrower, uint amount);
    event LoanApproved(address indexed borrower, uint amount);
    event LoanRepaid(address indexed borrower, uint amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    // STEP 1: User requests loan (NO approval here)
    function requestLoan(uint _amount, uint _durationInDays) external {
        require(loans[msg.sender].loanAmount == 0, "Existing loan");

        loans[msg.sender] = Loan({
            loanAmount: _amount,
            interest: 0,
            dueDate: block.timestamp + (_durationInDays * 1 days),
            approved: false,
            repaid: false
        });

        emit LoanRequested(msg.sender, _amount);
    }

    // STEP 2: Backend approves loan (after AI check)
    function approveLoan(
        address _borrower,
        uint _interest
    ) external onlyAdmin {
        Loan storage loan = loans[_borrower];
        require(!loan.approved, "Already approved");

        loan.interest = _interest;
        loan.approved = true;

        emit LoanApproved(_borrower, loan.loanAmount);
    }

    // STEP 3: Repay
    function repayLoan() external payable {
        Loan storage loan = loans[msg.sender];

        require(loan.approved, "Not approved");
        require(!loan.repaid, "Already repaid");
        require(
            msg.value >= loan.loanAmount + loan.interest,
            "Insufficient amount"
        );

        loan.repaid = true;

        emit LoanRepaid(msg.sender, msg.value);
    }

    function getLoan(address user) external view returns (Loan memory) {
        return loans[user];
    }
}
