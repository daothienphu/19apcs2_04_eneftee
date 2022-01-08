import '../styles/globals.css'
import Link from 'next/link'
import '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { faHome, faDollarSign, faPenSquare, faPalette } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  return (
    <div id="main" className="h-screen">
      <div style={{display:'inline-flex'}} className="bg-mainBG h-fit min-h-screen">
        <div className="pl-10 pt-5 pr-10 pb-10 bg-mildGray h-fit">
          <ul>
            <div width={170} height={44}>
              <Image src={"/logo.png"} width={170} height={44} layout="fixed"/>
            </div>
            
            <li className={router.pathname == "/" ? "active" : ""}>
              <div className="mt-5 mb-5">
                <FontAwesomeIcon icon={faHome} />
                &nbsp;
                <Link href="/">
                  <a className="mr-4 text-pink-500 font-bold ml-1">
                    Homepage
                  </a>
                </Link>
              </div>
            </li>

            <li className={router.pathname == "/create-item" ? "active" : ""}>
              <div className="mb-5">
              &nbsp;
                <FontAwesomeIcon icon={faDollarSign} />
                &nbsp;&nbsp;&nbsp;
                <Link href="/create-item">
                  <a className="mr-6 text-pink-500 font-bold">
                    Sell NFT
                  </a>
                </Link>
              </div>  
            </li>

            <li className={router.pathname == "/my-assets" ? "active" : ""}> 
              <div className="mb-5">
                <FontAwesomeIcon icon={faPalette} />
                &nbsp;&nbsp;
                <Link href="/my-assets">
                  <a className="mr-6 text-pink-500 font-bold">
                    My NFTs
                  </a>
                </Link>
              </div>
            </li>

            <li className={router.pathname == "/creator-dashboard" ? "active" : ""}>
            <div className="mb-5">
              <FontAwesomeIcon icon={faPenSquare} />
              &nbsp;&nbsp;
              <Link href="/creator-dashboard">
                <a className="mr-6 font-bold">
                  Dashboard
                </a>
              </Link>
            </div>
            </li>
          </ul>
        </div>
        <Component {...pageProps} />
      </div>
    </div>
    
   
  )
}

export default MyApp
