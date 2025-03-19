"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import styles from "./PostContent.module.css"

interface PostContentProps {
  text: string
  images?: string[]
  links?: {
    url: string
    title: string
  }[]
  className?: string
}

export function PostContent({ text, images, links, className = "" }: PostContentProps) {
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({})

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => ({ ...prev, [index]: true }))
  }

  const formatText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part.replace(/^https?:\/\//, "")}
            <ExternalLink className={styles.externalIcon} aria-hidden="true" size={12} />
          </a>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className={`${styles.content} ${className}`}>
      <p className={styles.text}>{formatText(text)}</p>

      {images && images.length > 0 && (
        <div
          className={`${styles.images} ${
            images.length === 1
              ? styles.singleImage
              : `${styles.multipleImages} ${images.length === 2 ? styles.twoImages : ""}`
          }`}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`${styles.imageContainer} ${
                images.length === 1 ? styles.single : index === 0 && images.length > 2 ? styles.featured : ""
              }`}
            >
              <Image  
                src={image}
                alt={`Изображение к посту ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`${styles.image} ${!imagesLoaded[index] ? styles.loading : ""}`}
                onLoad={() => handleImageLoad(index)}
              />
            </div>
          ))}
        </div>
      )}

      {links && links.length > 0 && (
        <div className={styles.links}>
          {links.map((link, index) => (
            <div key={index}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                <div className={styles.linkContent}>
                  <ExternalLink className={styles.linkIcon} aria-hidden="true" />
                  <div className={styles.linkText}>{link.title}</div>
                </div>
                <div className={styles.linkUrl}>{link.url}</div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}




