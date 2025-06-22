import React from 'react';
import { ClientProfilePage } from '@/features/profile-common/ui/ClientProfilePage';

export default function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8" style={{ marginTop: '7rem', marginBottom: '5rem',maxWidth: '1200px' }}>
      <ClientProfilePage />
    </div>
  )
}
