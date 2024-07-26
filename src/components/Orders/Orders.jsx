import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../Pagination/Pagination";
import {
  SelectInput,
  DateInput,
  TextInput,
} from "../FormComponents/FormComponents";
import Loader from "../Loader/Loader";
import { connect } from "react-redux";
import { showNotification } from "../../redux/notification/notificationActions";
import { getStores } from "../../redux/stores/storeActions";

const statusArray = [
  { label: "all", value: "" },
  { label: "booked", value: "booked" },
  { label: "under MW", value: "under MW" },
  { label: "under stitching", value: "under stitching" },
  { label: "finishing work", value: "finishing work" },
  { label: "pending", value: "pending" },
  { label: "delivered", value: "delivered" },
];

const statusArray2 = [
  { label: "booked", value: "booked" },
  { label: "under MW", value: "under MW" },
  { label: "under stitching", value: "under stitching" },
  { label: "finishing work", value: "finishing work" },
  { label: "pending", value: "pending" },
  { label: "delivered", value: "delivered" },
];

function Orders({ showNotification, storesData, getStores, auth }) {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [optionStores, setOptionStores] = useState([]);
  const [filters, setFilters] = useState({
    statusValue: "",
    fromDate: "",
    toDate: "",
    store: "",
    searchValue: "",
    storeId: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    setStoresOptions();
  }, [storesData]);

  useEffect(() => {
    if (searchValue.length > 3) {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      const timeout = setTimeout(() => {
        setFilters((prev) => ({ ...prev, searchValue: searchValue }));
      }, 400);
      setDebounceTimeout(timeout);
    }
  }, [searchValue]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (currentPage == 1) {
      fetchOrders(currentPage);
    } else {
      setCurrentPage(1);
    }
  }, [filters]);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    page = page - 1;
    try {
      const limit = 10;
      const skip = page * limit;
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKENDURI}/api/order`,
        {
          params: {
            limit,
            skip,
            status: filters.statusValue,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            search: filters.searchValue,
            storeId: filters.storeId,
          },
        },
      );
      if (res.data) {
        setOrders(res.data.orders);
        setTotalOrders(res.data.totalOrdersCount);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      showNotification(
        err.response ? err.response.data.error : "Network Error",
      );
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

  const fetchStores = async () => {
    try {
      await getStores();
      console.log("stores-fetched succesfully");
    } catch (error) {
      console.log(error);
    }
  };

  async function handleStatusChange(orderId, newStatus) {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order,
      ),
    );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKENDURI}/api/order/update-status`,
        {
          orderId,
          status: newStatus,
        },
      );
      if (response) showNotification("Status updated");
    } catch (error) {
      showNotification(error.response ? error.response.error : "Network Error");
      console.log(
        "Error updating order status",
        error.response ? error.response.error : "Network Error",
      );
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  const detailedOrderView = (e, orderId) => {
    if (e.target.tagName !== "SELECT") {
      navigate(`/orders/view/${orderId}`);
    }
  };

  return (
    <>
      <div className="mt-3 flex items-center justify-between border-b-2 pb-2">
        <h5>Orders</h5>
        <div className="flex">
          {auth.user?.superAdmin && (
            <SelectInput
              options={optionStores}
              label="Store"
              id="Store"
              name="storeId"
              defaultValue={filters.storeId}
              onChange={(e) => handleFilterChange(e)}
              variant="variant-1"
              required
            />
          )}

          <TextInput
            name="searchValue"
            value={searchValue}
            variant="variant-1"
            label="Search:"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="search here"
          ></TextInput>
          <DateInput
            name="fromDate"
            value={filters.fromDate}
            label="from"
            onChange={(e) => {
              handleFilterChange(e);
            }}
            variant="variant-1"
          />
          <DateInput
            name="toDate"
            value={filters.toDate}
            label="To"
            onChange={(e) => {
              handleFilterChange(e);
            }}
            variant="variant-1"
          />
          <SelectInput
            options={statusArray}
            label="Status"
            id="status"
            name="statusValue"
            defaultValue={filters.statusValue}
            onChange={(e) => handleFilterChange(e)}
            variant="variant-1"
            required
          />
        </div>
      </div>

      {loading ? (
        <div className="h-96">
          <Loader />
        </div>
      ) : (
        <table className="main-table orders">
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

      {orders.length <= 0 && (
        <h5 className="mt-5 text-center">
          No orders Are Added Yet.
          <br /> Add orders
        </h5>
      )}
      {!loading && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={totalOrders}
        />
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    storesData: state.store,
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showNotification: (message) => dispatch(showNotification(message)),
    getStores: () => dispatch(getStores()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
