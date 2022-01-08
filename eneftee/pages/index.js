import { ethers } from 'ethers';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Web3Modal from "web3modal"
import { faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react';
import Modal from './modal.js'

import {
  nftaddress, nftmarketaddress
} from '../config.example'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import axios from 'axios';
let searched = false;

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [searchPhrase, setSearchPharse] = useState('');
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, [])

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545")
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
          creator: i.creator,
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
    router.reload();
  }

  async function onEnterSearchPhrase(text){
    if (text == ""){
      loadNFTs()
    }
    setSearchPharse(text);
  }

  async function onSearch(){
    console.log("searchPhrase", searchPhrase)
    console.log("nfts", nfts)
    let res = []
    for (let i = 0; i < nfts.length; i++) {
      let checkName = nfts[i].name.toLowerCase().includes(searchPhrase.toLowerCase())
      let checkDescription = nfts[i].description.toLowerCase().includes(searchPhrase.toLowerCase())
      if (checkName || checkDescription) {
        res.push(nfts[i])
      }
    }
    searched = true
    console.log(searched)
    setNfts(res)
  }

  if (loadingState === 'loaded' && !nfts.length) 
    return (
      <div>
        <div className="px-10 pt-3 w-screen">   
          <input 
            id="item_name"
            placeholder="Type to search for NFTs"
            className="mt-2 mb-2 border rounded-3xl p-1 pl-3 pb-2 mr-1 w-9/12"
            onChange={e => onEnterSearchPhrase(e.target.value)}
          />
          <button className="bg-orange-500 text-white font-bold pb-2 pt-1 px-3 mt-2 rounded-3xl" onClick={() => onSearch()}>
            <FontAwesomeIcon icon={faSearch}/>
          </button>
        </div>
        {searched && <h1 className="px-10 py-2 text-3xl">No items match your search</h1>}
        {!searched && <h1 className="px-10 py-2 text-3xl">No items in marketplace</h1>}
      </div>
    )

  return (
    <div>
      <div className="px-10 pt-3 w-screen">   
          <input 
            id="item_name"
            placeholder="Type to search for NFTs"
            className="mt-2 mb-2 border rounded-3xl p-1 pl-3 pb-2 mr-1 w-9/12"
            onChange={e => onEnterSearchPhrase(e.target.value)}
          />
        <button className="bg-orange-500 text-white font-bold pb-2 pt-1 px-3 mt-2 rounded-3xl" onClick={() => onSearch()}>
          <FontAwesomeIcon icon={faSearch}/>
        </button>
      </div>
      <div className="pl-10" style={{ maxWidth: '1500px' }}>
        <h2 className="text-3xl font-bold text-black pb-2 pt-2">Explore the market</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => {
              return (
                <div key={i} className="border shadow rounded-xl overflow-hidden bg-white" >
                  <img id="image_show" src={nft.image} className="rounded object-cover" style={{height:300}} onClick={()=> setShowModal(true)} />
                  <div className="p-4">
                    <div> 
                      <p style={{ height: '30px' }} className="text-2xl font-semibold max-h-12 overflow-hidden" onClick={()=> setShowModal(true)}>
                        {nft.name}
                      </p>
                      <p id="item_seller">
                        {nft.seller}
                      </p>
                      <Modal
                        onClose={() => setShowModal(false)}
                        show={showModal}
                      >
                        <img id="image_show" src={nft.image} className="rounded ml-3 mt-2 max-w-screen-md max-h-96 object-cover"/>
                        <div className="pl-4">
                          <div>
                            <p id="item_description">
                              <p className="font-semibold text-xl">
                                Name:
                              </p> 
                              {nft.name}
                            </p>
                            <p id="item_description">
                              <p className="font-semibold text-xl">
                                Description: 
                              </p>
                              {nft.description}
                            </p>
                            <p id="item_price">
                              <p className="font-semibold text-xl">
                                Price: 
                              </p>
                              {nft.price} ETH
                            </p>
                            <p id="item_description">
                              <p className="font-semibold text-xl">
                                Creator: 
                              </p>
                               {nft.creator}
                            </p>
                            <p id="item_description">
                              <p className="font-semibold text-xl">
                                Seller: 
                              </p>
                              {nft.seller}
                            </p>  
                            <p id="item_description">
                              <p className="font-semibold text-xl">
                                Owner: 
                              </p>
                              {nft.owner}
                            </p>
                            <p id="item_description">
                              <p className="font-semibold text-xl">
                                Token ID: 
                              </p>
                              {nft.tokenId}
                            </p>
                          </div>
                        </div>
                      </Modal>
                    </div>

                    <div style={{ overflow: 'hidden' }}>
                      <p className="text-black-400 max-h-12 overflow-hidden">{nft.description}</p>
                    </div>                  

                    <div className="content-center">
                      <p className="text-2xl text-center font-bold text-black">
                        {nft.price} ETH
                      </p>
                      <div className="flex">
                        <button className="flex-1 bg-orange-500 text-white font-bold py-2 px-12 mt-2 rounded" onClick={() => buyNft(nft)}>
                          Buy
                        </button>
                      </div>
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
