import '../styles/globals.css'
import Link from 'next/link'
import '../styles/Home.module.css'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold text-pink">Metaverse Marketplace</p>
        <div className="flex mt-4">
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
          <Link href="/create-item">
            <a className="mr-6 text-pink-500 font-bold">
              Sell Digital Asset
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-pink-500 font-bold">
              My Digital Assets
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 font-bold" style={{color: "orange"}}>
              Creator Dashboard
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
