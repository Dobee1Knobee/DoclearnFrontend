import { CardGrid } from "@/widgets/CardGrid/ui/CardGrid/CardGrid"
import styles from "./page.module.css"

export default function Home() {
  return (
    <main className={styles.main}>
      <CardGrid />
    </main>
  )
}

