// SPDX-License-Identifier: GPL-3.0

// https://docs.soliditylang.org/en/latest/solidity-by-example.html#simple-open-auction
// auction solidity'nin sunduğu örnek, commentların ciddi miktarda temizlenmesi gerek.

// önemli not: "After the end of the bidding period, the contract has to be called manually
// for the beneficiary to receive their Ether - contracts cannot activate themselves."

pragma solidity ^0.8.4;
contract Auction {
    address payable public beneficiary; // Auction sahibi, highest bid'i alacak kişi.
    uint public auctionEndTime; // absolute unix timestamp

    // Current state of the auction.
    address public highestBidder;
    uint public highestBid;

    // Allowed withdrawals of previous bids
    mapping(address => uint) pendingReturns;

    //okunurluk açısından explicitly olarak false'a çekiyorum.
    bool public ended = false;

    // Events that will be emitted on changes.
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    /// The auction has already ended.
    error AuctionAlreadyEnded();
    /// There is already a higher or equal bid.
    error BidNotHighEnough(uint highestBid);
    /// The auction has not ended yet.
    error AuctionNotYetEnded();
    /// The function auctionEnd has already been called.
    error AuctionEndAlreadyCalled();

    // yeni bir auction açmak için gereken 2 parametre var:
    // 1: ne kadar süreceği (saniye cinsinden belirtiliyor), aşağıda biddingTime kullanılarak auctionEndTime hesaplanıyor.
    // 2: satıcının adresi (beneficiary)
    constructor(
        uint biddingTime,
        address payable beneficiaryAddress
    ) {
        beneficiary = beneficiaryAddress;
        auctionEndTime = block.timestamp + biddingTime;
    }


    function bid() external payable {

        // auction bitmiş.
        if (block.timestamp > auctionEndTime)
            revert AuctionAlreadyEnded();

        // fiyatı yükseltecek bir teklif konulmadı, iade ediyoruz.
        if (msg.value <= highestBid)
            revert BidNotHighEnough(highestBid);

        if (highestBid != 0) {
            // Sending back the Ether by simply using
            // highestBidder.send(highestBid) is a security risk
            // because it could execute an untrusted contract.
            // It is always safer to let the recipients
            // withdraw their Ether themselves.
            pendingReturns[highestBidder] += highestBid;
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    /// Withdraw a bid that was overbid.
    function withdraw() external returns (bool) {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `send` returns.
            pendingReturns[msg.sender] = 0;

            // msg.sender is not of type `address payable` and must be
            // explicitly converted using `payable(msg.sender)` in order
            // use the member function `send()`.

            /*
            // .send() fails every single time on the tests, still yet to solve the problem.
            if (!payable(msg.sender).send(amount)) {
                // No need to call throw here, just reset the amount owing
                pendingReturns[msg.sender] = amount;
                return false;
            }
            */
            (bool success, ) = payable(msg.sender).call{value: amount}("");
            if (!success) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    // auction bittiğinde bu fonksiyonu manuel olarak çağırmamız gerekecek.
    function auctionEnd() external {
        // It is a good guideline to structure functions that interact
        // with other contracts (i.e. they call functions or send Ether)
        // into three phases:
        // 1. checking conditions
        // 2. performing actions (potentially changing conditions)
        // 3. interacting with other contracts
        // If these phases are mixed up, the other contract could call
        // back into the current contract and modify the state or cause
        // effects (ether payout) to be performed multiple times.
        // If functions called internally include interaction with external
        // contracts, they also have to be considered interaction with
        // external contracts.

        // 1. Conditions
        if (block.timestamp < auctionEndTime)
            revert AuctionNotYetEnded();
        if (ended)
            revert AuctionEndAlreadyCalled();

        // 2. Effects
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        // 3. Interaction
        beneficiary.transfer(highestBid);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getHighestBid() public view returns (uint256) {
        return highestBid;
    }

    function getHighestBidder() public view returns (address) {
        return highestBidder;
    }
}