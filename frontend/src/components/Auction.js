'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';

const AUCTION_ITEMS = [
  {
    id: 1,
    name: "Rare Hogwarts Collection #1",
    image: "/images/nft1.png",
    currentBid: 0.5,
    endTime: "2024-03-10T15:00:00",
  },
  {
    id: 2,
    name: "Epic Wizarding World #2",
    image: "/images/nft2.png",
    currentBid: 1.2,
    endTime: "2024-03-11T18:00:00",
  },
  {
    id: 3,
    name: "Legendary Magic Item #3",
    image: "/images/nft3.png",
    currentBid: 2.0,
    endTime: "2024-03-12T20:00:00",
  },
];

export default function Auction({ isWalletConnected }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBid = (item) => {
    if (!isWalletConnected) {
      toast.error('Please connect your wallet first!');
      return;
    }

    // Implement bidding logic here
    console.log(`Bidding ${bidAmount} ETH on ${item.name}`);
  };

  const formatDate = (dateString) => {
    if (!mounted) return ''; // Return empty string during SSR
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      {/* Lumos Maxima Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-accent mb-4 tracking-tight">
            Public Auction
          </h2>
          <p className="text-silver text-lg">
            Bid on rare magical artifacts and collectibles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AUCTION_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="bg-dark/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl"
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                <div className="relative w-full h-64">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-accent mb-2">{item.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-silver">Current Bid</span>
                  <span className="text-accent font-bold">{item.currentBid} ETH</span>
                </div>
                
                {isWalletConnected && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Enter bid amount"
                        className="flex-1 rounded-md bg-primary/50 border border-secondary/50 px-3 py-2 text-silver focus:outline-none focus:ring-2 focus:ring-accent"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBid(item)}
                        className="px-4 py-2 bg-accent text-primary font-semibold rounded-md hover:bg-accent/90 transition-colors"
                      >
                        Bid
                      </motion.button>
                    </div>
                  </div>
                )}

                <div className="mt-4 text-sm text-silver">
                  <span>Ends in: </span>
                  {mounted && (
                    <span className="font-medium">
                      {formatDate(item.endTime)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gavel Animation */}
        <motion.div
          initial={{ rotate: -45 }}
          animate={{ rotate: 0 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1,
            ease: "easeInOut",
          }}
          className="absolute -right-20 top-0 opacity-20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-40 h-40 text-accent"
          >
            <path d="M12 2L2 12l10 10 10-10L12 2zm0 18.17L3.83 12 12 3.83 20.17 12 12 20.17z" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
} 