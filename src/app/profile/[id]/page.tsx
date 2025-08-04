import { ClientProfilePage } from '@/features/profile-common/ui/ClientProfilePage'
import styles from "./page.module.css"

type RouteParams = Promise<{ id: string }>

export default async function ProfilePage(
  { params }: { params: RouteParams }
) {
  const { id } = await params
  return (
    // style={{ marginTop: '7rem', marginBottom: '5rem', maxWidth: '1200px' }}
    <div className={styles.container}>
      <ClientProfilePage />
    </div>
  )
}
