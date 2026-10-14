import React from 'react';
import type { Metadata } from 'next';
import { LoginFeature } from '../../features/auth/components/LoginFeature';

export const metadata: Metadata = {
  title: 'Masuk ke Akun | ADATRACK Business',
  description: 'Masuk ke Platform ADATRACK Business - Solusi Cerdas Analisa Performa Kendaraan dan Manajemen Armada',
};

export default function LoginPage() {
  return <LoginFeature />;
}
