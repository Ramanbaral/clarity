import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Login from "./pages/auth/Login.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import Transactions from "./pages/Transactions.tsx";
import Add from "./pages/Add.tsx";
import ProtectedRoute from "./routes/ProtectedRoutes.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  //Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/add",
        element: <Add />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
