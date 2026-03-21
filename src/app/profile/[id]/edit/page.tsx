// import { ProfileEditPage } from "@/features/profile-edit/ui/ProfileEditPage"
import { NewProfileEditPage } from "@/features/profile-edit/ui/NewProfileEditPage"
import styles from "./page.module.css"

export default async function EditProfileRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className={styles.page}>
      {/* <ProfileEditPage userId={id} /> */}
      <NewProfileEditPage userId={id} />
    </div>
  )
}
