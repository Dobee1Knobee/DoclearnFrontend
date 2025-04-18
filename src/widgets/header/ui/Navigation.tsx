"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from './Header.module.css';
// import { MdOutlineFeed } from "react-icons/md"
// import { RiArticleLine } from "react-icons/ri"
// import { HiOutlineNewspaper } from "react-icons/hi2"
import { Newspaper, MessageSquare, FileText, BookOpen } from "lucide-react"

import { GoBook } from "react-icons/go";

export default function Navigation({isAuthenticated = false}) {
  const pathname = usePathname()

  const isAggregatorActive = pathname.startsWith("/Aggregator")

    return (
      <div className={styles.search}>
        <input 
          type="text" 
          className="form-control"
          placeholder="Поиск по сайту..." 
          style={{borderColor:'#5388d8'}}
        />
        <div className={styles.iconsContainer}>
          <Link href="/News">
            <Newspaper className={`${styles.icon} ${pathname === "/News" ? styles.iconActive : ""}`} />
          </Link>
          <Link href="/Feed">
            <MessageSquare className={`${styles.icon} ${pathname === "/Feed" ? styles.iconActive : ""}`} />
          </Link>
          <Link href="/Aggregator">
            <FileText className={`${styles.icon} ${isAggregatorActive ? styles.iconActive : ""}`} />
          </Link>
          {isAuthenticated && (
            <Link href="/Learn">
              <BookOpen className={`${styles.icon} ${pathname === "/Learn" ? styles.iconActive : ""}`} />
            </Link>
          )}
        </div>
      </div>
    );
  }
  