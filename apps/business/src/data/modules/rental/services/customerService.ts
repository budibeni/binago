import { Customer, CustomerFilters } from '../../../../features/modules/rental/customers/types/customer';
import { customerRepository } from '../repositories/customerRepository';

class CustomerService {
  getCustomers(filters?: CustomerFilters): Customer[] {
    let data = customerRepository.getAll();

    if (filters) {
      if (filters.status && filters.status !== 'all') {
        data = data.filter(c => c.status === filters.status);
      }
      if (filters.type && filters.type !== 'all') {
        data = data.filter(c => c.type === filters.type);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        data = data.filter(c => {
          const matchName = c.name.toLowerCase().includes(query);
          const matchCode = c.code.toLowerCase().includes(query);
          const matchPhone = c.phone.toLowerCase().includes(query);
          
          if (c.type === 'INDIVIDUAL') {
            return matchName || matchCode || matchPhone || c.nik.toLowerCase().includes(query);
          } else {
            return matchName || matchCode || matchPhone || c.npwp.toLowerCase().includes(query);
          }
        });
      }
    }
    
    // Sort by latest created
    return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getCustomerById(id: string): Customer | undefined {
    return customerRepository.getById(id);
  }

  createCustomer(data: Omit<Customer, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Customer {
    const isCompany = data.type === 'COMPANY';
    const prefix = isCompany ? 'CUST-COM-' : 'CUST-IND-';
    const id = `${prefix}${Date.now()}`;
    const code = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCustomer = {
      ...data,
      id,
      code,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Customer;

    return customerRepository.create(newCustomer);
  }

  updateCustomer(id: string, data: Partial<Customer>): Customer | undefined {
    return customerRepository.update(id, data);
  }

  deleteCustomer(id: string): boolean {
    return customerRepository.delete(id);
  }
}

export const rentalCustomerService = new CustomerService();
