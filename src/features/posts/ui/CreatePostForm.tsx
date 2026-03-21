"use client"

import type React from "react"
import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Send, X } from "lucide-react"
import { useCreatePostMutation } from "../api/postApi"
import { useAppSelector } from "@/shared/hooks/hooks"
import { selectIsAuthenticated, selectUser } from "@/features/auth/model/selectors"
import { useAvatarCache } from "@/shared/hooks/useAvatarCache"
import styles from "./CreatePostForm.module.css"

interface ImagePreview {
  file: File
  url: string
}

export const CreatePostForm: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const currentUser = useAppSelector(selectUser)
  const { getAvatarUrl } = useAvatarCache()
  const [createPost, { isLoading }] = useCreatePostMutation()
  const [text, setText] = useState("")
  const [images, setImages] = useState<ImagePreview[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isAuthenticated || !currentUser) return null

  const avatarSrc = getAvatarUrl(
    currentUser.avatarUrl || currentUser.avatar,
    currentUser.avatarId,
    currentUser._id,
    currentUser.defaultAvatarPath,
  ) || "/placeholder.webp"

  const userName = `${currentUser.firstName} ${currentUser.lastName}`.trim()

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.slice(0, 4 - images.length).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setImages((prev) => [...prev, ...newImages].slice(0, 4))
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const removed = prev[index]
      if (removed) URL.revokeObjectURL(removed.url)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (text.trim().length < 10) {
      setError("Минимум 10 символов")
      return
    }

    try {
      // TODO: когда бэк поддержит загрузку файлов — отправлять images через FormData
      await createPost({ text: text.trim(), images: [] }).unwrap()
      setText("")
      images.forEach((img) => URL.revokeObjectURL(img.url))
      setImages([])
    } catch (err: any) {
      setError(err?.data?.message || err?.data?.data?.message || "Не удалось опубликовать")
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.top}>
        <Image src={avatarSrc} alt={userName} width={36} height={36} className={styles.avatar} unoptimized />
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Поделитесь мыслью, случаем или наблюдением..."
          rows={2}
        />
      </div>

      {images.length > 0 && (
        <div className={styles.previews}>
          {images.map((img, i) => (
            <div key={img.url} className={styles.previewWrap}>
              <Image src={img.url} alt="" width={100} height={80} className={styles.previewImg} unoptimized />
              <button type="button" className={styles.previewRemove} onClick={() => handleRemoveImage(i)}>
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <span className={styles.error}>{error}</span>}

      <div className={styles.bottom}>
        <div className={styles.bottomLeft}>
          <button
            type="button"
            className={styles.attachBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 4}
            title="Добавить фото"
          >
            <ImagePlus size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleAddImages}
          />
          <span className={styles.hint}>
            {text.length < 10 ? `ещё ${10 - text.length} символов` : "готово"}
          </span>
        </div>
        <button type="submit" className={styles.btn} disabled={isLoading || text.trim().length < 10}>
          <Send size={14} />
          {isLoading ? "..." : "Отправить"}
        </button>
      </div>
    </form>
  )
}
