import React, { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  SelectInput,
} from "../FormComponents/FormComponents";

import { validateField } from "../../utils";
import { connect } from "react-redux";
import { addAdmin } from "../../redux/admin/adminActions";
import { showNotification } from "../../redux/notification/notificationActions";
import { useNavigate } from "react-router-dom";
import { getStores } from "../../redux/stores/storeActions";
import Loader from "../Loader/Loader";
import { useOutletContext } from "react-router-dom";

function AddAdmin({ addAdmin, showNotification, storesData, getStores }) {
  const [adminDetails, setAdminDetails] = useState({
    username: "",
    email: "",
    store: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [optionStores, setOptionStores] = useState([]);
  const navigate = useNavigate();
  const { adminData } = useOutletContext();

  const fetchStores = async () => {
    try {
      await getStores();
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
      setOptionStores(options);
      setAdminDetails({ ...adminDetails, store: options[0].value });
    }
  }

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    setStoresOptions();
  }, [storesData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setAdminDetails({ ...adminDetails, [name]: value });

    let errorMessage = validateField(name, value);
    setErrors({ ...errors, [name]: errorMessage });
  }

  async function handleAddAdmin() {
    const isEmpty = Object.values(adminDetails).some((value) => !value);

    if (isEmpty) {
      return showNotification("Fill all the details");
    }

    try {
      await addAdmin(adminDetails);
      navigate("/admins");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="back-container">
      {adminData.addLoading ? (
        <div className="h-96">
          <Loader />
        </div>
      ) : (
        <div className="row mt-5 flex flex-wrap">
          <div className="lg:w-1/2">
            <TextInput
              label="Username:"
              name="username"
              id="admin-username"
              onChange={handleChange}
              value={adminDetails.username}
              variant="variant-1"
              required
            >
              {errors.username && <p className="error">{errors.username}</p>}
            </TextInput>
          </div>
          <div className="lg:w-1/2">
            <TextInput
              type="email"
              label="Email:"
              name="email"
              id="admin-email"
              onChange={handleChange}
              value={adminDetails.email}
              variant="variant-1"
              required
            >
              {errors.email && <p className="error">{errors.email}</p>}
            </TextInput>
          </div>
          <div className="lg:w-1/2">
            <SelectInput
              options={optionStores}
              label="Store"
              id="Store"
              variant="variant-1"
              name="store"
              onChange={handleChange}
              required
            />
          </div>
          <div className="lg:w-1/2">
            <PasswordInput
              label="Password:"
              name="password"
              id="admin-password"
              onChange={handleChange}
              value={adminDetails.password}
              variant="variant-1"
              required
            >
              {errors.password && <p className="error">{errors.password}</p>}
            </PasswordInput>
          </div>
          <div className="w-full text-center">
            <button
              className="mt-4 rounded-md bg-violet-500 px-3 py-1 text-white"
              onClick={handleAddAdmin}
            >
              Add Admin
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    addAdmin: (adminDetails) => dispatch(addAdmin(adminDetails)),
    showNotification: (message) => dispatch(showNotification(message)),
    getStores: () => dispatch(getStores()),
  };
};

const mapStateToProps = (state) => {
  return {
    storesData: state.store,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAdmin);
