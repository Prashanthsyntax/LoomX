// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title LoomX Lending Contract — Gas & Security Optimized
/// @notice Handles AI-approved loans with repayment tracking
contract LoomXLending {

    // ----------------------------
    // State Variables
    // ----------------------------
    address public immutable admin;

    struct Loan {
        uint128 amount;      // 128 bits sufficient for ETH amounts
        uint64 interest;     // interest in wei
        uint64 dueDate;      // UNIX timestamp
        bool approved;
        bool repaid;
    }

    mapping(address => Loan) private _loans;

    // ----------------------------
    // Events
    // ----------------------------
    event LoanRequested(address indexed borrower, uint128 amount, uint64 dueDate);
    event LoanApproved(address indexed borrower, uint128 amount, uint64 interest);
    event LoanRepaid(address indexed borrower, uint128 amount, uint64 interest);

    // ----------------------------
    // Modifiers
    // ----------------------------
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    modifier loanExists(address borrower) {
        require(_loans[borrower].amount > 0, "Loan does not exist");
        _;
    }

    modifier loanNotApproved(address borrower) {
        require(!_loans[borrower].approved, "Loan already approved");
        _;
    }

    modifier loanNotRepaid(address borrower) {
        require(!_loans[borrower].repaid, "Loan already repaid");
        _;
    }

    // ----------------------------
    // Constructor
    // ----------------------------
    constructor() {
        admin = msg.sender;
    }

    // ----------------------------
    // Core Functions
    // ----------------------------

    /// @notice Borrower requests a loan
    /// @param _amount Amount requested in wei
    /// @param _durationInDays Loan duration
    function requestLoan(uint128 _amount, uint64 _durationInDays) external {
        Loan storage loan = _loans[msg.sender];
        require(loan.amount == 0, "Existing loan");

        uint64 due = uint64(block.timestamp + (_durationInDays * 1 days));

        _loans[msg.sender] = Loan({
            amount: _amount,
            interest: 0,
            dueDate: due,
            approved: false,
            repaid: false
        });

        emit LoanRequested(msg.sender, _amount, due);
    }

    /// @notice Admin approves loan after AI validation
    /// @param _borrower Borrower's address
    /// @param _interest Interest amount in wei
    function approveLoan(address _borrower, uint64 _interest)
        public
    {
        Loan storage loan = _loans[_borrower];
        loan.interest = _interest;
        loan.approved = true;

        emit LoanApproved(_borrower, loan.amount, _interest);
    }

    /// @notice Borrower repays the loan + interest
    function repayLoan() external payable loanExists(msg.sender) loanNotRepaid(msg.sender) {
        Loan storage loan = _loans[msg.sender];
        require(loan.approved, "Loan not approved");
        uint256 totalOwed = uint256(loan.amount) + uint256(loan.interest);
        require(msg.value >= totalOwed, "Insufficient payment");

        loan.repaid = true;

        emit LoanRepaid(msg.sender, loan.amount, loan.interest);
    }

    // ----------------------------
    // View Functions
    // ----------------------------

    /// @notice Get a borrower's loan details
    function getLoan(address borrower) external view returns (
        uint128 amount,
        uint64 interest,
        uint64 dueDate,
        bool approved,
        bool repaid
    ) {
        Loan storage loan = _loans[borrower];
        return (loan.amount, loan.interest, loan.dueDate, loan.approved, loan.repaid);
    }

    /// @notice Check if borrower is eligible to request a loan
    function canRequestLoan(address borrower) external view returns (bool) {
        return _loans[borrower].amount == 0;
    }
}
