import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import Home from "../pages/Home";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/SignUp";
import Main from "../components/layout/Main";
import AboutPage from "../pages/AboutPage";
import MenuPage from "../pages/MenuPage";
import ContactPage from "../pages/ContactPage";
import AuthWrapper from "../@base/AuthWrapper";
import DashboardPage from "../pages/admin/DashboardPage";
import OrderPage from "../pages/admin/OrderPage";
import ProductsPage from "../pages/admin/ProductsPage";
import UserPage from "../pages/admin/UserPage";
import AdminLayout from "../components/layout/AdminLayout";
import PrivateRoute from "./PrivateRoute";

const Root = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        {
          path: "/",
          element: (
            <AuthWrapper>
              <Home />
            </AuthWrapper>
          ),
        },

        {
          path: "/menu",
          element: <MenuPage />,
        },

        // {
        //   path: "/blog",
        //   element: <Blog />,
        // },

        {
          path: "/contact",
          element: <ContactPage />,
        },
        {
          path: "/about",
          element: <AboutPage />,
        },

        // {
        //   path: "/profile",
        //   element: (
        //     <PrivateRoot>
        //       <Profile />
        //     </PrivateRoot>
        //   ),
        // },
      ],
    },
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          path: "/signIn",
          element: <SignIn />,
        },
        {
          path: "/signUp",
          element: <SignUp />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      ),
      children: [
        {
          path: "/admin/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "/admin/products",
          element: <ProductsPage />,
        },
        {
          path: "/admin/orders",
          element: <OrderPage />,
        },
        {
          path: "/admin/users",
          element: <UserPage />,
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default Root;
