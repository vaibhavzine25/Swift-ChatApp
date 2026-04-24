import {
  createBrowserRouter,
  RouterProvider,
  Outlet, 
  ScrollRestoration,
} from "react-router-dom";
import './App.css';
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Home from "./components/pages/Home";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "./components/pages/VerifyEmail";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import { AuthProvider, useAuth } from "./components/context/authContext";
import axios from "axios";
import ChatHome from "./components/pages/ChatHome";
import { ProfileProvider } from "./components/context/profileContext";
import { useEffect } from "react";
import Profile from "./components/Profile";
import { baseUrl } from "../apiConfig";

const Layout = () => {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [isAuthenticated]);

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password/:id/:token",
        element: <ResetPassword />,
      },
      {
        path: "users/:id/verify/:token",
        element: <VerifyEmail />,
      },
      {
        path: "chathome",
        element: <ChatHome />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

function App() {
  axios.defaults.baseURL = baseUrl;
  axios.defaults.withCredentials = true;

  return (
    <>
      <AuthProvider>
        <ProfileProvider>
          <RouterProvider router={router} />
          <Toaster />
        </ProfileProvider>
      </AuthProvider>
    </>
  );
}

export default App;
