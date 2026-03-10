import Link from "next/link"
import { Bell, BookOpen, CircleUserRound, FileText, Newspaper, Sparkles } from "lucide-react"
import styles from "./page.module.css"

const navigationCards = [
  {
    title: "Новости",
    description: "Коротко о главном в медицине и образовании каждый день.",
    href: "/News",
    icon: Newspaper,
  },
  {
    title: "Лента постов",
    description: "Обсуждайте кейсы, делитесь опытом и находите коллег по интересам.",
    href: "/Feed",
    icon: CircleUserRound,
  },
  {
    title: "Агрегатор статей",
    description: "Материалы, исследования и практические обзоры в одном месте.",
    href: "/Aggregator",
    icon: FileText,
  },
]

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <Sparkles size={16} />
          <span>DocLearn Platform</span>
        </div>

        <h1 className={styles.heroTitle}>Здоровье в знаниях, развитие в сообществе</h1>
        <p className={styles.heroText}>
          Пространство для специалистов, студентов и организаций: учитесь, публикуйте, находите события и развивайте
          профессиональный профиль.
        </p>

        <div className={styles.heroActions}>
          <Link href="/Learn" className={styles.primaryButton}>
            <BookOpen size={18} />
            Начать обучение
          </Link>
          <Link href="/announcements" className={styles.secondaryButton}>
            <Bell size={18} />
            Смотреть анонсы
          </Link>
        </div>

        <div className={styles.stats}>
          <article>
            <strong>3 направления</strong>
            <span>обучение, лента, статьи</span>
          </article>
          <article>
            <strong>1 профиль</strong>
            <span>для достижений и документов</span>
          </article>
          <article>
            <strong>0 лишнего</strong>
            <span>только полезный контент</span>
          </article>
        </div>
      </section>

      <section className={styles.navigationSection}>
        {navigationCards.map(({ title, description, href, icon: Icon }) => (
          <Link key={title} href={href} className={styles.navigationCard}>
            <div className={styles.iconWrap}>
              <Icon size={24} />
            </div>
            <h2>{title}</h2>
            <p>{description}</p>
          </Link>
        ))}
      </section>

      <section className={styles.timeline}>
        <h2>Как начать за 3 шага</h2>
        <div className={styles.timelineGrid}>
          <article>
            <span>01</span>
            <h3>Оформите профиль</h3>
            <p>Добавьте базовую информацию, чтобы коллеги видели ваш профессиональный путь.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Выберите формат</h3>
            <p>Читайте новости, следите за постами или переходите к подборкам статей и курсов.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Участвуйте в событиях</h3>
            <p>Подписывайтесь на анонсы и регистрируйтесь на конференции, мастер-классы и вебинары.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
