import React from "react";

import { NavLink } from "react-router-dom";
import "./Navbar.css";

import { TbLayoutDashboard } from "react-icons/tb";
import {
  MdReceiptLong,
  MdAdminPanelSettings,
  MdCategory,
  MdLogout,
} from "react-icons/md";
import { FaStore } from "react-icons/fa6";
import { HiMiniUsers, HiShoppingBag } from "react-icons/hi2";

function Navbar() {
  return (
    <div className="flex h-screen w-full flex-col justify-between py-2">
      <div>
        <div className="mx-2 flex flex-col items-center border-b-2 xl:flex-row">
          <img
            className="w-14"
            src="/images/logo.png"
            alt="shruthi-billing-log"
          />
          <h6 className="text-lg font-bold xl:text-xl">Shruthi</h6>
        </div>
        <nav className="my-3 px-4">
          <p className="mb-3 text-sm text-neutral-500">Menu</p>
          <ul>
            <li className="mb-1">
              <NavLink className="nav-link" to="/">
                <span className="icon inline-block text-2xl">
                  <TbLayoutDashboard />
                </span>
                <p className="ml-4 hidden xl:block">Dashboard</p>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink className="nav-link" to="/orders">
                <span className="icon inline-block text-2xl">
                  <HiShoppingBag />
                </span>
                <p className="ml-4 hidden xl:block">Orders</p>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink className="nav-link" to="/customers">
                <span className="icon inline-block text-2xl">
                  <HiMiniUsers />
                </span>
                <p className="ml-4 hidden xl:block">Customers</p>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink className="nav-link" to="/stores">
                <span className="icon inline-block text-2xl">
                  <FaStore />
                </span>
                <p className="ml-4 hidden xl:block">Stores</p>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink className="nav-link" to="/billing">
                <span className="icon inline-block text-2xl">
                  <MdReceiptLong />
                </span>
                <p className="ml-4 hidden xl:block">Billing</p>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink className="nav-link" to="/categories">
                <span className="icon inline-block text-2xl">
                  <MdCategory />
                </span>
                <p className="ml-4 hidden xl:block">Categories</p>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink className="nav-link" to="/admins">
                <span className="icon inline-block text-2xl">
                  <MdAdminPanelSettings />
                </span>
                <p className="ml-4 hidden xl:block">Admins</p>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-3 flex cursor-pointer items-center justify-center border-t-2 xl:justify-start">
        <span className="icon inline-block p-2 text-2xl text-red-500">
          <MdLogout />
        </span>
        <p className="ml-4 hidden xl:block">Logout</p>
      </div>
    </div>
  );
}

export default Navbar;
