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

    //https://blog.finxter.com/solidity-by-example-part-12-simple-open-auction/
    //doing the test scenario from here.
    function test_scenarioFirst() public {
        address payable BENEFICIARY_TEST_SCENARIO_1 = payable(address(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
        address ACCOUNT_01_TEST_SCENARIO_1 = address(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);
        address ACCOUNT_02_TEST_SCENARIO_1 = address(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db);
        address ACCOUNT_03_TEST_SCENARIO_1 = address(0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB);
        address ACCOUNT_04_TEST_SCENARIO_1 = address(0x617F2E2fD72FD9D5503197092aC168c91465E7f2);

        auction = new Auction(240, BENEFICIARY_TEST_SCENARIO_1);

        vm.deal(ACCOUNT_01_TEST_SCENARIO_1, 100 wei);
        vm.deal(ACCOUNT_02_TEST_SCENARIO_1, 100 wei);
        vm.deal(ACCOUNT_03_TEST_SCENARIO_1, 100 wei);
        vm.deal(ACCOUNT_04_TEST_SCENARIO_1, 100 wei);
        uint initialBalance_BENEFICIARY_TEST_SCENARIO_1 = address(BENEFICIARY_TEST_SCENARIO_1).balance;

        //Account 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 bids 10 Wei;
        vm.prank(ACCOUNT_01_TEST_SCENARIO_1);
        auction.bid{value: 10 wei}();

        //Account 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db bids 25 Wei;
        vm.prank(ACCOUNT_02_TEST_SCENARIO_1);
        auction.bid{value: 25 wei}();

        //Account 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB bids 25 Wei (rejected);
        vm.prank(ACCOUNT_03_TEST_SCENARIO_1);
        vm.expectRevert(abi.encodeWithSelector(Auction.BidNotHighEnough.selector, 25 wei));
        auction.bid{value: 25 wei}();

        //Account 0x617F2E2fD72FD9D5503197092aC168c91465E7f2 bids 35 Wei;
        vm.prank(ACCOUNT_04_TEST_SCENARIO_1);
        auction.bid{value: 35 wei}();

        //Account 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 bids 40 Wei + initiates premature auction end;
        vm.prank(ACCOUNT_01_TEST_SCENARIO_1);
        auction.bid{value: 40 wei}();

        //premature end, should fail.
        vm.warp(block.timestamp + 120 seconds);
        vm.prank(ACCOUNT_01_TEST_SCENARIO_1);
        vm.expectRevert(Auction.AuctionNotYetEnded.selector);
        auction.auctionEnd();

        //Account 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 withdraws his bids;
        vm.prank(ACCOUNT_01_TEST_SCENARIO_1);
        auction.withdraw();

        //Account 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db withdraws his bids;
        vm.prank(ACCOUNT_02_TEST_SCENARIO_1);
        auction.withdraw();

        //Account 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB withdraws his bids;
        vm.prank(ACCOUNT_03_TEST_SCENARIO_1);
        auction.withdraw();

        //Account 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB initiates timely auction end;
        vm.warp(block.timestamp + 241 seconds);
        vm.prank(ACCOUNT_03_TEST_SCENARIO_1);
        auction.auctionEnd();

        //Account 0x617F2E2fD72FD9D5503197092aC168c91465E7f2 withdraws his bids;
        vm.prank(ACCOUNT_04_TEST_SCENARIO_1);
        auction.withdraw();


                                       // *** BALANCE CHECKS *** //
        //at the end account 2,3,4 should all have the starting balance of 100 wei, while account 1 should have 60 wei.
        //beneficiary should be up 40 wei compared to the starting point.

        //account 2,3,4
        assertEq(ACCOUNT_02_TEST_SCENARIO_1.balance, 100 wei);
        assertEq(ACCOUNT_03_TEST_SCENARIO_1.balance, 100 wei);
        assertEq(ACCOUNT_04_TEST_SCENARIO_1.balance, 100 wei);

        //account 1
        assertEq(ACCOUNT_01_TEST_SCENARIO_1.balance, 60 wei);

        //beneficiary
        uint endBalance_BENEFICIARY_TEST_SCENARIO_1 = address(BENEFICIARY_TEST_SCENARIO_1).balance;
        assertEq(initialBalance_BENEFICIARY_TEST_SCENARIO_1 + 40 wei, endBalance_BENEFICIARY_TEST_SCENARIO_1);
    }
}

