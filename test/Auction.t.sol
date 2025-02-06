// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Test, console} from "forge-std/Test.sol";
import {Auction} from "../src/Auction.sol";

contract TestAuction is Test {
    Auction public auction;

    uint256 public constant BIDDING_PERIOD = 5 days;
    address public constant BOB = address(1);
    address public constant ALICE = address(2);
    address payable public constant BENEFICIARY = payable(address(3));

    function setUp() public {
        auction = new Auction(BIDDING_PERIOD, BENEFICIARY);

        // vm.deal() Sets the balance of an address who to newBalance.
        // https://book.getfoundry.sh/cheatcodes/deal
        vm.deal(BOB, 50 ether);
        vm.deal(ALICE, 50 ether);
    }


    /*
    function test_onlyOwnerModifier() public {
        vm.warp(block.timestamp + 6 days);
        vm.prank(BOB);
        vm.expectRevert(Auction.Auction__OnlyOwnerCanCall.selector);
        auction.withdraw();
    }
    */


    function test_auctionEnded() public {
        vm.warp(block.timestamp + 5 days + 1 seconds);

        vm.prank(BOB);
        vm.expectRevert(Auction.AuctionAlreadyEnded.selector);
        auction.bid{value: 2 ether}();
    }

    function test_Withdraw() public {
        vm.warp(block.timestamp + 1 seconds);

        vm.prank(BOB);
        auction.bid{value: 10 ether}();
        vm.prank(ALICE);
        auction.bid{value: 15 ether}();
        assertEq(auction.getContractBalance(), 25 ether);

        //bob withdraws his bid after he has been overbid.
        vm.prank(BOB);
        bool withdrawal = auction.withdraw();

        ///check if withdraw went through,
        ///BOB has the initial ether of 50,
        ///and auction has 25-10 = 15 ether remaining.
        assertEq(withdrawal, true);
        assertEq(BOB.balance, 50 ether);
        assertEq(auction.getContractBalance(), 15 ether);
    }


    function test_Bidding() public {
        vm.prank(BOB);
        auction.bid{value: 10 ether}();

        vm.prank(ALICE);
        auction.bid{value: 15 ether}();

        vm.prank(BOB);
        auction.bid{value: 20 ether}();

        //bob's initial bid was overbid, so let's withdraw that so the calculation doesn't fail.
        //we probably should automatically withdraw pendingReturns if the user bids again after being overbid.
        vm.prank(BOB);
        auction.withdraw();

        assertEq(auction.getHighestBid(), 20 ether);
        assertEq(auction.getContractBalance(), 35 ether);
        assertEq(auction.getHighestBidder(), BOB);
        auction.getContractBalance();
    }

    function test_auctionEnd() public {
        vm.warp(block.timestamp + 5 days + 1 seconds);

        //save the initial values of owners balance and the highest bid.
        uint initialBalanceBeneficiary = address(BENEFICIARY).balance;
        uint bidHighest = auction.getHighestBid();

        //end auction
        auction.auctionEnd();

        uint endBalanceBeneficiary = BENEFICIARY.balance;

        //confirm the beneficiary (owner of the auction) got the highest bid.
        assertEq(endBalanceBeneficiary, initialBalanceBeneficiary + bidHighest);

        //check if variable ended was set to true as it should be.
        assertEq(auction.ended(), true);
    }
}
