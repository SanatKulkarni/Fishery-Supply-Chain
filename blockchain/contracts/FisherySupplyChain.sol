// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FisherySupplyChain {
    // Enum for participant roles
    enum Role { Fisherman, Processor, Distributor, Retailer, Consumer }

    // Struct for fish data
    struct Fish {
        uint id;
        string species;
        string catchLocation;
        uint weight;
        address currentOwner;
        uint[] transactionIds;
    }

    // Struct for transaction data
    struct Transaction {
        uint id;
        address from;
        address to;
        string transactionType;
        string details;
        uint timestamp;
    }

    // State variables
    mapping(address => Role) public participants;
    mapping(uint => Fish) public fishes;
    mapping(uint => Transaction) public transactions;
    uint private fishCounter;
    uint private transactionCounter;

    // Events
    event ParticipantRegistered(address indexed participant, Role role);
    event FishAdded(uint indexed fishId, string species, address owner);
    event FishTransferred(uint indexed fishId, address from, address to, string transactionType);
    event FishProcessed(uint indexed fishId, address processor, string details);

    // Modifiers
    modifier onlyRole(Role role) {
        require(participants[msg.sender] == role, "Caller does not have the required role");
        _;
    }

    modifier fishExists(uint fishId) {
        require(fishes[fishId].id != 0, "Fish does not exist");
        _;
    }

    modifier onlyOwner(uint fishId) {
        require(fishes[fishId].currentOwner == msg.sender, "Caller is not the fish owner");
        _;
    }

    // Functions
    function registerParticipant(Role role) public {
        require(participants[msg.sender] == Role(0), "Address already registered");
        participants[msg.sender] = role;
        emit ParticipantRegistered(msg.sender, role);
    }

    function addFish(
        string memory species,
        string memory catchLocation,
        uint weight
    ) public onlyRole(Role.Fisherman) {
        require(bytes(species).length > 0, "Species cannot be empty");
        require(bytes(catchLocation).length > 0, "Catch location cannot be empty");
        require(weight > 0, "Weight must be greater than 0");

        fishCounter++;
        uint[] memory newTransactionIds = new uint[](0);

        fishes[fishCounter] = Fish({
            id: fishCounter,
            species: species,
            catchLocation: catchLocation,
            weight: weight,
            currentOwner: msg.sender,
            transactionIds: newTransactionIds
        });

        // Record initial transaction
        _addTransaction(fishCounter, address(0), msg.sender, "caught", "Initial catch");

        emit FishAdded(fishCounter, species, msg.sender);
    }

    function transferFish(
        uint fishId,
        address to,
        string memory transactionType,
        string memory details
    ) public fishExists(fishId) onlyOwner(fishId) {
        require(to != address(0), "Invalid recipient address");
        require(to != msg.sender, "Cannot transfer to self");
        require(bytes(transactionType).length > 0, "Transaction type cannot be empty");

        address previousOwner = fishes[fishId].currentOwner;
        fishes[fishId].currentOwner = to;

        _addTransaction(fishId, previousOwner, to, transactionType, details);

        emit FishTransferred(fishId, previousOwner, to, transactionType);
    }

    function processFish(
        uint fishId,
        string memory details
    ) public fishExists(fishId) onlyRole(Role.Processor) onlyOwner(fishId) {
        require(bytes(details).length > 0, "Processing details cannot be empty");

        _addTransaction(fishId, msg.sender, msg.sender, "processed", details);

        emit FishProcessed(fishId, msg.sender, details);
    }

    function getFish(uint fishId) public view fishExists(fishId) returns (Fish memory) {
        return fishes[fishId];
    }

    function getFishHistory(uint fishId) public view fishExists(fishId) returns (Transaction[] memory) {
        uint[] memory txIds = fishes[fishId].transactionIds;
        Transaction[] memory history = new Transaction[](txIds.length);

        for (uint i = 0; i < txIds.length; i++) {
            history[i] = transactions[txIds[i]];
        }

        return history;
    }

    // Internal function to add transaction
    function _addTransaction(
        uint fishId,
        address from,
        address to,
        string memory transactionType,
        string memory details
    ) internal {
        transactionCounter++;

        transactions[transactionCounter] = Transaction({
            id: transactionCounter,
            from: from,
            to: to,
            transactionType: transactionType,
            details: details,
            timestamp: block.timestamp
        });

        fishes[fishId].transactionIds.push(transactionCounter);
    }
}