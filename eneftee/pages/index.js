import { ethers } from 'ethers';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import Web3Modal from "web3modal"

import {
  nftaddress, nftmarketaddress
} from '../config.example'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import axios from 'axios';


export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();
  }, [])

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()
    const items = await Promise.all(data.map(
      async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        }
        return item
      }
    ))
    setNfts(items)
    setLoadingState('loaded')
  }

  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    const price = ethers.utils.parseEther(nft.price.toString(), "ether");

    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    });
    await transaction.wait();
  }

  function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
} 

  if (loadingState === 'loaded' && !nfts.length) return (
    <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
  )

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1500px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
          {
            nfts.map((nft, i) => {
              return(
              <div key={i} className="border shadow rounded-xl overflow-hidden bg-white" >
                <img id="image_show" src={nft.image} style={{maxHeight: 250}} />
                <div className="p-4">
                  <div>
                  <div> 
                  <p style={{ height: '30px' }} className="text-2xl font-semibold">
                    {nft.name}
                  </p>
                  <p>
                    hihi
                  </p>
                    </div>
                    <p>
                      hoho
                    </p>
                    </div>
                  <div style={{ overflow: 'hidden' }}>
                    <p className="text-black-400">{nft.description}</p>

                  </div>
                  <div className="p-4">
                    <p className="text-2xl text-center mb-4 font-bold text-black">{nft.price} ETH</p>
                   
                    <button className="w-full bg-orange-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>

                  </div>
                </div>

              </div>
            )})
          }
        </div>
      </div>
    </div>
  )
}
