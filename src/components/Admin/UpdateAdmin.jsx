import React, { useState, useEffect, useContext } from "react";
import {
  TextInput,
  SelectInput,
  PasswordInput,
} from "../FormComponents/FormComponents";
import { Helmet } from "react-helmet-async";
// import Button from "../Button/Button";
import { connect } from "react-redux";
import { updateAdmin } from "../../redux/admin/adminActions"; // Assuming this action exists in your Redux setup
import { showNotification } from "../../redux/notification/notificationActions";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { getStores } from "../../redux/stores/storeActions";
import { validateField } from "../../utils";
import Loader from "../Loader/Loader";

function UpdateAdmin({ updateAdmin, showNotification, storesData, getStores }) {
  const [adminDetails, setAdminDetails] = useState({
    username: "",
    email: "",
    password: "",
    store: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [optionStores, setOptionStores] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();
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
    }
  }

  useEffect(() => {
    if (adminData.admins.length <= 0) return;
    const currentAdmin = adminData.admins.filter((admin) => id === admin._id);
    setAdminDetails({
      username: currentAdmin[0].username,
      email: currentAdmin[0].email,
      store: currentAdmin[0].store._id,
      password: "",
      _id: currentAdmin[0]._id,
    });
  }, [adminData.admins]);

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

  async function handleUpdateAdmin() {
    const hasError = Object.values(errors).some((value) => value);
    const isEmpty =
      !adminDetails.username || !adminDetails.email || !adminDetails.store;

    if (isEmpty) {
      return showNotification("Fill all the details");
    }
    if (hasError) {
      return;
    }

    try {
      await updateAdmin(adminDetails);
      navigate("/admins");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Helmet>
        <title>Update Admin - Sruthi Boutique</title>
        <meta
          name="description"
          content="Update the details of existing admin users at Sruthi Boutique."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className="back-container">
        {adminData.updateLoading ? (
          <div className="w-96">
            <Loader />
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap">
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
                defaultValue={adminDetails.store}
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
                onClick={handleUpdateAdmin}
              >
                Update Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAdmin: (adminDetails) => dispatch(updateAdmin(adminDetails)),
    showNotification: (message) => dispatch(showNotification(message)),
    getStores: () => dispatch(getStores()),
  };
};

const mapStateToProps = (state) => {
  return {
    storesData: state.store,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAdmin);
