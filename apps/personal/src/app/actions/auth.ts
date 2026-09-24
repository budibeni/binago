'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  let company_code = formData.get('company_code') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  // Extract company code from email domain if not explicitly provided
  // e.g., admin@tesst001.local -> TESST001
  if (!company_code && email.includes('@')) {
    const domainPart = email.split('@')[1];
    if (domainPart) {
      company_code = domainPart.split('.')[0].toUpperCase();
    }
  }

  if (!company_code) {
    return { error: 'Could not determine company code from email' };
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, company_code }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || data.error || 'Invalid credentials' };
    }

    if (data.status === 'success' && data.data?.token) {
      const token = data.data.token;
      const user = data.data.user;

      // Store token in cookie
      cookies().set({
        name: 'access_token',
        value: token,
        httpOnly: false, // Must be readable by client api.ts to send in Authorization header
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      // We can also store user info in a cookie for client-side access,
      // but without httpOnly so the client can read the role.
      cookies().set({
        name: 'user_profile',
        value: JSON.stringify(user),
        httpOnly: false,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
      });
      
      // If user needs to change password, we should redirect to password change page.
      // But for now, just redirect to dashboard.
    } else {
      return { error: 'Invalid response from server' };
    }
  } catch (error: any) {
    return { error: error.message || 'An error occurred during login' };
  }

  redirect('/');
}

export async function logout() {
  cookies().delete('access_token');
  cookies().delete('user_profile');
  
  // Optionally call backend to revoke token
  
  redirect('/login');
}
