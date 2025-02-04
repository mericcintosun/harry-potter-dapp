'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const getImagePath = (index) => {
  const jpgPath = `/images/nft${index}.jpg`;
  const pngPath = `/images/nft${index}.png`;
  
  // 24. NFT için jpg, diğerleri için png kullan
  return index === 24 ? jpgPath : pngPath;
};

// Sabit NFT verileri
const DUMMY_NFTS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `Harry Potter NFT #${i + 1}`,
  collection: ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'][i % 4],
  price: ((i + 1) * 0.1).toFixed(2),
  image: getImagePath(i + 1),
  rarity: ['Legendary', 'Epic', 'Rare'][i % 3],
}));

const RARITY_COLORS = {
  Legendary: 'text-yellow-400',
  Epic: 'text-purple-400',
  Rare: 'text-blue-400',
};

export default function NFTGrid({ isWalletConnected }) {
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const collections = ['all', 'Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];
  const rarities = ['all', 'Legendary', 'Epic', 'Rare'];

  const filteredNFTs = DUMMY_NFTS.filter(nft => {
    if (selectedCollection !== 'all' && nft.collection !== selectedCollection) return false;
    if (selectedRarity !== 'all' && nft.rarity !== selectedRarity) return false;
    return true;
  });

  if (!mounted) {
    return null;
  }

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

        <AnimatePresence>
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
                  <div className="relative w-full h-64">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                    />
                  </div>
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
        </AnimatePresence>
      </div>
    </section>
  );
} 