// src/services/productApi.ts

const PRODUCT_SERVICE_URL: string =
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "https://fakestoreapi.com";

export interface ProductApiParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

// Optionally define types for Product and Category for strictness
// export interface Product { ... }
// export type Category = string;

// Helper: builds URL with query params
function buildUrl(path: string, params: Record<string, any> = {}): string {
  const url = new URL(`${PRODUCT_SERVICE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.append(key, String(value));
  }
  return url.toString();
}

export const productApi = {
  getAll: async (params?: ProductApiParams): Promise<any> => {
    const isFakeStore = PRODUCT_SERVICE_URL === "https://fakestoreapi.com/";
    const url = isFakeStore
      ? `${PRODUCT_SERVICE_URL}/products`
      : buildUrl("/products", params || {});

    // Diagnostic logging!
    console.log("Fetching products from:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const text = await response.text();
        console.error("Product list error response body:", text);
        throw new Error("Failed to fetch products");
      }
      return response.json();
    } catch (error) {
      console.error("Product list fetch failed:", error);
      throw error;
    }
  },

  getById: async (id: string | number): Promise<any> => {
    const url = `${PRODUCT_SERVICE_URL}/products/${id}`;
    console.log("Fetching single product from:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const text = await response.text();
        console.error("Product detail error response body:", text);
        throw new Error("Failed to fetch product");
      }
      return response.json();
    } catch (error) {
      console.error("Product detail fetch failed:", error);
      throw error;
    }
  },

    getCategories: async (): Promise<any> => {
    const categoriesPath =
        PRODUCT_SERVICE_URL === "https://fakestoreapi.com/"
        ? "/products/categories"
        : "/categories";
    const url = `${PRODUCT_SERVICE_URL}${categoriesPath}`;
    console.log("Fetching categories from:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
        const text = await response.text();
        console.error("Categories error response body:", text);
        throw new Error("Failed to fetch categories");
        }
        return response.json();
    } catch (error) {
        // NEW: log the error AND the URL
        console.error(`Categories fetch failed for URL: ${url}`);
        console.error(error);
        throw error;
    }
    }
};






// src/services/productApi.ts

/*

const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3002';

export const productApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${PRODUCT_SERVICE_URL}/products?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${PRODUCT_SERVICE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  getCategories: async () => {
    const response = await fetch(`${PRODUCT_SERVICE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }
};
*/



/* 

As per AI recommendation, this one is much safer than the other in comparison to the above on

// src/services/productApi.ts

const PRODUCT_SERVICE_URL: string =
  process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3002';

export interface ProductApiParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

// Helper: Safely build URLs and encode query params
function buildUrl(path: string, params?: ProductApiParams): string {
  const url = new URL(`${PRODUCT_SERVICE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

export const productApi = {
  getAll: async (params?: ProductApiParams): Promise<any> => {
    const url = buildUrl('/products', params);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // If your API requires auth: 'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // Only if your backend uses cookies/session
      });
      if (!response.ok) {
        // Optionally print server error body for debugging
        const errorText = await response.text();
        console.error('Product list error response body:', errorText);
        throw new Error('Failed to fetch products');
      }
      return response.json();
    } catch (error) {
      // For real production, you may want to not print sensitive errors, just log
      console.error('Product list fetch failed:', error);
      throw error;
    }
  },

  getById: async (id: string | number): Promise<any> => {
    // Validate id to avoid SSRF/path traversal
    if (!/^[\w-]+$/.test(String(id))) throw new Error('Invalid product id');

    const url = `${PRODUCT_SERVICE_URL}/products/${encodeURIComponent(String(id))}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Product detail error response body:', errorText);
        throw new Error('Failed to fetch product');
      }
      return response.json();
    } catch (error) {
      console.error('Product detail fetch failed:', error);
      throw error;
    }
  },

  getCategories: async (): Promise<any> => {
    const url = `${PRODUCT_SERVICE_URL}/categories`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Categories error response body:', errorText);
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    } catch (error) {
      console.error('Categories fetch failed:', error);
      throw error;
    }
  },
};


// JUSTIFICATION FOR THE ABOVE CODE


🔐 Security Improvements and Best Practices
On the front end (above):

URL Encoding: Every id and query param is encoded so there's no room for injection or path traversal.

Input Validation: Product IDs are validated to prevent SSRF or malformed requests.

Logging: Logs full errors and response body on failure, but does not expose stack traces or backend internals to UI.

Strict Accept Header: Always asks for JSON.

Safe credentials usage: Only include credentials: 'include' if your backend handles session cookies; otherwise, remove it.

What you must also do on your own backend:

Validate ALL params and inputs server-side. Never trust client values.

Use authorization for sensitive routes (only allow logged-in users to create/update/delete).

Apply CORS policies so only allowed origins can access your API.

NEVER send stack traces or sensitive details in API error messages.

Rate limit APIs to prevent abuse.

Sanitize query/filter/search inputs to avoid SQL injection or NoSQL injection.

🟢 How to use
Set your .env.local:

text
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:3002
or whatever your backend is.

Use the above code as your API service in Next.js/React.

If you add authentication, add Authorization headers as needed.

🚩 Notes
For production, make sure you set up HTTPS (not just http://localhost).

Never log secrets or tokens.

If you use any other HTTP methods (POST, PUT, DELETE), always set Content-Type: application/json and sanitize all inputs BOTH client- and server-side.

⭐️ In Summary
THIS is the more secure, robust, and scalable API client code for your own backend.
If you want even tighter type safety, define TypeScript interfaces for Product, Category, etc.

*/