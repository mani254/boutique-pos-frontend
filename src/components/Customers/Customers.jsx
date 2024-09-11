import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../Pagination/Pagination";
import { TextInput, SelectInput } from "../FormComponents/FormComponents";
import Loader from "../Loader/Loader";
import { connect } from "react-redux";
import { showNotification } from "../../redux/notification/notificationActions";
import { getStores } from "../../redux/stores/storeActions";
import { Helmet } from "react-helmet-async";

function Customers({ showNotification, storesData, getStores, auth }) {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomersCount, setTotalCustomersCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [optionStores, setOptionStores] = useState([]);
  const [filters, setFilters] = useState({
    searchValue: "",
    storeId: "",
  });

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    setStoresOptions();
  }, [storesData]);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeout = setTimeout(() => {
      setFilters((prev) => ({ ...prev, searchValue: searchValue }));
    }, 400);
    setDebounceTimeout(timeout);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchValue]);

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (currentPage == 1) {
      fetchCustomers(currentPage);
    } else {
      setCurrentPage(1);
    }
  }, [filters]);

  const fetchCustomers = async (page = 1) => {
    setLoading(true);
    page = page - 1;
    try {
      const limit = 10;
      const skip = page * limit;
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKENDURI}/api/customer`,
        {
          params: {
            limit,
            skip,
            search: filters.searchValue,
            storeId: filters.storeId,
          },
        },
      );
      if (res.data) {
        setCustomers(res.data.customers);
        setTotalCustomersCount(res.data.totalCustomersCount);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
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

  //   const detailedCustomerView = (orderId) => {
  //     navigate(`/customers/view/${orderId}`);
  //   };

  return (
    <>
      <Helmet>
        <title>Customer Details - Sruthi Boutique</title>
        <meta
          name="description"
          content="View and manage detailed information about your customers at Sruthi Boutique."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="mt-3 flex items-center justify-between border-b-2 pb-2">
        <h5>Customers</h5>
        <div className="flex">
          {auth.user?.superAdmin && (
            <SelectInput
              options={optionStores}
              label="Store"
              id="Store"
              name="storeId"
              defaultValue={filters.storeId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, storeId: e.target.value }))
              }
              variant="variant-1"
              required
            />
          )}
          <TextInput
            onBlur={() => {
              fetchCustomers();
              setCurrentPage(1);
            }}
            name="searchValue"
            value={searchValue}
            variant="variant-1"
            label="Search:"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="search here"
          ></TextInput>
        </div>
      </div>

      {loading ? (
        <div className="h-96">
          <Loader />
        </div>
      ) : (
        <table className="main-table customers">
          <thead>
            <tr>
              <th>SL.NO</th>
              <th>Name</th>
              <th>Number</th>
            </tr>
          </thead>
          <tbody>
            {customers.length >= 1 &&
              customers.map((customer, index) => (
                <tr key={customer._id}>
                  <td>{index + 1}</td>
                  <td>{customer.name}</td>
                  <td>{customer.number}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {customers.length <= 0 && !loading && (
        <h5 className="mt-5 text-center">
          No customers Are Added Yet.
          <br /> Add Customers
        </h5>
      )}
      {!loading && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={totalCustomersCount}
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

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
