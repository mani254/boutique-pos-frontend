import React from "react";
import Navbar from "../Navbar/Navbar";

import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex min-h-full">
      <div className="transition-width relative w-24 rounded-br-xl bg-white shadow-md duration-300 ease-in-out xl:w-64">
        <Navbar />
      </div>
      <div className="relative h-screen flex-1 overflow-y-auto px-4">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
