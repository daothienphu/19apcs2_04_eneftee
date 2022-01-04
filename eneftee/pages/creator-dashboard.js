import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  nftmarketaddress, nftaddress
} from '../config.example'

import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchItemsCreated()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description
      }
      return item
    }))
    /* create a filtered array of items that have been sold */
    const soldItems = items.filter(i => i.sold)
    setSold(soldItems)
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

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-10 text-3xl">No assets created</h1>)
  return (
    <div>
      <div className="pl-10 pt-3">   
        <input 
          id="item_name"
          placeholder="Useless searchbar, which I just put here so it looks less empty"
          className="mt-2 mb-2 border rounded-3xl p-1 pl-3 pb-2 mr-1"
          style={{width:1000}}
          onChange={e => onEnterSearchPhrase(e.target.value)}
        />
        <button className="bg-orange-500 text-white font-bold pb-2 pt-1 px-3 mt-2 rounded-3xl" onClick={() => onSearch()}>
          <FontAwesomeIcon icon={faSearch}/>
        </button>
      </div>
      <div className="pl-10" >
        <h2 className="text-3xl font-bold text-black pb-2 pt-2">NFTs Created</h2>
        <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden bg-white" >
                <img id="image_show" src={nft.image} className="rounded object-cover" style={{height:300}}  />
                <div className="p-4">
                  <div> 
                    <p style={{ height: '30px' }} className="text-2xl font-semibold">
                      {nft.name}
                    </p>
                    <p id="item_seller">
                      {nft.seller}
                    </p>
                  </div>

                  <div style={{ overflow: 'hidden' }}>
                    <p className="text-black-400 max-h-12 overflow-hidden">{nft.description}</p>
                  </div>                  

                  <div className="content-center">
                    <p className="text-2xl text-center font-bold text-black">
                      {nft.price} ETH
                    </p>
                    
                    <div className="flex">
                      {Boolean(!nft.sold) && (<button className="flex-1 bg-orange-500 text-white font-bold py-2 px-12 mt-2 rounded" onClick={() => buyNft(nft)}>
                        Buy
                      </button>)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
        <div className="pl-10 pb-10">
        {
          Boolean(sold.length) && (
            <div>
              <h2 className="text-3xl font-bold text-black pb-2 pt-4">NFTs sold</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                  sold.map((nft, i) => (
                    <div key={i} className="border shadow rounded-xl overflow-hidden bg-white" >
                      <img id="image_show" src={nft.image} className="rounded object-cover" style={{height:300}}  />
                      <div className="p-4">
                        <div> 
                          <p style={{ height: '30px' }} className="text-2xl font-semibold">
                            {nft.name}
                          </p>
                          <p id="item_seller">
                            {nft.seller}
                          </p>
                        </div>

                        <div style={{ overflow: 'hidden' }}>
                          <p className="text-black-400">{nft.description}</p>
                        </div>                  

                        <div className="content-center">
                          <p className="text-2xl text-center font-bold text-black">
                            {nft.price} ETH
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
        </div>
    </div>
  )
}