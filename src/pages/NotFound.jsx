import React from "react";

function NotFound() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div>
        <h1 className="text-center text-8xl">404</h1>
        <h4 className="mt-2 text-center text-3xl">Page Not Found</h4>
        <p className="mt-3 text-center text-xl">
          The page That you are looking for not available please go to the home
          page
        </p>
        <button className="mt-2 rounded-md px-3 py-2"></button>
      </div>
    </div>
  );
}

export default NotFound;
