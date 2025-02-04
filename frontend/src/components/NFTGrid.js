'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Sabit NFT verileri
const DUMMY_NFTS = [
  {
    id: 1,
    name: "Harry Potter NFT #1",
    collection: "Gryffindor",
    price: "0.15",
    image: "/images/nft1.png",
    rarity: "Legendary",
  },
  {
    id: 2,
    name: "Harry Potter NFT #2",
    collection: "Slytherin",
    price: "0.25",
    image: "/images/nft2.png",
    rarity: "Epic",
  },
  {
    id: 3,
    name: "Harry Potter NFT #3",
    collection: "Hufflepuff",
    price: "0.35",
    image: "/images/nft3.png",
    rarity: "Rare",
  },
  {
    id: 4,
    name: "Harry Potter NFT #4",
    collection: "Ravenclaw",
    price: "0.45",
    image: "/images/nft4.png",
    rarity: "Legendary",
  },
  {
    id: 5,
    name: "Harry Potter NFT #5",
    collection: "Gryffindor",
    price: "0.55",
    image: "/images/nft5.png",
    rarity: "Epic",
  },
  {
    id: 6,
    name: "Harry Potter NFT #6",
    collection: "Slytherin",
    price: "0.65",
    image: "/images/nft6.png",
    rarity: "Rare",
  },
  {
    id: 7,
    name: "Harry Potter NFT #7",
    collection: "Hufflepuff",
    price: "0.75",
    image: "/images/nft7.png",
    rarity: "Legendary",
  },
  {
    id: 8,
    name: "Harry Potter NFT #8",
    collection: "Ravenclaw",
    price: "0.85",
    image: "/images/nft8.png",
    rarity: "Epic",
  },
  {
    id: 9,
    name: "Harry Potter NFT #9",
    collection: "Gryffindor",
    price: "0.95",
    image: "/images/nft9.png",
    rarity: "Rare",
  },
  {
    id: 10,
    name: "Harry Potter NFT #10",
    collection: "Slytherin",
    price: "1.05",
    image: "/images/nft10.png",
    rarity: "Legendary",
  },
  {
    id: 11,
    name: "Harry Potter NFT #11",
    collection: "Hufflepuff",
    price: "1.15",
    image: "/images/nft11.png",
    rarity: "Epic",
  },
  {
    id: 12,
    name: "Harry Potter NFT #12",
    collection: "Ravenclaw",
    price: "1.25",
    image: "/images/nft12.png",
    rarity: "Rare",
  },
  {
    id: 13,
    name: "Harry Potter NFT #13",
    collection: "Gryffindor",
    price: "1.35",
    image: "/images/nft13.png",
    rarity: "Legendary",
  },
  {
    id: 14,
    name: "Harry Potter NFT #14",
    collection: "Slytherin",
    price: "1.45",
    image: "/images/nft14.png",
    rarity: "Epic",
  },
  {
    id: 15,
    name: "Harry Potter NFT #15",
    collection: "Hufflepuff",
    price: "1.55",
    image: "/images/nft15.png",
    rarity: "Rare",
  },
  {
    id: 16,
    name: "Harry Potter NFT #16",
    collection: "Ravenclaw",
    price: "1.65",
    image: "/images/nft16.png",
    rarity: "Legendary",
  },
  {
    id: 17,
    name: "Harry Potter NFT #17",
    collection: "Gryffindor",
    price: "1.75",
    image: "/images/nft17.png",
    rarity: "Epic",
  },
  {
    id: 18,
    name: "Harry Potter NFT #18",
    collection: "Slytherin",
    price: "1.85",
    image: "/images/nft18.png",
    rarity: "Rare",
  },
  {
    id: 19,
    name: "Harry Potter NFT #19",
    collection: "Hufflepuff",
    price: "1.95",
    image: "/images/nft19.png",
    rarity: "Legendary",
  },
  {
    id: 20,
    name: "Harry Potter NFT #20",
    collection: "Ravenclaw",
    price: "2.05",
    image: "/images/nft20.png",
    rarity: "Epic",
  },
  {
    id: 21,
    name: "Harry Potter NFT #21",
    collection: "Gryffindor",
    price: "2.15",
    image: "/images/nft21.png",
    rarity: "Rare",
  },
  {
    id: 22,
    name: "Harry Potter NFT #22",
    collection: "Slytherin",
    price: "2.25",
    image: "/images/nft22.png",
    rarity: "Legendary",
  },
  {
    id: 23,
    name: "Harry Potter NFT #23",
    collection: "Hufflepuff",
    price: "2.35",
    image: "/images/nft23.png",
    rarity: "Epic",
  },
];

const RARITY_COLORS = {
  Legendary: 'text-yellow-400',
  Epic: 'text-purple-400',
  Rare: 'text-blue-400',
};

export default function NFTGrid({ isWalletConnected }) {
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');

  const collections = ['all', 'Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];
  const rarities = ['all', 'Legendary', 'Epic', 'Rare'];

  const filteredNFTs = DUMMY_NFTS.filter(nft => {
    if (selectedCollection !== 'all' && nft.collection !== selectedCollection) return false;
    if (selectedRarity !== 'all' && nft.rarity !== selectedRarity) return false;
    return true;
  });

  return (
    <section id="marketplace" className="py-24 bg-primary relative overflow-hidden">
      {/* Sorting Hat Effect */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-accent sm:text-4xl mb-4 sm:mb-0">
            NFT Collection
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="block rounded-md border-0 py-1.5 pl-3 pr-10 bg-dark text-silver ring-1 ring-inset ring-secondary/50 focus:ring-2 focus:ring-accent sm:text-sm sm:leading-6"
            >
              {collections.map((collection) => (
                <option key={collection} value={collection}>
                  {collection.charAt(0).toUpperCase() + collection.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="block rounded-md border-0 py-1.5 pl-3 pr-10 bg-dark text-silver ring-1 ring-inset ring-secondary/50 focus:ring-2 focus:ring-accent sm:text-sm sm:leading-6"
            >
              {rarities.map((rarity) => (
                <option key={rarity} value={rarity}>
                  {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredNFTs.map((nft) => (
            <motion.div
              layout
              key={nft.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="group relative bg-dark/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl"
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                <Image
                  src={nft.image}
                  alt={nft.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-silver">
                    {nft.name}
                  </h3>
                  <span className={`text-sm font-medium ${RARITY_COLORS[nft.rarity]}`}>
                    {nft.rarity}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-accent">{nft.collection}</p>
                  <p className="text-sm font-medium text-silver">{nft.price} ETH</p>
                </div>
                {isWalletConnected && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-md bg-secondary py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  >
                    Buy Now
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 