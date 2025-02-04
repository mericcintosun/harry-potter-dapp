'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const collections = [
  {
    id: 1,
    name: 'Gryffindor Collection',
    description: 'Brave and chivalrous NFTs for the daring.',
    image: '/images/nft1.png',
    items: 150,
    floorPrice: '0.5 ETH',
    totalVolume: '1.2K ETH',
    color: 'from-red-700 to-yellow-500',
  },
  {
    id: 2,
    name: 'Slytherin Collection',
    description: 'Cunning and ambitious NFTs for the resourceful.',
    image: '/images/nft5.png',
    items: 150,
    floorPrice: '0.48 ETH',
    totalVolume: '1.1K ETH',
    color: 'from-green-700 to-silver',
  },
  {
    id: 3,
    name: 'Hufflepuff Collection',
    description: 'Just and loyal NFTs for the dedicated.',
    image: '/images/nft2.png',
    items: 150,
    floorPrice: '0.45 ETH',
    totalVolume: '950 ETH',
    color: 'from-yellow-600 to-black',
  },
  {
    id: 4,
    name: 'Ravenclaw Collection',
    description: 'Wise and creative NFTs for the intelligent.',
    image: '/images/nft3.png',
    items: 150,
    floorPrice: '0.47 ETH',
    totalVolume: '1K ETH',
    color: 'from-blue-700 to-bronze',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Collections() {
  return (
    <section className="py-24 bg-primary" id="collections">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-accent mb-4"
          >
            Magical Collections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-silver max-w-2xl mx-auto"
          >
            Explore unique NFT collections from each Hogwarts house, featuring magical artifacts,
            creatures, and memorable moments from the Wizarding World.
          </motion.p>
        </div>

        {/* Collections Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-secondary/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-accent/10 hover:border-accent/30 transition-colors"
            >
              {/* Collection Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${collection.color} opacity-60`} />
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Collection Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-accent mb-2">{collection.name}</h3>
                <p className="text-silver text-sm mb-4">{collection.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-silver">Items</p>
                    <p className="text-accent font-semibold">{collection.items}</p>
                  </div>
                  <div>
                    <p className="text-xs text-silver">Floor Price</p>
                    <p className="text-accent font-semibold">{collection.floorPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs text-silver">Volume</p>
                    <p className="text-accent font-semibold">{collection.totalVolume}</p>
                  </div>
                </div>

                {/* View Collection Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 bg-secondary hover:bg-secondary/90 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors"
                >
                  View Collection
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 