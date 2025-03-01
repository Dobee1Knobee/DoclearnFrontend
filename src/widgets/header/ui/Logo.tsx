import { useRouter } from "next/navigation"
import Image from "next/image"
import desktopLogo from "@/../../public/logo.png"
import mobileLogo from "@/../../public/logoGoogle.png"
import styles from "./Header.module.css"

const Logo = () => {
  const router = useRouter()

  const handleLogoClick = () => {
    router.push("/")
    window.scrollTo(0, 0)
  }

  return (
    <div className={styles.logo} onClick={handleLogoClick}>
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
    </div>
  )
}

export default Logo

