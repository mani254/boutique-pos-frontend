import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
// import Button from "../Button/Button";
// import "./Stores.css";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { getStores } from "../../redux/stores/storeActions";
import Header from "../Header/Header";

function StoreLayout({ stores, getStores }) {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await getStores();
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="">
      <Header />
      <div className="mt-3 flex items-center justify-between pb-2">
        <h6>Stores</h6>
        <button
          className="rounded-md bg-violet-500 px-3 py-1 text-white"
          onClick={() => navigate("/stores/add")}
        >
          Add Stores
        </button>
      </div>
      <hr />
      <Outlet context={{ storeData: stores }} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    stores: state.store,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getStores: () => dispatch(getStores()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(StoreLayout);
