import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "../src/routes/index";

export const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  );
}