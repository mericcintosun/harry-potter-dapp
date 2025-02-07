// scripts/DeployAll.sol
pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../src/NFT_FixedSupply.sol";
import "../src/Marketplace.sol";

contract DeployAll is Script {
    function run() external {
        //network and owner (of the contract)'s cut (%2.5 f.e) read from the environment file.
        string memory network = vm.envString("NETWORK");

        //10000 comes down to %1
        uint256 ownerCutPerMillion = vm.envUint("OWNER_CUT_PER_MILLION");
        address acceptedToken = address(0); // Use native currency

        //start deployment
        vm.startBroadcast();

        //we should deploy all the NFT collections here, for now just leaving a placeholder of a single collection.
        //NFT collection1 = new NFT("Collection1", "C1");
        //console.log("Collection1 deployed at:", address(collection1));

        //deploy the marketplace.
        Marketplace marketplace = new Marketplace(ownerCutPerMillion);
        console.log("Marketplace deployed at:", address(marketplace));

        vm.stopBroadcast();
    }
}