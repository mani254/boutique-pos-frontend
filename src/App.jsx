import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import LoginPage from "./pages/LoginPage";
import Notification from "./components/Notifications/Notifications";

import OrdersLayout from "./components/Orders/OrdersLayout";
import Orders from "./components/Orders/Orders";
import DetailedOrder from "./components/Orders/DetailedOrder";

import StoreLayout from "./components/Stores/StoreLayout";
import AddStore from "./components/Stores/AddStore";
import UpdateStore from "./components/Stores/updateStore";
import Stores from "./components/Stores/Stores";

import Billing from "./components/Billing/Billing";

import Categories from "./components/Category/Categories";

import AdminPageLayout from "./components/Admin/AdminPageLayout";
import Admins from "./components/Admin/Admins";
import AddAdmin from "./components/Admin/AddAdmin";
import UpdateAdmin from "./components/Admin/UpdateAdmin";

import CustomersLayout from "./components/Customers/CustomerLayout";
import Customers from "./components/Customers/Customers";

import Modal from "./components/Modal/Modal";

import "./App.css";
import { initialLogin } from "./redux/auth/authActions";

function App({ auth, modal, initialLogin }) {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoggedIn) return;
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await initialLogin(token);
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
        console.error("Initial Login Error:", err);
      }
    };
    fetchInitialData();
  }, [auth.isLoggedIn]);

  return (
    <div className="main bg-violet-50">
      <Notification />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/categories" element={<Categories />}></Route>
          <Route index element={<Dashboard />}></Route>
          <Route path="orders" element={<OrdersLayout />}>
            <Route index element={<Orders />} />
            <Route path="view/:id" element={<DetailedOrder />} />
          </Route>
          <Route path="stores" element={<StoreLayout />}>
            <Route index element={<Stores />}></Route>
            <Route path="add" element={<AddStore />} />
            <Route path="edit/:id" element={<UpdateStore />} />
          </Route>
          <Route path="/billing" element={<Billing />} />
          <Route path="admins" element={<AdminPageLayout />}>
            <Route index element={<Admins />}></Route>
            <Route path="add" element={<AddAdmin />} />
            <Route path="edit/:id" element={<UpdateAdmin />} />
          </Route>
          <Route path="/customers" element={<CustomersLayout />}>
            <Route index element={<Customers />}></Route>
          </Route>
        </Route>
      </Routes>
      {modal.showModal && (
        <Modal props={modal.modalProps} component={modal.modalComponent} />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    modal: state.modal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initialLogin: (token) => dispatch(initialLogin(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
