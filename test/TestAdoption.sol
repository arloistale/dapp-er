pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    function testAdoption() public {
        uint returnedId = adoption.adopt(4);

        Assert.equal(returnedId, 4, "Unexpected return id");
    }

    function testGetAdopter() public {
        address existing = adoption.adopters(4);

        Assert.equal(this, existing, "Unexpected adopters from get");
    }

    function testGetAdoptersArrayGetter() public {
        address[16] memory adopters = adoption.getAdopters();

        Assert.equal(this, adopters[4], "Unexpected adopters from array getter");
    }
}
