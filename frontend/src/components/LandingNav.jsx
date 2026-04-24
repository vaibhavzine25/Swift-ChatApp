
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/authContext";

const LandingNav = () => {
  const { isAuthenticated } = useAuth();
  return (
    <nav className="">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-6 ">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Swift Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            Swift-Chat
          </span>
        </Link>
        <div
          className="hidden w-full md:flex md:w-auto gap-3"
          id="navbar-default"
        >
          <Link
            to={isAuthenticated ? "/chathome" : "/login"}
            className="block py-1 px-2 text-white hover:text-[#1B57E9]  text-lg font-medium  hover:border-[#1B57E9]"
          >
            {isAuthenticated ? "Home" : "Login"}
          </Link>
          <Link
            to="/"
            className="block py-1 px-2 text-white hover:text-[#1B57E9]  text-lg font-medium  hover:border-[#1B57E9]"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
