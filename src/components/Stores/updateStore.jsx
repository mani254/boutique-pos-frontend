import React, { useState, useEffect } from "react";
import {
  TextInput,
  TextArea,
  SelectInput,
  TelInput,
} from "../FormComponents/FormComponents";
import { connect } from "react-redux";
import { updateStore } from "../../redux/stores/storeActions";
import { showNotification } from "../../redux/notification/notificationActions";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import SingleImageComponent from "../ImageComponent/SingleImageComponent";
import { validateField } from "../../utils";
import Loader from "../Loader/Loader";
import { Helmet } from "react-helmet-async";

function UpdateStore({ updateStore, showNotification }) {
  const [storeDetails, setStoreDetails] = useState({
    name: "",
    properator: "",
    phone: "",
    landLine: "",
    address: "",
    status: true,
    image: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    properator: "",
    phone: "",
    landLine: "",
    address: "",
    image: "",
  });

  const navigate = useNavigate();
  const { storeData } = useOutletContext();
  const { id } = useParams();

  useEffect(() => {
    const currentStore = storeData.stores.find((store) => store._id === id);
    if (!currentStore) {
      return;
    }
    setStoreDetails(currentStore);
  }, [storeData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setStoreDetails({ ...storeDetails, [name]: value });

    if (name !== "image") {
      let errorMessage = validateField(name, value);
      setErrors({ ...errors, [name]: errorMessage });
    }
  }

  async function handleUpdateStore() {
    const hasError = Object.values(errors).some((value) => value);
    const isEmpty =
      !storeDetails.name ||
      !storeDetails.address ||
      !storeDetails.image ||
      !storeDetails.landLine;
    if (isEmpty) {
      return showNotification("Fill all the details");
    }
    if (hasError) {
      return showNotification("have some error feilds");
    }
    try {
      await updateStore(storeDetails);
      navigate("/stores");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Helmet>
        <title>Update Store - Sruthi Boutique</title>
        <meta
          name="description"
          content="Update the details of existing stores at Sruthi Boutique."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="back-container pt-5">
        {storeData.updateLoading ? (
          <div className="h-96">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-wrap">
            <div className="lg:w-1/2">
              <TextInput
                label="Name:"
                name="name"
                id="store-name"
                onChange={handleChange}
                value={storeDetails.name}
                variant="variant-1"
                required
              >
                {errors.name && <p className="error">{errors.name}</p>}
              </TextInput>
            </div>
            <div className="lg:w-1/2">
              <TextInput
                label="Properator:"
                name="properator"
                id="properator"
                onChange={handleChange}
                value={storeDetails.properator}
                variant="variant-1"
                required
              >
                {errors.properator && (
                  <p className="error">{errors.properator}</p>
                )}
              </TextInput>
            </div>
            <div className="lg:w-1/2">
              <TelInput
                label="Phone No:"
                name="phone"
                id="phone"
                onChange={handleChange}
                value={storeDetails.phone}
                variant="variant-1"
                required
              >
                {errors.phone && <p className="error">{errors.phone}</p>}
              </TelInput>
            </div>
            <div className="lg:w-1/2">
              <TextInput
                label="Land line"
                name="landLine"
                id="landLine"
                onChange={handleChange}
                value={storeDetails.landLine}
                variant="variant-1"
                required
              >
                {errors.landLine && <p className="error">{errors.landLine}</p>}
              </TextInput>
            </div>
            <div className="lg:w-1/2">
              <SelectInput
                options={[
                  { value: true, label: "Active" },
                  { value: false, label: "InActive" },
                ]}
                label="Status:"
                id="banner-status"
                defaultValue={storeDetails.status}
                variant="variant-1"
                name="status"
                onChange={handleChange}
                required
              />
            </div>

            <div className="lg:w-1/2">
              <TextArea
                label="Address"
                name="address"
                id="address"
                onChange={handleChange}
                value={storeDetails.address}
                variant="variant-1"
                required
              >
                {errors.address && <p className="error">{errors.address}</p>}
              </TextArea>
            </div>
            <div className="lg:w-1/2">
              {storeDetails.image && (
                <SingleImageComponent
                  setParentDetails={setStoreDetails}
                  parentDetails={storeDetails}
                />
              )}
            </div>
            <div className="text-center lg:w-full">
              <button
                className="mt-3 rounded-md bg-violet-500 px-3 py-1 text-white"
                onClick={handleUpdateStore}
              >
                Update Store
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
    updateStore: (storeDetails) => dispatch(updateStore(storeDetails)),
    showNotification: (message) => dispatch(showNotification(message)),
  };
};

export default connect(null, mapDispatchToProps)(UpdateStore);
