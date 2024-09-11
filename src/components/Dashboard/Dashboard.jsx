import React, { useState, useEffect } from "react";
import { DateInput, SelectInput } from "../FormComponents/FormComponents";
import Header from "../Header/Header.jsx";
import { getStores } from "../../redux/stores/storeActions.js";
import { connect } from "react-redux";
import axios from "axios";
import PiChart from "../PiChart/PiChart.jsx";
import Loader from "../Loader/Loader.jsx";
import { Helmet } from "react-helmet-async";

const statusArray2 = [
  { label: "booked", value: "booked" },
  { label: "under MW", value: "under MW" },
  { label: "under stitching", value: "under stitching" },
  { label: "finishing work", value: "finishing work" },
  { label: "pending", value: "pending" },
  { label: "delivered", value: "delivered" },
];

function Dashboard({ storesData, getStores }) {
  const [stores, setStores] = useState([]);

  const [numsInfo, setNumsInfo] = useState([
    { count: 0, title: "Total Income" },
    { count: 0, title: "Total Orders" },
    { count: 0, title: "Pending Deliveries" },
    { count: 0, title: "Today Deliveries" },
    { count: 0, title: "Pending Amount" },
    { count: 0, title: "Over Due" },
  ]);

  const [optionStores, setOptionStores] = useState([]);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    storeId: "",
  });
  const [graphLoading, setGraphLoading] = useState(false);
  const [countLoading, setCountLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    fetchDashboardCount();
  }, [filters]);

  useEffect(() => {
    setStoresOptions();
  }, [storesData]);

  useEffect(() => {
    fetchContribution();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [filters.storeId]);

  const fetchOrders = async () => {
    try {
      const fromDate = new Date();
      const toDate = new Date();
      toDate.setDate(fromDate.getDate() + 3);
      setOrdersLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKENDURI}/api/order`,
        {
          params: {
            limit: 20,
            skip: 0,
            status: "",
            fromDate: fromDate,
            toDate: toDate,
            search: "",
            storeId: filters.storeId,
          },
        },
      );
      if (res.data) {
        setOrdersLoading(false);
        setOrders(res.data.orders);
      }
    } catch (err) {
      setOrdersLoading(true);
      console.log(err);
    }
  };

  const fetchStores = async () => {
    try {
      await getStores();
      console.log("stores-fetched succesfully");
    } catch (error) {
      console.log(error);
    }
  };

  function setStoresOptions() {
    if (storesData.stores.length >= 1) {
      const options = storesData.stores.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      options.unshift({ value: "", label: "All" });
      setOptionStores(options);
    }
  }

  async function fetchDashboardCount() {
    setCountLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKENDURI}/api/dashboard/dashboardcount`,
        {
          params: {
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            storeId: filters.storeId,
          },
        },
      );
      if (res.data) {
        setNumsInfo([
          { count: res.data.totalIncome, title: "Total Income" },
          { count: res.data.totalOrders, title: "Total Orders" },
          { count: res.data.pendingDeliveries, title: "Pending Deliveries" },
          { count: res.data.totalDeliveries, title: "Total Deliveries" },
          { count: res.data.pendingAmount, title: "Pending Amount" },
          { count: res.data.overDue, title: "Over Due" },
        ]);
        setCountLoading(false);
      }
    } catch (err) {
      console.log(err);
      setCountLoading(false);
      showNotification(
        err.response ? err.response.data.error : "Network Error",
      );
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  async function fetchContribution() {
    setGraphLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKENDURI}/api/dashboard/getStoreContribution`,
      );
      if (res.data) {
        let storesData = res.data.sort((a, b) => b.percentage - a.percentage);
        let colors = [
          "#9061F9",
          "#3F83F8",
          "#F05252",
          "#6875F5",
          "#C27803",
          "#E74694",
          "#0E9F6E",
        ];
        for (let i in storesData) {
          storesData[i].color = colors[i];
        }
        setStores(storesData);
        setGraphLoading(false);
      }
    } catch (err) {
      console.log(err);
      setGraphLoading(false);
      showNotification(
        err.response ? err.response.data.error : "Network Error",
      );
    }
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Sruthi Boutique</title>
        <meta
          name="description"
          content="Overview of activities, orders, and store management at Sruthi Boutique."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div>
        <Header />
        <div className="flex w-full items-center justify-between rounded-md border-b-2 border-gray-200 p-2">
          <h5>Dashboard</h5>
          <div className="jusity-between flex items-center">
            <DateInput
              variant="variant-1"
              label="From:"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
            />
            <DateInput
              variant="variant-1"
              label="To:"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
            />
            <SelectInput
              options={optionStores}
              label="Store:"
              variant="variant-1"
              value={filters.storeId}
              name="storeId"
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          {graphLoading ? (
            <div className="min-w-60 border-gray-200 bg-white shadow-sm">
              <Loader />
            </div>
          ) : (
            <div className="graph flex items-center rounded-2xl border-2 border-gray-200 bg-white p-5 pr-4 shadow-sm">
              <PiChart storesInfo={stores} />
              <div>
                <h6>Stores & Sales</h6>
                <ul>
                  {stores.map((store, index) => {
                    return (
                      <li key={index} className="flex items-center">
                        <span
                          className="mr-2 block h-3 w-3 rounded-full"
                          style={{ background: store.color }}
                        ></span>

                        {store.name}
                        <span className="ml-2 inline-block text-sm">
                          {/* {" ("} */}
                          {/* {store.percentage}%{") "} */}
                          {store.store}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          <div className="grid flex-1 grid-cols-3 gap-3">
            {numsInfo.map((item, index) => (
              <IncomeDisplay
                title={item.title}
                value={item.count}
                key={index}
                countLoading={countLoading}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-md border-b-2 border-gray-200 p-2">
          <h5>Next Three Days Deliveries</h5>
        </div>

        {ordersLoading ? (
          <div className="h-96">
            <Loader />
          </div>
        ) : (
          <table className="main-table orders mt-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
                <th>Invoice</th>
                <th>Categories</th>
                <th>Total</th>
                <th>Advance</th>
                <th>Pending</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length >= 1 &&
                orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={(e) => detailedOrderView(e, order._id)}
                    className="transition hover:bg-gray-100"
                  >
                    <td>{order.customer.name}</td>
                    <td>{order.customer.number}</td>
                    <td>{order.invoice}</td>
                    <td>{order.categories}</td>
                    <td>{order.price}</td>
                    <td>{order.advance}</td>
                    <td>{order.price - order.advance}</td>
                    <td>
                      <SelectInput
                        options={statusArray2}
                        label="Status"
                        id="status"
                        name="status"
                        defaultValue={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        variant="variant-1"
                        required
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function IncomeDisplay({ title, value, countLoading, index }) {
  const isAmount = (index) => {
    if (index == 0 || index == 4) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="w-full rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-md mb-2 text-gray-500">{title}</p>
      {countLoading ? (
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline h-5 w-5 animate-spin fill-violet-500 text-gray-200 dark:text-gray-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <>
          {isAmount(index) && <span className="text-xl font-bold">₹</span>}{" "}
          <span className="text-xl font-bold">{value}</span>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    storesData: state.store,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getStores: () => dispatch(getStores()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
