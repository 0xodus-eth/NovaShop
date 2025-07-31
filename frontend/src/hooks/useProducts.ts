import { useState, useEffect } from 'react';
import { productApi } from '../services/productApi';

export interface Product {
  _id?: string;
  id?: number | string;
  name?: string;
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  image?: string;
  rating?: number | { rate: number; count: number };
  reviews?: number;
  features?: string[];
}

interface UseProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  retryCount?: number; // to trigger refetch
}

export const useProducts = (params: UseProductsParams = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: params.page || 1,
    limit: params.limit || 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productApi.getAll(params);

        if (Array.isArray(data)) {
          setProducts(data);
          setPagination((prev) => ({
            ...prev,
            total: data.length,
            totalPages: 1,
          }));
        } else if (data && data.data) {
          setProducts(data.data);
          if (data.pagination) setPagination(data.pagination);
        } else {
          setError('Invalid response format');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    params.page,
    params.limit,
    params.category,
    params.search,
    params.sortBy,
    params.sortOrder,
    params.retryCount,
  ]);

  return { products, loading, error, pagination };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productApi.getCategories();

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setError('Invalid categories data');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error fetching categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};






/*
// Fake useProducts hook to fetch products from the product API and manage loading and error states

import { useState, useEffect } from 'react';
import { productApi } from '../services/productApi';

export type ViewType = 'home' | 'products' | 'cart' | 'orders' | 'profile';

interface Product {
  id?: number | string;   // Fake Store API uses 'id', your backend might use '_id'
  _id?: string;
  title?: string;         // Fake Store API 'title'
  name?: string;          // Your backend 'name'
  description: string;
  price: number;
  category: string;
  stock?: number;
  image: string;
  rating?: { rate: number; count: number };
  features?: string[];
  reviews?: number;
}

interface UseProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const useProducts = (params: UseProductsParams = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productApi.getAll(params);

        if (Array.isArray(data)) {
          setProducts(data);
          // Fake Store API does not have pagination info
          setPagination((prev) => ({
            ...prev,
            total: data.length,
            totalPages: 1,
          }));
        } else if (data && data.data) {
          // Adjust if your backend wraps data in { data: Product[], pagination: {...} }
          setProducts(data.data);
          if (data.pagination) setPagination(data.pagination);
        } else {
          setError('Invalid response format');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    params.page,
    params.limit,
    params.category,
    params.search,
    params.sortBy,
    params.sortOrder,
  ]);

  return { products, loading, error, pagination };
};

export const useProduct = (id: string | number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productApi.getById(id);

        if (data && typeof data === 'object') setProduct(data);
        else setError('Invalid product data');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productApi.getCategories();

        if (Array.isArray(data)) setCategories(data);
        else setError('Invalid categories data');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};


*/




// src/hooks/useProducts.ts
// This hook fetches products from the product API and manages loading and error states

/*

import { useState, useEffect } from 'react';
import { productApi } from '../services/index';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  rating: number;
  reviews: number;
  features: string[];
}

interface UseProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const useProducts = (params: UseProductsParams = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getAll(params);
        
        if (response.success) {
          setProducts(response.data);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        } else {
          setError(response.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.page, params.limit, params.category, params.search, params.sortBy, params.sortOrder]);

  return { products, loading, error, pagination };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getById(id);
        
        if (response.success) {
          setProduct(response.data);
        } else {
          setError(response.error || 'Failed to fetch product');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
};

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getCategories();
        
        if (response.success) {
          setCategories(response.data);
        } else {
          setError(response.error || 'Failed to fetch categories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

*/