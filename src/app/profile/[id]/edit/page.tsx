import { ProfileEditPage } from "@/features/profile-edit/ui/ProfileEditPage"

export default async function EditProfileRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{ marginTop: "7rem", marginBottom: "5rem", maxWidth: "1200px" }}
    >
      <ProfileEditPage userId={id} />
    </div>
  )
}
