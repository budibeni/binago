'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerForm } from '@/features/modules/rental/customers/components/CustomerForm';
import { rentalCustomerService } from '@/data/modules/rental';
import { toast } from '@adatrack/ui';

function EditCustomerForm() {
  const router = useRouter();
  const [customerId, setCustomerId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('adatrack_edit_customer_id');
      if (id) setCustomerId(id);
    }
  }, []);
  
  // Find customer
  const customer = React.useMemo(() => {
    if (!customerId) return null;
    const all = rentalCustomerService.getCustomers({});
    return all.find(c => c.id === customerId) || null;
  }, [customerId]);

  if (!customer) {
    return <div className="p-8 text-center text-muted-foreground">Pelanggan tidak ditemukan atau ID tidak valid.</div>;
  }

  return (
    <CustomerForm
      layout="default"
      open={true}
      customer={customer}
      onCancel={() => {
        router.push('/rental/customers');
      }}
      onSave={(data) => {
        rentalCustomerService.updateCustomer(customer.id, data);
        toast.success('Data pelanggan berhasil diperbarui.');
        router.push('/rental/customers');
      }}
    />
  );
}

export default function EditCustomerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Memuat...</div>}>
      <EditCustomerForm />
    </Suspense>
  );
}
