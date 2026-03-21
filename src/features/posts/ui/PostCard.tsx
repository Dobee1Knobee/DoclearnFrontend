"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, MessageSquare, Eye, Stethoscope, ExternalLink } from "lucide-react"
import type { Post } from "@/entities/post/model/types"
import { useLikePostMutation } from "../api/postApi"
import { useGetAuthorProfileQuery } from "@/features/author-profile/api/authorProfileApi"
import { useAppSelector } from "@/shared/hooks/hooks"
import { selectIsAuthenticated } from "@/features/auth/model/selectors"
import styles from "./PostCard.module.css"

interface PostCardProps {
  post: Post
}

const roleLabels: Record<string, string> = {
  student: "Студент",
  resident: "Ординатор",
  postgraduate: "Аспирант",
  doctor: "Врач",
  researcher: "Исследователь",
  admin: "Администратор",
  owner: "Владелец",
}

const difficultyLabels: Record<string, string> = {
  beginner: "Базовый",
  intermediate: "Средний",
  advanced: "Продвинутый",
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "только что"
  if (minutes < 60) return `${minutes} мин. назад`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ч. назад`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} дн. назад`
  return new Date(dateStr).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const [likePost] = useLikePostMutation()

  const hasAuthor = Boolean(post.author.id && post.author.firstName)

  const { data: authorProfile } = useGetAuthorProfileQuery(post.author.id, {
    skip: !hasAuthor || post.author.isAnonymous,
  })

  const authorName = post.author.isAnonymous
    ? "Аноним"
    : hasAuthor
      ? `${post.author.firstName} ${post.author.lastName}`.trim()
      : "Пользователь"

  const authorRole = roleLabels[post.author.role] || ""
  const avatarSrc = authorProfile?.avatarUrl
    || authorProfile?.defaultAvatarPath
    || post.author.defaultAvatarPath
    || "/Avatars/Avatar1.webp"

  const handleLike = async () => {
    if (!isAuthenticated) return
    try {
      await likePost(post.id).unwrap()
    } catch {
      // silent
    }
  }

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.authorRow}>
          {hasAuthor && !post.author.isAnonymous ? (
            <Link href={`/profile/${post.author.id}`} className={styles.avatarLink}>
              <Image src={avatarSrc} alt={authorName} width={40} height={40} className={styles.avatar} unoptimized />
            </Link>
          ) : (
            <div className={styles.avatarPlaceholder} />
          )}

          <div className={styles.authorInfo}>
            {hasAuthor && !post.author.isAnonymous ? (
              <Link href={`/profile/${post.author.id}`} className={styles.authorName}>
                {authorName}
              </Link>
            ) : (
              <span className={styles.authorNameAnon}>{authorName}</span>
            )}
            <div className={styles.metaLine}>
              {authorRole && <span className={styles.roleBadge}>{authorRole}</span>}
              <span className={styles.time}>{timeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {post.medical?.isCase && (
          <span className={styles.caseBadge}>
            <Stethoscope size={13} />
            Кейс
            {post.medical.difficulty !== "intermediate" && (
              <span className={styles.diffBadge}>{difficultyLabels[post.medical.difficulty]}</span>
            )}
          </span>
        )}
      </div>

      <div className={styles.body}>
        <p className={styles.text}>{post.content.text}</p>

        {post.content.images?.length > 0 && (
          <div className={styles.images}>
            {post.content.images.slice(0, 4).map((src, i) => (
              <Image key={i} src={src} alt="" width={320} height={200} className={styles.postImage} unoptimized />
            ))}
          </div>
        )}

        {post.medical?.tags?.length > 0 && (
          <div className={styles.tags}>
            {post.medical.tags.map((tag) => (
              <span key={tag.name} className={styles.tag}>#{tag.name}</span>
            ))}
          </div>
        )}

        {post.content.links?.length > 0 && (
          <div className={styles.linkList}>
            {post.content.links.slice(0, 2).map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.linkCard}>
                <ExternalLink size={14} />
                <span className={styles.linkTitle}>{link.title || link.url}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.action} onClick={handleLike} title="Нравится">
          <Heart size={16} />
          {post.stats.likes > 0 && <span>{post.stats.likes}</span>}
        </button>
        <span className={styles.action}>
          <MessageSquare size={16} />
          {post.stats.comments > 0 && <span>{post.stats.comments}</span>}
        </span>
        <span className={styles.action}>
          <Eye size={16} />
          {post.stats.views > 0 && <span>{post.stats.views}</span>}
        </span>
      </div>
    </article>
  )
}
