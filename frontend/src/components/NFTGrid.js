'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const DUMMY_NFTS = [
  {
    id: 1,
    name: 'Harry Potter',
    collection: 'Gryffindor',
    price: '0.1',
    image: '/images/harry.jpg',
  },
  {
    id: 2,
    name: 'Hermione Granger',
    collection: 'Gryffindor',
    price: '0.15',
    image: '/images/hermione.jpg',
  },
  // Add more dummy NFTs here
];

export default function NFTGrid({ isWalletConnected }) {
  const [selectedCollection, setSelectedCollection] = useState('all');

  const collections = ['all', 'Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

  const filteredNFTs = selectedCollection === 'all'
    ? DUMMY_NFTS
    : DUMMY_NFTS.filter(nft => nft.collection === selectedCollection);

  return (
    <section id="marketplace" className="py-24 bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-accent sm:text-4xl">NFT Marketplace</h2>
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-accent sm:text-sm sm:leading-6"
            >
              {collections.map((collection) => (
                <option key={collection} value={collection}>
                  {collection.charAt(0).toUpperCase() + collection.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <motion.div
          layout
          className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredNFTs.map((nft) => (
            <motion.div
              layout
              key={nft.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="group relative"
            >
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm text-silver">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {nft.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-accent">{nft.collection}</p>
                </div>
                <p className="text-sm font-medium text-silver">{nft.price} ETH</p>
              </div>
              {isWalletConnected && (
                <button
                  className="mt-4 w-full rounded-md bg-secondary py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                >
                  Buy Now
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 