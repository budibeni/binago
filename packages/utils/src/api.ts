export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    public message: string,
    public rawData: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Token management can be handled by interceptors or explicitly passed
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
      if (match) return match[2];
    }
    return null;
  }

  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, headers, ...customConfig } = options;

    let url = `${this.baseURL}${endpoint}`;
    
    // Proxy client-side requests through Next.js middleware (REQUIRED for both local and Coolify)
    // because the Next.js server acts as an API gateway that routes to the correct internal Docker containers
    // (e.g., api-vehicle:8084 vs service-websocket:8080)
    if (typeof window !== 'undefined') {
      if (url.startsWith('http')) {
        const urlObj = new URL(url);
        url = urlObj.pathname + urlObj.search;
      }
    }
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const qs = searchParams.toString();
      if (qs) {
        url += `?${qs}`;
      }
    }

    const token = this.getToken();
    const businessType = process.env.NEXT_PUBLIC_BUSINESS_TYPE;
    
    const config: RequestInit = {
      ...customConfig,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(businessType ? { 'X-Business-Type': businessType } : {}),
        ...headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Handle 401 Unauthorized for token refresh or redirect
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            // Optional: trigger custom event for logout
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          }
        }
        
        throw new APIError(
          response.status,
          data?.error_code || 'UNKNOWN_ERROR',
          data?.message || 'An error occurred',
          data
        );
      }

      // Return data object directly if status is success
      if (data && data.status === 'success') {
        return data.data as T;
      }
      return data as T;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(500, 'NETWORK_ERROR', error instanceof Error ? error.message : 'Network error', null);
    }
  }

  get<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body: any, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body: any, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body: any, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new APIClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1');
