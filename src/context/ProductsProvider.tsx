import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/types";
import { fetchProducts } from "@/lib/products";

type ProductsContextValue = {
  products: Product[];
  loading: boolean;
};

const ProductsContext = createContext<ProductsContextValue>({ products: [], loading: true });

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchProducts().then((list) => {
      if (active) {
        setProducts(list);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return <ProductsContext.Provider value={{ products, loading }}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  return useContext(ProductsContext);
}
