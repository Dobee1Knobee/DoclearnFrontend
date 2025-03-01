import styles from "./Footer.module.css"
import { FaVk, FaTelegram  } from "react-icons/fa6";
import { ImMail } from "react-icons/im";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.copyright}>© 2025 DocLearn | Все права защищены</div>
        <div className={styles.socialIcons}>
          <a href="https://vk.com/doclearn" target="_blank" rel="noopener noreferrer" aria-label="Vkontakte">
            <FaVk size={28} />
          </a>
          <a href="https://t.me/doclearnRU" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
            <FaTelegram size={28} />
          </a>
          <a href="mailto:contact@doclearn.ru" target="_blank" rel="noopener noreferrer" aria-label="Mail">
            <ImMail size={28} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

