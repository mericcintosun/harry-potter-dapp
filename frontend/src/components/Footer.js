'use client';

import { FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa';

import { motion } from 'framer-motion';

const footerLinks = [
  {
    title: 'Marketplace',
    links: [
      { name: 'All NFTs', href: '#' },
      { name: 'Auctions', href: '#' },
      { name: 'Collections', href: '#' },
      { name: 'Featured', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '#' },
      { name: 'Platform Status', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  },
];

const socialLinks = [
  { name: 'Twitter', icon: FaTwitter, href: '#' },
  { name: 'Discord', icon: FaDiscord, href: '#' },
  { name: 'GitHub', icon: FaGithub, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-primary/95 backdrop-blur-sm border-t border-accent/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Branding Section */}
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-accent">HP NFTs</h1>
            <p className="text-silver max-w-xs">
              Discover, collect, and trade magical NFTs from the Wizarding World.
              Your gateway to digital collectibles from Hogwarts and beyond.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-silver hover:text-accent transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerLinks.slice(0, 2).map((section) => (
                <div key={section.title} className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold text-accent">{section.title}</h3>
                  <ul className="mt-4 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-sm text-silver hover:text-accent transition-colors"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-1">
              {footerLinks.slice(2).map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-accent">{section.title}</h3>
                  <ul className="mt-4 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-sm text-silver hover:text-accent transition-colors"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 border-t border-accent/10 pt-8">
          <p className="text-sm text-silver text-center">
            &copy; {new Date().getFullYear()} HP NFTs. All rights reserved. Made with ⚡ by wizards.
          </p>
        </div>
      </div>
    </footer>
  );
} 