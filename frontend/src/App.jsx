import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./hooks/useCart";
import { CatalogProvider } from "./hooks/useCatalog";

export default function App() {
  return (
    <CartProvider>
      <CatalogProvider>
        <AppRoutes />
      </CatalogProvider>
    </CartProvider>
  );
}
