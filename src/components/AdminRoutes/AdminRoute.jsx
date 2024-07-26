import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

function AdminRoute({ component, auth }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.user?.superAdmin) {
      navigate("/billing");
    } else {
      navigate("/");
    }
  }, [auth.user]);

  return <React.Fragment>{component}</React.Fragment>;
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, null)(AdminRoute);
