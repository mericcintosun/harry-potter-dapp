"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NFTGrid from '@/components/NFTGrid';
import CreateNFTModal from '@/components/CreateNFTModal';
import Auction from '@/components/Auction';
import CreateSection from '@/components/CreateSection';

// Tailwind CSS ve Framer Motion kullanılarak geliştirilmiş, responsive ve modern bir tasarım.
// Bu örnek; NFT oluşturma, mintleme ve listeleme işlemleri için ayrı bileşenler içerir.
// Renk paleti: Arka plan: #1c2340, Butonlar: #4b0082, Vurgu: #ffd700, Ek destek: #2c2c2c ve metin: #c0c0c0

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Navbar 
        isWalletConnected={isWalletConnected}
        setIsWalletConnected={setIsWalletConnected}
      />
      
      <Hero 
        isWalletConnected={isWalletConnected}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      <CreateSection 
        isWalletConnected={isWalletConnected}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      <Auction isWalletConnected={isWalletConnected} />

      <NFTGrid isWalletConnected={isWalletConnected} />

      <CreateNFTModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </main>
  );
}
  