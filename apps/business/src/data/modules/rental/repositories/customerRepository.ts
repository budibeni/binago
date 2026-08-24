import { Customer } from '../../../../features/modules/rental/customers/types/customer';
import { mockRentalCustomers } from '../mock/customers';

class CustomerRepository {
  private data: Customer[];

  constructor() {
    this.data = [...mockRentalCustomers];
  }

  getAll(): Customer[] {
    return this.data;
  }

  getById(id: string): Customer | undefined {
    return this.data.find(c => c.id === id);
  }

  create(customer: Customer): Customer {
    this.data.push(customer);
    return customer;
  }

  update(id: string, updates: Partial<Customer>): Customer | undefined {
    const index = this.data.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    this.data[index] = { ...this.data[index], ...updates } as Customer;
    this.data[index].updatedAt = new Date().toISOString();
    return this.data[index];
  }

  delete(id: string): boolean {
    const index = this.data.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.data.splice(index, 1);
    return true;
  }
}

export const customerRepository = new CustomerRepository();
