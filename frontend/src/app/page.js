"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NFTGrid from '@/components/NFTGrid';
import CreateNFTModal from '@/components/CreateNFTModal';
import Auction from '@/components/Auction';
import Collections from '@/components/Collections';
import CreateSection from '@/components/CreateSection';
import Footer from '@/components/Footer';

// Tailwind CSS ve Framer Motion kullanılarak geliştirilmiş, responsive ve modern bir tasarım.
// Bu örnek; NFT oluşturma, mintleme ve listeleme işlemleri için ayrı bileşenler içerir.
// Renk paleti: Arka plan: #1c2340, Butonlar: #4b0082, Vurgu: #ffd700, Ek destek: #2c2c2c ve metin: #c0c0c0

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Sayfa yüklendiğinde wallet bağlantısını sıfırla
  useEffect(() => {
    setIsWalletConnected(false);
    setWalletAddress('');
  }, []);

  const handleWalletConnect = (address) => {
    setIsWalletConnected(true);
    setWalletAddress(address);
  };

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
  };

  return (
    <main className="min-h-screen bg-primary">
      <Toaster position="top-center" />
      <Navbar 
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        onConnect={handleWalletConnect}
        onDisconnect={handleWalletDisconnect}
      />
      
      <Hero 
        isWalletConnected={isWalletConnected}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      <Collections />

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

      <Footer />
    </main>
  );
}
  