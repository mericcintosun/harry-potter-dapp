import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Harry Potter NFT Marketplace",
  description: "Discover and collect unique Harry Potter themed NFTs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-primary text-white">
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
