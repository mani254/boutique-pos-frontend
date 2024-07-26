import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../Pagination/Pagination";
import { TextInput } from "../FormComponents/FormComponents";
import Loader from "../Loader/Loader";
import { connect } from "react-redux";
import { showNotification } from "../../redux/notification/notificationActions";

function Customers({ showNotification }) {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomersCount, setTotalCustomersCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    fetchCustomers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (searchValue.length > 2) {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      const timeout = setTimeout(() => {
        fetchCustomers(1);
        setCurrentPage(1);
      }, 400);
      setDebounceTimeout(timeout);
    }
  }, [searchValue]);

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
            search: searchValue,
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

  const detailedCustomerView = (orderId) => {
    navigate(`/customers/view/${orderId}`);
  };

  return (
    <>
      <div className="mt-3 flex items-center justify-between border-b-2 pb-2">
        <h5>Customers</h5>
        <div className="flex">
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
              <th>Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.length >= 1 &&
              customers.map((customer, index) => (
                <tr
                  key={customer._id}
                  onClick={(e) => detailedCustomerView(customer._id)}
                  className="transition hover:bg-gray-100"
                >
                  <td>{index + 1}</td>
                  <td>{customer.name}</td>
                  <td>{customer.number}</td>
                  <td>{customer.totalOrders}</td>
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

const mapDispatchToProps = (dispatch) => {
  return {
    showNotification: (message) => dispatch(showNotification(message)),
  };
};

export default connect(null, mapDispatchToProps)(Customers);
