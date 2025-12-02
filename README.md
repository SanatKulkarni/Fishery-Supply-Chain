# Fishery Supply Chain Management on Blockchain

This project is a **Fishery Supply Chain Management System** implemented on **Ethereum blockchain** using **Solidity** smart contracts. It allows tracking and managing fish products across different stages of the supply chain, ensuring transparency and accountability.

## Features

- **Participant Roles**: Supports multiple roles in the supply chain:
  - Fisherman
  - Processor
  - Distributor
  - Retailer
  - Consumer
- **Fish Tracking**: Each fish is represented as a digital asset with detailed information:
  - Species
  - Catch location
  - Weight
  - Current owner
  - Transaction history
- **Transactions**: Records all actions related to fish including:
  - Catching
  - Processing
  - Transfer between participants
- **Role Management**: Only the contract owner can assign or change participant roles.
- **Immutable History**: All fish-related transactions are stored on the blockchain for transparency.

## Smart Contract Details

- **Contract Name**: `FisherySupplyChain`
- **Solidity Version**: `^0.8.0`
- **Key Structs**:
  - `Fish` – stores fish details and transaction history
  - `Transaction` – stores transaction details for fish
- **Key Enums**:
  - `Role` – defines participant roles in the supply chain
- **Modifiers**:
  - `onlyRole(Role)` – restricts access based on role
  - `fishExists(uint)` – ensures fish exists
  - `onlyOwner(uint)` – ensures only the current owner can perform certain actions

## Key Functions

- `addFish()` – Fisherman adds a new fish to the system
- `transferFish()` – Transfer fish ownership to another participant
- `processFish()` – Processor updates fish processing details
- `getFish()` – View fish details
- `getFishHistory()` – Retrieve the complete transaction history of a fish
- `changeParticipantRole()` – Owner can change the role of participants

## Events

- `ParticipantRegistered` – emitted when a participant is registered or role is updated
- `FishAdded` – emitted when a new fish is added
- `FishTransferred` – emitted when fish ownership is transferred
- `FishProcessed` – emitted when fish is processed

## Frontend

The frontend is developed using **Next.js**, providing a user-friendly interface to interact with the smart contract.
