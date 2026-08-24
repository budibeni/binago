import React from 'react';
import { CustomersFeature } from '../../../../features/modules/rental/customers/CustomersFeature';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rental Customers | ADATRACK',
  description: 'Manage rental individual and company customers',
};

export default function RentalCustomersPage() {
  return <CustomersFeature />;
}
