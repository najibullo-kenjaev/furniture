import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Private from "./routes/Private";
import Layout from "./components/Layout";

const LoginPage = lazy(() => import("./features/auth/LoginPage"));
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const ProductsPage = lazy(() => import("./features/products/ProductsPage"));
const ProductForm = lazy(() => import("./features/products/ProductForm"));
const CategoriesPage = lazy(
  () => import("./features/categories/CategoriesPage")
);
const CategoryForm = lazy(() => import("./features/categories/CategoryForm"));
// const LeadsPage = lazy(() => import('./features/leads/LeadsPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-4">Загрузка…</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <Private>
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products">
                      <Route index element={<ProductsPage />} />
                      <Route path="new" element={<ProductForm />} />
                      <Route path=":id" element={<ProductForm />} />
                    </Route>
                    <Route path="categories">
                      <Route index element={<CategoriesPage />} />
                      <Route path="new" element={<CategoryForm />} />
                      <Route path=":id" element={<CategoryForm />} />
                    </Route>
                    {/* <Route path="leads" element={<LeadsPage />} />   */}
                  </Route>
                </Routes>
              </Private>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
