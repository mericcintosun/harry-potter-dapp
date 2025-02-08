import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(request) {
    const formData = new FormData();

    try {
        // Parse the incoming form data
        const chunks = [];
        for await (const chunk of request.body) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Append the file to the form data
        formData.append('file', buffer, {
            filename: 'image.png', // You can dynamically set the filename if needed
            contentType: request.headers.get('content-type'),
        });

        // upload to pinata
        const pinataResponse = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            formData,
            {
                headers: {
                    pinata_api_key: process.env.PINATA_API_KEY,
                    pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,// Use Secret API Key from environment variables
                    ...formData.getHeaders(),
                },
            }
        );

        const ipfsUrl = `https://ipfs.io/ipfs/${pinataResponse.data.IpfsHash}`;
        return NextResponse.json({ ipfsUrl }, { status: 200 });
    } catch (error) {
        console.error('Error uploading to Pinata:', error.response?.data || error.message);
        return NextResponse.json(
            { message: 'Failed to upload image to Pinata' },
            { status: 500 }
        );
    }
}