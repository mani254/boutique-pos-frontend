import React from "react";

import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { connect } from "react-redux";

import { TbLayoutDashboard } from "react-icons/tb";
import {
  MdReceiptLong,
  MdAdminPanelSettings,
  MdCategory,
  MdLogout,
} from "react-icons/md";
import { FaStore } from "react-icons/fa6";
import { HiMiniUsers, HiShoppingBag } from "react-icons/hi2";
import { logout } from "../../redux/auth/authActions";

function Navbar({ auth, logout }) {
  return (
    <div className="flex h-screen w-full flex-col justify-between py-2">
      <div>
        <div className="mx-2 flex flex-col items-center border-b-2 xl:flex-row">
          <img
            className="w-14"
            src={
              auth?.user?.superAdmin
                ? "/images/logo.png"
                : `${import.meta.env.VITE_APP_BACKENDURI}/${auth.user?.store.image}`
            }
            alt="shruthi-billing-log"
          />
          <h6 className="text-lg font-bold xl:text-xl">
            {auth?.user?.store ? auth?.user?.store?.name : "Sruthi Boutique"}
          </h6>
        </div>
        <nav className="my-3 px-4">
          <p className="mb-3 text-sm text-neutral-500">Menu</p>
          <ul>
            {auth?.user?.superAdmin && (
              <li className="mb-1">
                <NavLink className="nav-link" to="/">
                  <span className="icon inline-block text-2xl">
                    <TbLayoutDashboard />
                  </span>
                  <p className="ml-4 hidden xl:block">Dashboard</p>
                </NavLink>
              </li>
            )}

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

            {auth?.user?.superAdmin && (
              <li className="mb-1">
                <NavLink className="nav-link" to="/stores">
                  <span className="icon inline-block text-2xl">
                    <FaStore />
                  </span>
                  <p className="ml-4 hidden xl:block">Stores</p>
                </NavLink>
              </li>
            )}
            {!auth?.user?.superAdmin && (
              <li className="mb-1">
                <NavLink className="nav-link" to="/billing">
                  <span className="icon inline-block text-2xl">
                    <MdReceiptLong />
                  </span>
                  <p className="ml-4 hidden xl:block">Billing</p>
                </NavLink>
              </li>
            )}
            <li className="mb-1">
              <NavLink className="nav-link" to="/categories">
                <span className="icon inline-block text-2xl">
                  <MdCategory />
                </span>
                <p className="ml-4 hidden xl:block">Categories</p>
              </NavLink>
            </li>
            {auth?.user?.superAdmin && (
              <li className="mb-1">
                <NavLink className="nav-link" to="/admins">
                  <span className="icon inline-block text-2xl">
                    <MdAdminPanelSettings />
                  </span>
                  <p className="ml-4 hidden xl:block">Admins</p>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div
        className="mx-3 flex cursor-pointer items-center justify-center border-t-2 xl:justify-start"
        onClick={() => {
          logout();
        }}
      >
        <span className="icon inline-block p-2 text-2xl text-red-500">
          <MdLogout />
        </span>
        <p className="ml-4 hidden xl:block">Logout</p>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
