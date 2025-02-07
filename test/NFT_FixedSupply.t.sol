// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "src/NFT_FixedSupply.sol";

contract NFTTest is Test {
    NFT private nft;
    address private owner = address(this);
    address private user = address(0x123);

    function setUp() public {
        nft = new NFT("MyNFT", "MNFT", 10, "ipfs://template");
    }

    function testMint() public {
        nft.mint(user);
        assertEq(nft.totalSupply(), 1);
        assertEq(nft.ownerOf(0), user);
        //user mints the nft, and we check if the nft belongs to user afterwards.
    }

    //based from: https://ethereum-blockchain-developer.com/2022-06-nft-truffle-hardhat-foundry/15-foundry-testing
    // .expectRevert(), expects the next line to fail, and ideally a non-user should not be able to mint.
    // vm.stopPrank(); is not used as expectRevert should already ensures that the call reverts.
    function testNftCreationWrongOwner() public {
        vm.prank(address(0x456));

        //vm.expectRevert("Ownable: caller is not the owner"); -> seems to be deprecated the one below should be used.
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, 0x456));

        nft.mint(address(0x456));
    }

    function testTotalSupply() public {
        assertEq(nft.totalSupply(), 0);
        nft.mint(user);
        assertEq(nft.totalSupply(), 1);
        //check if the total supply increases by 1 after the minting process.
    }

    /*
    function testTokenURI() {

    }
    */
}
