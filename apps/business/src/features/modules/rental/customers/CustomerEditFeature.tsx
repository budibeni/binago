'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { CustomerForm } from './components/CustomerForm';
import { rentalCustomerService } from '@/data/modules/rental/services/customerService';
import type { Customer } from './types/customer';

export function CustomerEditFeature({ id }: { id: string }) {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = t.rentalCustomers;
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customers = await rentalCustomerService.getCustomers();
        const found = customers.find(c => c.id === id);
        if (found) {
          setCustomer(found);
        } else {
          alert('Pelanggan tidak ditemukan');
          router.push('/rental/customers');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, router]);

  const handleSave = (data: any) => {
    // Implement API call to save customer here
    console.log('Saved edited customer:', data);
    alert(labels.updateSuccess || 'Pelanggan berhasil diperbarui');
    router.push('/rental/customers');
    router.refresh();
  };

  const handleCancel = () => {
    router.push('/rental/customers');
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-neutral-50/30 dark:bg-neutral-950">
      <CustomerForm
        customer={customer}
        onCancel={handleCancel}
        onSave={handleSave}
        labels={labels}
      />
    </div>
  );
}
