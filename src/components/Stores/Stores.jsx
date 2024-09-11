import React from "react";
import { useOutletContext } from "react-router-dom";
import { connect } from "react-redux";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { showModal } from "../../redux/modal/modalActions";
import ConfirmationAlert from "../ConfirmationAlert/ConfirmationAlert.jsx";
import { deleteStore } from "../../redux/stores/storeActions.js";

import Loader from "../Loader/Loader.jsx";
import { Helmet } from "react-helmet-async";
// import "./Stores.css";

function Stores({ showModal, deleteStore }) {
  const navigate = useNavigate();

  const { storeData } = useOutletContext();

  const alertData = {
    info: "If you delete the store, admin data also be deleted",
    confirmFunction: (storeId) => {
      deleteStore(storeId);
    },
  };

  return (
    <>
      <Helmet>
        <title>Stores - Sruthi Boutique</title>
        <meta
          name="description"
          content="View and manage all stores at Sruthi Boutique."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {storeData.getLoading ? (
        <div className="h-96">
          <Loader></Loader>
        </div>
      ) : (
        <table className="main-table stores mt-5">
          <thead>
            <tr className="bg-">
              <th>Logo</th>
              <th>Name</th>
              <th>Address</th>
              {/* <th>Status</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {storeData.stores.length >= 1 &&
              storeData.stores.map((store) => (
                <tr key={store._id}>
                  <td>
                    <div className="">
                      <img
                        className="h-16 w-16"
                        src={`${import.meta.env.VITE_APP_BACKENDURI}/${store.image}`}
                        alt="store-image"
                      />
                    </div>
                  </td>
                  <td>{store.name}</td>
                  <td>{store.address}</td>

                  {/* <td>
                  <div
                    className={`toggle-switch ${store.status && "active"}`}
                    // onClick={() => {
                    // 	updateStoreStatus({ _id: store._id, status: !store.status });
                    // }}
                  >
                    <div className="toggle-switch-background">
                      <div className="toggle-switch-handle"></div>
                    </div>
                  </div>
                </td> */}
                  <td>
                    <div className="flex">
                      <span
                        className="mr-2 cursor-pointer text-xl text-blue-500"
                        onClick={() => navigate(`/stores/edit/${store._id}`)}
                      >
                        <FaEdit />
                      </span>
                      <span
                        className="cursor-pointer text-xl text-red-500"
                        onClick={() =>
                          showModal(
                            { ...alertData, id: store._id },
                            ConfirmationAlert,
                          )
                        }
                      >
                        <MdDelete />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {storeData.stores.length > 9 && !storeData.getLoading <= 0 && (
        <h2 className="mt-5 text-center">
          No Stores Are Added Yet.
          <br /> Add stores
        </h2>
      )}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (props, component) => dispatch(showModal(props, component)),
    deleteStore: (storeId) => dispatch(deleteStore(storeId)),
  };
};

export default connect(null, mapDispatchToProps)(Stores);
