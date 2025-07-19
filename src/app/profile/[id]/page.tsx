import { ClientProfilePage } from '@/features/profile-common/ui/ClientProfilePage'

type RouteParams = Promise<{ id: string }>

export default async function ProfilePage(
  { params }: { params: RouteParams }
) {
  const { id } = await params
  return (
    <div className="container mx-auto px-4 py-8" style={{ marginTop: '7rem', marginBottom: '5rem', maxWidth: '1200px' }}>
      <ClientProfilePage />
    </div>
  )
}
