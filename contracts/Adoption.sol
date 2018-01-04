pragma solidity ^0.4.17;

contract Adoption {
    address[16] public adopters;

    function adopt(uint id) public returns (uint) {
        require(id >= 0 && id < 16);

        adopters[id] = msg.sender;

        return id;
    }

    function getAdopters() public view returns (address[16]) {
        return adopters;
    }
}
