import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
// import Button from "../Button/Button";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { getAdmins } from "../../redux/admin/adminActions";
import Header from "../Header/Header";
import { Helmet } from "react-helmet-async";

function AdminPageLayout({ admins, getAdmins }) {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await getAdmins();
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Admins - Sruthi Boutique</title>
        <meta
          name="description"
          content="View and manage all admin users at Sruthi Boutique."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div>
        <Header />
        <div className="mt-3 flex items-center justify-between pb-2">
          <h5>Admins</h5>
          <button
            className="rounded-md bg-violet-500 px-3 py-1 text-white"
            onClick={() => navigate("/admins/add")}
          >
            Add Admins
          </button>
        </div>
        <hr />
        <Outlet context={{ adminData: admins }} />
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    admins: state.admin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAdmins: () => dispatch(getAdmins()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AdminPageLayout);
