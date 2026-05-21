import { lazy, Suspense, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { categories as initialCategories } from './data/categories';
import { orders as initialOrders } from './data/orders';
import { products as initialProducts } from './data/products';
import type { Category, Product } from './types';

const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const Products = lazy(() => import('./pages/Products').then((module) => ({ default: module.Products })));
const Inventory = lazy(() => import('./pages/Inventory').then((module) => ({ default: module.Inventory })));
const Orders = lazy(() => import('./pages/Orders').then((module) => ({ default: module.Orders })));
const Categories = lazy(() =>
  import('./pages/Categories').then((module) => ({ default: module.Categories })),
);

const pageFallback = (
  <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-16 text-center shadow-panel">
    <div className="mx-auto h-12 w-12 animate-pulse-soft rounded-2xl bg-slate-100" />
    <p className="mt-4 text-sm font-medium text-slate-500">جار تحميل محتوى الصفحة...</p>
  </div>
);

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [orders] = useState(initialOrders);
  const [categories, setCategories] = useState(initialCategories);

  const handleUpsertProduct = (
    payload: Omit<Product, 'id' | 'soldCount' | 'imageColor' | 'maxStock'>,
    productId?: string,
  ) => {
    setProducts((currentProducts) => {
      if (productId) {
        return currentProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                ...payload,
                maxStock: Math.max(product.maxStock, payload.stockQuantity || 0, payload.minStock * 2),
              }
            : product,
        );
      }

      const totalProducts = currentProducts.length + 1;

      return [
        {
          id: `prod-${Date.now()}`,
          soldCount: 0,
          imageColor: totalProducts % 2 === 0 ? 'bg-sky-100 text-sky-700' : 'bg-violet-100 text-violet-700',
          maxStock: Math.max(payload.stockQuantity * 2, payload.minStock * 3, 20),
          ...payload,
        },
        ...currentProducts,
      ];
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
  };

  const handleUpdateStock = (productId: string, stockQuantity: number) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              stockQuantity,
              maxStock: Math.max(product.maxStock, stockQuantity, product.minStock * 2),
            }
          : product,
      ),
    );
  };

  const handleUpdateCategory = (categoryId: string, name: string, description: string) => {
    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === categoryId ? { ...category, name, description } : category,
      ),
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((currentCategories) =>
      currentCategories.filter((category) => category.id !== categoryId),
    );
  };

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={pageFallback}>
              <Dashboard products={products} orders={orders} />
            </Suspense>
          }
        />
        <Route
          path="/products"
          element={
            <Suspense fallback={pageFallback}>
              <Products
                products={products}
                categories={categories as Category[]}
                onUpsertProduct={handleUpsertProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </Suspense>
          }
        />
        <Route
          path="/inventory"
          element={
            <Suspense fallback={pageFallback}>
              <Inventory products={products} onUpdateStock={handleUpdateStock} />
            </Suspense>
          }
        />
        <Route
          path="/orders"
          element={
            <Suspense fallback={pageFallback}>
              <Orders orders={orders} />
            </Suspense>
          }
        />
        <Route
          path="/categories"
          element={
            <Suspense fallback={pageFallback}>
              <Categories
                categories={categories as Category[]}
                products={products}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
