import { FavoritesProvider } from "@/contexts/FavoritesContext";
import ProductDetail from "./ProductDetail";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * Product Detail Page
 * Displays detailed information about a product
 */
export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <FavoritesProvider>
      <ProductDetail params={params} />
    </FavoritesProvider>
  );
}
