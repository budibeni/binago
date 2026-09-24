import re

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/app/actions/auth.ts", "r") as f:
    content = f.read()

replacement = """export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const company_code = formData.get('company_code') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const body: any = { email, password };
    if (company_code) {
      body.company_code = company_code;
    }

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || data.error || 'Invalid credentials' };
    }

    if (data.status === 'multiple_companies') {
      return { 
        multiple_companies: true, 
        companies: data.data.companies,
        email, 
        password 
      };
    }

    if (data.status === 'success' && data.data?.token) {
"""

pattern = re.compile(
    r'export async function login\(formData: FormData\) \{.*?(?=const token = data\.data\.token;)',
    re.DOTALL
)

new_content = pattern.sub(replacement, content)

with open("/home/arfian107/Projects/adatrack/frontend/apps/business/src/app/actions/auth.ts", "w") as f:
    f.write(new_content)
