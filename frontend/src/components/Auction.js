"use client"

import { useState, useEffect, Fragment } from "react"
import { ethers } from "ethers"
import { Dialog, Transition } from "@headlessui/react"

const CONTRACT_ADDRESS = "0xYourDeployedContractAddress" // Replace with actual contract address
const ABI = [
  {
    inputs: [],
    name: "getHighestBid",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getHighestBidder",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "auctionEnd",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBidHistory",
    outputs: [
      { internalType: "address[]", name: "", type: "address[]" },
      { internalType: "uint256[]", name: "", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
]

const AUCTION_ITEMS = [
  {
    id: 1,
    name: "Rare Hogwarts Collection #1",
    image: "/images/nft1.png",
    endTime: Date.now() + 86400000, // 24 hours from now
  },
  {
    id: 2,
    name: "Epic Wizarding World #2",
    image: "/images/nft2.png",
    endTime: Date.now() + 172800000, // 48 hours from now
  },
  {
    id: 3,
    name: "Legendary Magic Item #3",
    image: "/images/nft3.png",
    endTime: Date.now() + 259200000, // 72 hours from now
  },
]

export default function Auction({ isWalletConnected, walletAddress }) {
  const [highestBid, setHighestBid] = useState("0")
  const [highestBidder, setHighestBidder] = useState("")
  const [bidAmount, setBidAmount] = useState("")
  const [isBidding, setIsBidding] = useState(false)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAuctionItem, setSelectedAuctionItem] = useState(null)
  const [bidHistory, setBidHistory] = useState([])
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const setupContract = async () => {
      if (typeof window.ethereum === "undefined") {
        console.error("No Ethereum provider found. Please install MetaMask!")
        return
      }

      try {
        const newProvider = new ethers.BrowserProvider(window.ethereum)
        const newSigner = await newProvider.getSigner()
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, newSigner)

        setProvider(newProvider)
        setSigner(newSigner)
        setContract(newContract)

        await fetchAuctionDetails(newContract)
      } catch (error) {
        console.error("Error setting up contract:", error)
      }
    }

    setupContract()
  }, [])

  useEffect(() => {
    if (selectedAuctionItem) {
      const timer = setInterval(() => {
        const now = Date.now()
        const difference = selectedAuctionItem.endTime - now

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          })
        } else {
          clearInterval(timer)
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [selectedAuctionItem])

  const fetchAuctionDetails = async (contractInstance) => {
    if (!contractInstance) return

    try {
      const bid = await contractInstance.getHighestBid()
      const bidder = await contractInstance.getHighestBidder()
      setHighestBid(ethers.formatEther(bid))
      setHighestBidder(bidder)

      const [bidders, amounts] = await contractInstance.getBidHistory()
      const history = bidders.map((bidder, index) => ({
        bidder,
        amount: ethers.formatEther(amounts[index]),
        timestamp: Date.now() - index * 600000, // Mock timestamps
      }))
      setBidHistory(history)
    } catch (error) {
      console.error("Error fetching auction details:", error)
    }
  }

  const handleBid = async () => {
    if (!isWalletConnected) {
      alert("Please connect your wallet first!")
      return
    }

    if (!contract) {
      alert("Contract not found!")
      return
    }

    if (isBidding) {
      alert("Bid is already in progress. Please wait!")
      return
    }

    setIsBidding(true)

    try {
      const tx = await contract.bid({ value: ethers.parseEther(bidAmount) })
      await tx.wait()
      alert("Bid placed successfully!")
      fetchAuctionDetails(contract)
      setBidAmount("")
    } catch (error) {
      console.error("Error placing bid:", error)
      alert("Transaction failed!")
    } finally {
      setIsBidding(false)
    }
  }

  const handleWithdraw = async () => {
    if (!contract) return

    try {
      const tx = await contract.withdraw()
      await tx.wait()
      alert("Withdrawal successful!")
      fetchAuctionDetails(contract)
    } catch (error) {
      console.error("Error withdrawing funds:", error)
      alert("Withdrawal failed!")
    }
  }

  const increaseBid = () => {
    const currentBid = Number.parseFloat(bidAmount) || Number.parseFloat(highestBid)
    setBidAmount((currentBid * 1.1).toFixed(4))
  }

  const decreaseBid = () => {
    const currentBid = Number.parseFloat(bidAmount) || Number.parseFloat(highestBid)
    setBidAmount((currentBid * 0.9).toFixed(4))
  }

  return (
    <div style={styles.auctionContainer}>
      <h2 style={styles.title}>Magical NFT Auction</h2>
      <p style={styles.subtitle}>Bid on exclusive magical artifacts from the Wizarding World</p>

      <div style={styles.auctionGrid}>
        {AUCTION_ITEMS.map((item) => (
          <div
            key={item.id}
            style={styles.auctionItem}
            onClick={() => {
              setSelectedAuctionItem(item)
              setIsOpen(true)
            }}
          >
            <img src={item.image || "/placeholder.svg"} alt={item.name} style={styles.auctionImage} />
            <h3 style={styles.auctionName}>{item.name}</h3>
          </div>
        ))}
      </div>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} style={styles.modal}>
          <div style={styles.modalOverlay} />
          <div style={styles.modalContainer}>
            <Dialog.Panel style={styles.modalContent}>
              {selectedAuctionItem && (
                <>
                  <img
                    src={selectedAuctionItem.image || "/placeholder.svg"}
                    alt={selectedAuctionItem.name}
                    style={styles.modalImage}
                  />
                  <h3 style={styles.modalTitle}>{selectedAuctionItem.name}</h3>
                  <div style={styles.countdownTimer}>
                    <div style={styles.countdownItem}>
                      <span style={styles.countdownValue}>{timeLeft.days}</span>
                      <span style={styles.countdownLabel}>days</span>
                    </div>
                    <div style={styles.countdownItem}>
                      <span style={styles.countdownValue}>{timeLeft.hours}</span>
                      <span style={styles.countdownLabel}>hours</span>
                    </div>
                    <div style={styles.countdownItem}>
                      <span style={styles.countdownValue}>{timeLeft.minutes}</span>
                      <span style={styles.countdownLabel}>minutes</span>
                    </div>
                    <div style={styles.countdownItem}>
                      <span style={styles.countdownValue}>{timeLeft.seconds}</span>
                      <span style={styles.countdownLabel}>seconds</span>
                    </div>
                  </div>
                  <p style={styles.highestBid}>
                    Highest Bid: <span style={styles.bidAmount}>{highestBid} ETH</span>
                  </p>
                  <p style={styles.highestBidder}>
                    by {highestBidder.slice(0, 6)}...{highestBidder.slice(-4)}
                  </p>

                  <div style={styles.bidInputContainer}>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="Enter bid amount (ETH)"
                      style={styles.bidInput}
                    />
                    <button onClick={decreaseBid} style={styles.bidAdjustButton}>
                      -
                    </button>
                    <button onClick={increaseBid} style={styles.bidAdjustButton}>
                      +
                    </button>
                  </div>

                  <button onClick={handleBid} disabled={isBidding} style={styles.bidButton}>
                    {isBidding ? "Placing Bid..." : "Place Bid"}
                  </button>

                  <h4 style={styles.bidHistoryTitle}>Bid History</h4>
                  <ul style={styles.bidHistory}>
                    {bidHistory.map((bid, index) => (
                      <li key={index} style={styles.bidHistoryItem}>
                        <span style={styles.bidAmount}>{bid.amount} ETH</span> by {bid.bidder.slice(0, 6)}...
                        {bid.bidder.slice(-4)} - {new Date(bid.timestamp).toLocaleString()}
                      </li>
                    ))}
                  </ul>

                  <button onClick={() => setIsOpen(false)} style={styles.closeButton}>
                    Close
                  </button>
                </>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

const styles = {
  auctionContainer: {
    padding: "2rem",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    minHeight: "100vh",
    color: "#e2e8f0",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "#f0a500",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.2rem",
    textAlign: "center",
    marginBottom: "2rem",
  },
  auctionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  auctionItem: {
    backgroundColor: "rgba(22, 33, 62, 0.7)",
    borderRadius: "0.5rem",
    padding: "1rem",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  auctionImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "0.25rem",
    marginBottom: "1rem",
  },
  auctionName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#f0a500",
  },
  modal: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  modalContainer: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: "500px",
    padding: "1rem",
  },
  modalContent: {
    backgroundColor: "#16213e",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
  },
  modalImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderRadius: "0.25rem",
    marginBottom: "1rem",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#f0a500",
    marginBottom: "1rem",
  },
  countdownTimer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
    backgroundColor: "rgba(240, 165, 0, 0.1)",
    padding: "1rem",
    borderRadius: "0.5rem",
  },
  countdownItem: {
    textAlign: "center",
  },
  countdownValue: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#f0a500",
    display: "block",
  },
  countdownLabel: {
    fontSize: "0.8rem",
    textTransform: "uppercase",
  },
  highestBid: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
  },
  bidAmount: {
    fontWeight: "bold",
    color: "#f0a500",
  },
  highestBidder: {
    fontSize: "0.9rem",
    color: "#a0aec0",
    marginBottom: "1rem",
  },
  bidInputContainer: {
    display: "flex",
    marginBottom: "1rem",
  },
  bidInput: {
    flexGrow: 1,
    padding: "0.5rem",
    border: "1px solid #f0a500",
    borderRadius: "0.25rem",
    backgroundColor: "rgba(22, 33, 62, 0.7)",
    color: "#e2e8f0",
  },
  bidAdjustButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f0a500",
    color: "#16213e",
    border: "none",
    borderRadius: "0.25rem",
    marginLeft: "0.5rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  bidButton: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#f0a500",
    color: "#16213e",
    border: "none",
    borderRadius: "0.25rem",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  bidHistoryTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
  },
  bidHistory: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    maxHeight: "200px",
    overflowY: "auto",
  },
  bidHistoryItem: {
    padding: "0.5rem 0",
    borderBottom: "1px solid rgba(240, 165, 0, 0.2)",
  },
  closeButton: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#e53e3e",
    color: "#fff",
    border: "none",
    borderRadius: "0.25rem",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "1rem",
  },
}

