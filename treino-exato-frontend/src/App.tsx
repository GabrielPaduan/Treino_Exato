import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "../src/routes/index";
import { AuthProvider } from "../src/shared/context/auth_context";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </BrowserRouter>
  );
}