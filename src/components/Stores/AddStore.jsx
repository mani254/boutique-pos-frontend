import React, { useState } from "react";
import {
  TextInput,
  TextArea,
  SelectInput,
  TelInput,
} from "../FormComponents/FormComponents";
import { validateField } from "../../utils";
import { connect } from "react-redux";
import { addStore } from "../../redux/stores/storeActions";
import { showNotification } from "../../redux/notification/notificationActions";
import { useNavigate } from "react-router-dom";
import SingleImageComponent from "../ImageComponent/SingleImageComponent";
import Loader from "../Loader/Loader";

function AddStore({ addStore, showNotification }) {
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

  const { storeData } = useOutletContext();

  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setStoreDetails({ ...storeDetails, [name]: value });

    let errorMessage = validateField(name, value);
    setErrors({ ...errors, [name]: errorMessage });
  }

  async function handleAddStore() {
    const hasError = Object.values(errors).some((value) => value);
    if (hasError) return showNotification("have some error feilds");

    const isEmpty = Object.values(storeDetails).some((value) => !value);

    if (isEmpty) {
      return showNotification("Fill all the details");
    }

    try {
      await addStore(storeDetails);
      navigate("/stores");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {storeData.addLoading ? (
        <div className="h-96">
          <Loader />
        </div>
      ) : (
        <div className="back-container">
          <div className="mt-3 flex flex-wrap">
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
                  { value: false, label: "Inactive" },
                ]}
                label="Status:"
                id="store-status"
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
              <SingleImageComponent
                setParentDetails={setStoreDetails}
                parentDetails={storeDetails}
              />
            </div>
            <div className="text-center lg:w-full">
              <button
                className="mt-4 rounded-md bg-violet-500 px-3 py-1 text-white"
                onClick={handleAddStore}
              >
                Add Store
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    addStore: (storeDetails) => dispatch(addStore(storeDetails)),
    showNotification: (message) => dispatch(showNotification(message)),
  };
};

export default connect(null, mapDispatchToProps)(AddStore);
