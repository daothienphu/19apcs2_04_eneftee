import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config.example'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')
  
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await transaction.wait()
    router.push('/')
  }

  async function onSearch() {
    
  }

  return (
    <div className="justify-center mt-10 pb-10">
      <div className="pl-10">   
        <input 
          id="item_name"
          placeholder="&nbsp;&nbsp;Useless searchbar, which I just put here so it looks less empty"
          className="mt-2 mb-8 border rounded-3xl p-1"
          style={{width:1000}}
          onChange={e => onSearch()}
        />
      </div>
      <div className="pl-20">
        <div className="mb-5">
          <p className="text-5xl font-bold text-black">Create new item</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-black">Choose asset</p>
        </div>
        <label class="custom-file-upload">
          <input
            type="file"
            name="Asset"
            className="mt-2"
            onChange={onChange}
          />
          Choose File...
        </label>
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <div className="mt-8">
          <p className="text-3xl font-bold text-black">Asset name</p>
        </div>
        <input 
          id="item_name"
          placeholder="&nbsp;&nbsp;Item name"
          className="mt-2 mb-8 border rounded p-1"
          style={{width:1000}}
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <div>
          <p className="text-3xl font-bold text-black">Description</p>
        </div>
        <textarea
          style={{width:1000}}
          id="item_describe"
          placeholder="Type here ..."
          className="mt-2 mb-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <div>
          <p className="text-3xl font-bold text-black">Price</p>
        </div>
        <div className="flex">
          <input
            style={{width:200}}
            id = "item_amount"
            placeholder="&nbsp;&nbsp;Amount"
            className="mt-2 border rounded p-1"
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
          />
          <p className="font-bold mt-3 ml-5">ETH</p>
        </div>
        <button id="create-button" onClick={createMarket} style={{width:200}} className="font-bold mt-4 bg-orange-500 text-white rounded p-2 shadow-lg">
          CREATE
        </button>
      </div>
    </div>
    
  )
}