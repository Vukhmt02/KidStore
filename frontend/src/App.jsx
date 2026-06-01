import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./hooks/useCart";

export default function App() {
  return (
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  );
}
