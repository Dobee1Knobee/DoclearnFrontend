'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { useGetAuthorProfileQuery } from '@/features/author-profile/api/authorProfileApi';
import { Spinner } from 'react-bootstrap';      
import { ProfileHeader } from './ProfileHeader';
import { ProfileTabs } from './ProfileTabs';

/**
 * Клиентский компонент страницы профиля.
 * Подтягивает userId из auth-slice, получает данные через RTK Query
 * и рендерит Header + Tabs.
 */
export const ClientProfilePage: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const {
    data: profile,
    isLoading,
    isError,
  } = useGetAuthorProfileQuery(userId ?? '');

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !profile) {
    return <div className="text-center p-4">Ошибка загрузки профиля</div>;
  }

  return (
    <>
      <ProfileHeader profile={profile} />
      <ProfileTabs profile={profile} />
    </>
  );
};
