import Image from "next/image"
import desktopLogo from "@/../../public/logo.webp"
import mobileLogo from "@/../../public/logoGoogle.webp"
import styles from "./Header.module.css"
import Link from "next/link"

const Logo = () => {
  return (
    <Link href="/" aria-label="На главную" className={styles.logo} prefetch > 
        <picture>
          <source srcSet={mobileLogo.src} media="(max-width: 650px)" />
          <Image
            src={desktopLogo}
            alt="Logo"
            width={150}
            height={75}
            priority
            quality={100}
            style={{
              objectFit: "contain",
              height: "auto",
            }}
          />
        </picture>
    </Link>
  )
}

export default Logo

