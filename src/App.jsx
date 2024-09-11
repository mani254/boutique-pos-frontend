import React, { useEffect, Suspense, lazy } from "react";
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./components/Loader/Loader";

import Notification from "./components/Notifications/Notifications";
import Modal from "./components/Modal/Modal";

import { initialLogin } from "./redux/auth/authActions";

// Lazy load components
const AdminRoute = lazy(() => import("./components/AdminRoutes/AdminRoute"));
const Layout = lazy(() => import("./components/Layout/Layout"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OrdersLayout = lazy(() => import("./components/Orders/OrdersLayout"));
const Orders = lazy(() => import("./components/Orders/Orders"));
const DetailedOrder = lazy(() => import("./components/Orders/DetailedOrder"));
const StoreLayout = lazy(() => import("./components/Stores/StoreLayout"));
const AddStore = lazy(() => import("./components/Stores/AddStore"));
const UpdateStore = lazy(() => import("./components/Stores/updateStore"));
const Stores = lazy(() => import("./components/Stores/Stores"));
const Billing = lazy(() => import("./components/Billing/Billing"));
const Categories = lazy(() => import("./components/Category/Categories"));
const AdminPageLayout = lazy(
  () => import("./components/Admin/AdminPageLayout"),
);
const Admins = lazy(() => import("./components/Admin/Admins"));
const AddAdmin = lazy(() => import("./components/Admin/AddAdmin"));
const UpdateAdmin = lazy(() => import("./components/Admin/UpdateAdmin"));
const CustomersLayout = lazy(
  () => import("./components/Customers/CustomerLayout"),
);
const Customers = lazy(() => import("./components/Customers/Customers"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App({ auth, modal, initialLogin }) {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoggedIn) return;
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await initialLogin(token);
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
      <Suspense
        fallback={
          <div className="h-screen w-full">
            <Loader />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {auth.user ? (
            <Route path="/" element={<Layout />}>
              <Route path="/categories" element={<Categories />} />
              <Route index element={<AdminRoute component={<Dashboard />} />} />
              <Route path="orders" element={<OrdersLayout />}>
                <Route index element={<Orders />} />
                <Route path="view/:id" element={<DetailedOrder />} />
              </Route>

              {auth.user.superAdmin && (
                <Route path="stores" element={<StoreLayout />}>
                  <Route index element={<Stores />} />
                  <Route path="add" element={<AddStore />} />
                  <Route path="edit/:id" element={<UpdateStore />} />
                </Route>
              )}

              {!auth.user.superAdmin && (
                <Route path="/billing" element={<Billing />} />
              )}

              {auth.user.superAdmin && (
                <Route path="admins" element={<AdminPageLayout />}>
                  <Route index element={<Admins />} />
                  <Route path="add" element={<AddAdmin />} />
                  <Route path="edit/:id" element={<UpdateAdmin />} />
                </Route>
              )}
              <Route path="/customers" element={<CustomersLayout />}>
                <Route index element={<Customers />} />
              </Route>
            </Route>
          ) : (
            <Route
              path="/"
              element={
                <div className="h-screen w-full">
                  <Loader />
                </div>
              }
            />
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
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
