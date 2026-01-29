// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoomXLending {

    // Loan structure
    struct Loan {
        address borrower;
        uint loanAmount;
        uint interest;
        uint dueDate;
        bool approved;
        bool repaid;
    }

    // Store loans using borrower address
    mapping(address => Loan) public loans;

    // Events (for frontend & logs)
    event LoanRequested(address borrower, uint amount);
    event LoanApproved(address borrower, uint amount);
    event LoanRejected(address borrower);
    event LoanRepaid(address borrower, uint amount);

    // Request a loan (called after AI prediction)
    function requestLoan(
        uint _amount,
        uint _interest,
        uint _durationInDays,
        uint _creditScore
    ) public {

        // Check AI credit score
        require(_creditScore == 1, "Loan Rejected: Bad Credit Score");

        // Create loan
        loans[msg.sender] = Loan({
            borrower: msg.sender,
            loanAmount: _amount,
            interest: _interest,
            dueDate: block.timestamp + (_durationInDays * 1 days),
            approved: true,
            repaid: false
        });

        emit LoanApproved(msg.sender, _amount);
    }

    // Repay loan
    function repayLoan() public payable {
        Loan storage loan = loans[msg.sender];

        require(loan.approved, "Loan not approved");
        require(!loan.repaid, "Loan already repaid");
        require(msg.value >= loan.loanAmount + loan.interest, "Insufficient repayment");

        loan.repaid = true;

        emit LoanRepaid(msg.sender, msg.value);
    }

    // View loan details
    function getLoanDetails(address _borrower)
        public
        view
        returns (
            uint amount,
            uint interest,
            uint dueDate,
            bool approved,
            bool repaid
        )
    {
        Loan memory loan = loans[_borrower];
        return (
            loan.loanAmount,
            loan.interest,
            loan.dueDate,
            loan.approved,
            loan.repaid
        );
    }
}
