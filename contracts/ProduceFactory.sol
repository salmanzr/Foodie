pragma solidity ^0.4.4;

contract ProduceFactory {

  // ------ Contract member variables ------

  struct Produce {
    uint    quantity;  // quantity of produce
    uint    date;      // harvest date (denoted in Epoch Time)
    address farmer;    // address of farmer
    string  qrCode;    // ipfs hash of qr code for produce
  }

  mapping (uint => mapping (address => string)) public competitionToParticipants; // competition id -> address of participant -> ipfs hash of a participant predictions
  Produce[] public produces;                                              // vector of all produces
  address[] public deliveries;                                            // all deliveries from warehouses
  uint numOfProduces;

  event ContractDeployed      (uint _produceId, address  _person, string  _hash, uint _time);
  event NewProduce            (uint _produceId, address  _person, string  _hash, uint _time);
  event NewAggregation        (uint _produceId, address  _person, string  _hash, uint _time);
  event NewFoodDelivery       (uint _produceId, address  _person, string  _hash, uint _time);

  // ------ Contract functions ------

  // Fallback function, allows this contract to receive ether.
  function () public payable {}

  // Constructor
  function ProduceFactory() {
      ContractDeployed(0, msg.sender,"", now);
   }

  // Function to create a new produce and add it to the list.
  function createProduce(string _qr, uint _date, uint _quantity) public payable returns (uint _produceId) {
    _produceId = produces.push(Produce(_quantity, _date, msg.sender, _qr)) - 1;
    numOfProduces = numOfProduces + 1;
    NewProduce(_produceId, msg.sender, _qr, now);
  }

  // Modifier that requires the produceId to be a valid/existing one.
  modifier produceIdCheck(uint _produceId) {
    //if (_produceId >= produces.length) throw;
    _;
  }

  // Function for participants to submit the IPFS hash of their prediction data for a specific competition.
  function submitIPFSHash(string _ipfsHash, uint _produceId) external produceIdCheck(_produceId) {
    competitionToParticipants[_produceId][msg.sender] = _ipfsHash;
    NewAggregation(_produceId, msg.sender, _ipfsHash, now);
  }

  // Function to execute the delivery of a produce.
  function executeDelivery(uint _produceId, address _warehouse) external produceIdCheck(_produceId) {
    //Produce storage myProduce = produces[_produceId];

    // Determine the receiver of a produce and transfer the quantity, but throw if transfer fails.
    //if (!myProduce.winner.send(myProduce.prize)) throw;

    // Update deliveries.
    //deliveries.push(myProduce.winner);        
    //NewFoodDelivery(_produceId, myProduce.winner, competitionToParticipants[_produceId][myProduce.winner], myProduce.quantity, now);
    NewAggregation(_produceId, msg.sender, produces[0].qrCode, now);
  }
  
  // Get the qr code of a produce.
  function getQRCode(uint _produceId) external produceIdCheck(_produceId) returns (string) {
    return produces[_produceId].qrCode;
  }

  // Get the harvest date.
  function getDate(uint _produceId) external produceIdCheck(_produceId) returns (uint) {
    return produces[_produceId].date;
  }

  // Get the quantity of a produce.
  function getQuantity(uint _produceId) external produceIdCheck(_produceId) returns (uint) {
    return produces[_produceId].quantity;
  }

  // Get the farmer of a produce.
  function getFarmer(uint _produceId) external produceIdCheck(_produceId) returns (address) {
    return produces[_produceId].farmer;
  }

  // Get a participant's ipfs hash for a competition.
  function getParticipantIPFSHash(uint _produceId, address _participantAddress) external produceIdCheck(_produceId) returns (string) {
    return competitionToParticipants[_produceId][_participantAddress];
  }

  // Get a produce by id.
  function getProduce(uint _produceId) external produceIdCheck(_produceId) returns (uint, uint) {
    Produce memory pro = produces[_produceId];
    return (pro.quantity, pro.date);
  }

  // Get the deliveries.
  function getDeliveries() external returns (address[]) {
    return deliveries;
  }

  // Get number of produces.
  function getNumOfProduces() external returns (uint) {
    return numOfProduces;
  }

  // Function to convert from an address to a string representation.
  function toAsciiString(address x) returns (string) {
    bytes memory s = new bytes(40);
    for (uint i = 0; i < 20; i++) {
        byte b = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        byte hi = byte(uint8(b) / 16);
        byte lo = byte(uint8(b) - 16 * uint8(hi));
        s[2*i] = char(hi);
        s[2*i+1] = char(lo);            
    }
    return string(s);
  }

  // Function to convert a byte into a char.
  function char(byte b) returns (byte c) {
    if (b < 10)
      return byte(uint8(b) + 0x30);    
    return byte(uint8(b) + 0x57);
  }

}