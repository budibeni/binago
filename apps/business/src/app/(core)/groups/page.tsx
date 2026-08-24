'use client';

import React from 'react';
import { GroupsFeature } from '../../../features/core/groups/GroupsFeature';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';

export default function GroupsPage() {
  const locale = useBusinessLocale();
  return <GroupsFeature locale={locale} />;
}
