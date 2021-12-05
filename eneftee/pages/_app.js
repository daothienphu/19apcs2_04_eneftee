import '../styles/globals.css'
import Link from 'next/link'
import '../styles/Home.module.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="ml-10">
    <p id="head-title">Metaverse Marketplace</p>
    <div style={{display:'inline-flex'}}>

     <div className="mt-20 mr-20">
       
     <ul>
          <li className="mt-5 mb-5">
          <Link href="/">
            <div style={{display:'inline-flex'}}>
            <div>
            <img src={"https://p1.hiclipart.com/preview/134/952/33/white-and-red-puppy-emoticon-sticker-png-clipart.jpg"} height="50px" width = "50px"/>
            </div>
            <a className="mr-4 text-pink-500 font-bold ml-1">
              Home
            </a>
            </div>
          </Link>
            </li>
        <li className="mb-5">
        <Link href="/create-item">
            <a className="mr-6 text-pink-500 font-bold">
              Sell Digital Asset
            </a>
          </Link>
          </li>
        <li className="mb-5"> 
        <Link href="/my-assets">
            <a className="mr-6 text-pink-500 font-bold">
              My Digital Assets
            </a>
          </Link></li>

          <li className="mb-5">
            <Link href="/creator-dashboard">
            <a className="mr-6 font-bold" style={{color: "orange"}}>
              Creator Dashboard
            </a>
          </Link>
          </li>

     </ul>

     </div>

   <Component {...pageProps} />
    </div>

    </div>
    
   
  )
}

export default MyApp
