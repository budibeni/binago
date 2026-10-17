'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { GroupEditFeature } from '../../../../../features/core/groups/GroupEditFeature';

export default function EditGroupPage() {
  const params = useParams();
  const id = params.id as string;

  return <GroupEditFeature id={id} />;
}
