import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login.tsx";

import Register from "./pages/Register.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import Home from "./pages/Home.tsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import App from "./App.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import AnalyticsPage from "./pages/AnalyticsPage.tsx";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

const AppRouter = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      {
        element: <ProtectedRoutes />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/analytics/:code", element: <AnalyticsPage /> },
        ],
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={AppRouter} />
    </Provider>
  </StrictMode>
);
