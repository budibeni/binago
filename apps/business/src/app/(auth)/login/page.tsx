'use client';

import { useState } from 'react';
import { login } from '@/app/actions/auth';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<{code: string, name: string}[] | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    if (companies) {
      // Re-add email and password since we are in selection step
      formData.append('email', email);
      formData.append('password', password);
    }
    
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.multiple_companies) {
      setCompanies(result.companies);
      setEmail(formData.get("email") as string);
      setPassword(formData.get("password") as string);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {companies ? 'Select Your Company' : 'Sign in to ADATRACK'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Business Fleet Management
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!companies ? (
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-700 text-center">
                Your account is associated with multiple companies. Please select one:
              </p>
              <div className="space-y-2">
                {companies.map((comp) => (
                  <label key={comp.code} className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="company_code" value={comp.code} required className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                    <span className="text-gray-900 font-medium">{comp.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (companies ? 'Continue' : 'Sign in')}
            </button>
          </div>
          
          {companies && (
            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setCompanies(null)} 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                &larr; Back to login
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
