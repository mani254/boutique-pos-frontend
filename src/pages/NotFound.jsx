import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Not Found Page - sruthi boutique</title>
        <meta name="description" content="not found page" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-center text-3xl lg:text-8xl">404</h1>
          <h4 className="mt-2 text-center text-xl lg:text-3xl">
            Page Not Found
          </h4>
          <p className="mt-3 text-center text-lg lg:text-xl">
            The page That you are looking for not available please go to the
            home page
          </p>
          <button
            className="mt-2 rounded-md bg-violet-500 px-4 py-2 text-white"
            onClick={() => {
              navigate("/");
            }}
          >
            Home
          </button>
        </div>
      </div>
    </>
  );
}

export default NotFound;
