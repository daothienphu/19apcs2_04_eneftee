import '../styles/globals.css'
import Link from 'next/link'
import '../styles/Home.module.css'

function MyApp({ Component, pageProps }) {
  return (
    <div id="main" className="h-screen">
      <div style={{display:'inline-flex'}} className="bg-mainBG h-full">
        <div className="pl-10 pt-20 pr-20 pb-10 bg-mildGray h-full">
          <ul>
            <p id="head-title">Eneftee</p>
            <li className="mt-5 mb-5">
              <Link href="/">
                <div style={{display:'inline-flex'}}>
                  <div>
                    <img src={"https://p1.hiclipart.com/preview/134/952/33/white-and-red-puppy-emoticon-sticker-png-clipart.jpg"} height="50px" width = "50px"/>
                  </div>
                  <a className="mr-4 text-pink-500 font-bold ml-1">
                    Homepage
                  </a>
                </div>
              </Link>
            </li>
            <li className="mb-5">
              <Link href="/create-item">
                <a className="mr-6 text-pink-500 font-bold">
                  Sell NFT
                </a>
              </Link>
              </li>
            <li className="mb-5"> 
              <Link href="/my-assets">
                <a className="mr-6 text-pink-500 font-bold">
                  Artworks Owned
                </a>
              </Link>
            </li>
            <li className="mb-5">
              <Link href="/creator-dashboard">
                <a className="mr-6 font-bold">
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
