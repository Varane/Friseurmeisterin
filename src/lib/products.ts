import productsData from '@data/products.json';

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  priceEur: number;
  currency: 'EUR';
  featured: boolean;
  inStock: boolean;
  images: ProductImage[];
  shortDescription: string;
  description: string;
  usage?: string;
  ingredients?: string;
  paymentLinkUrl?: string;
};

const isProduct = (item: unknown): item is Product => {
  if (!item || typeof item !== 'object') return false;
  const product = item as Product;
  return Boolean(product.id && product.slug && product.name && product.category);
};

export const getProducts = (): Product[] => {
  const rawProducts = Array.isArray(productsData)
    ? productsData
    : (productsData as { products?: unknown[] })?.products ?? [];
  return rawProducts.filter(isProduct);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return getProducts().find((product) => product.slug === slug);
};

export const getFeaturedProducts = (): Product[] => {
  return getProducts()
    .filter((product) => product.featured)
    .slice(0, 3);
};

export const getProductCategories = (): string[] => {
  const categories = new Set<string>();
  getProducts().forEach((product) => categories.add(product.category));
  return Array.from(categories).sort();
};

export type SortOption = 'default' | 'price-asc' | 'price-desc';

export const sortProducts = (products: Product[], sort: SortOption): Product[] => {
  const sorted = [...products];
  if (sort === 'price-asc') {
    return sorted.sort((a, b) => a.priceEur - b.priceEur);
  }
  if (sort === 'price-desc') {
    return sorted.sort((a, b) => b.priceEur - a.priceEur);
  }
  return sorted.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
};
