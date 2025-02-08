'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function CreateNFTModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collection: 'Gryffindor',
    price: '',
    image: null,
  });
  //.
  const collections = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({ ...prev, image: file }));
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const uploadToPinata = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image to Pinata');
      }

      const data = await response.json();
      return data.ipfsUrl;
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error('Please select an image for your NFT');
      return;
    }

    try {
      const ipfsUrl = await uploadToPinata(formData.image);
      if (!ipfsUrl) {
        toast.error("Failed to upload image to IPFS.");
        return;
      }

      console.log('IPFS URL:', ipfsUrl);
      toast.success('NFT created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast.error('Failed to create NFT');
    }
  };

  return (
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-primary px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                        onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-accent">
                        Create New NFT
                      </Dialog.Title>
                      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-silver">
                            Name
                          </label>
                          <input
                              type="text"
                              name="name"
                              id="name"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
                          />
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-silver">
                            Description
                          </label>
                          <textarea
                              name="description"
                              id="description"
                              rows={3}
                              required
                              value={formData.description}
                              onChange={handleInputChange}
                              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
                          />
                        </div>

                        <div>
                          <label htmlFor="collection" className="block text-sm font-medium text-silver">
                            Collection
                          </label>
                          <select
                              name="collection"
                              id="collection"
                              required
                              value={formData.collection}
                              onChange={handleInputChange}
                              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
                          >
                            {collections.map((collection) => (
                                <option key={collection} value={collection}>
                                  {collection}
                                </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-silver">
                            Price (ETH)
                          </label>
                          <input
                              type="number"
                              step="0.001"
                              name="price"
                              id="price"
                              required
                              value={formData.price}
                              onChange={handleInputChange}
                              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
                          />
                        </div>

                        <div>
                          <label htmlFor="image" className="block text-sm font-medium text-silver">
                            Image
                          </label>
                          <input
                              type="file"
                              name="image"
                              id="image"
                              accept="image/*"
                              required
                              onChange={handleImageChange}
                              className="mt-2 block w-full text-sm text-silver file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-secondary/90"
                          />
                        </div>

                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md bg-accent px-3 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-accent/90 sm:ml-3 sm:w-auto"
                          >
                            Create NFT
                          </motion.button>
                          <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={onClose}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
  );
} 