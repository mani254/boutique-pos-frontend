import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
} from "../components/FormComponents/FormComponents";
import { useNavigate } from "react-router-dom";

import { connect } from "react-redux";
import { login } from "../redux/auth/authActions";

function LoginPage({ login }) {
  const [logInDetails, setLoginDetails] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  function handleChange(e) {
    setLoginDetails({ ...logInDetails, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await login(logInDetails)
      .then((res) => {
        if (res.user.superAdmin) {
          navigate("/");
        } else {
          navigate("/billing");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <section className="flex h-screen items-center justify-center">
      <form
        className="min-w-96 rounded-lg border-2 border-gray-200 bg-white p-6 shadow-md"
        onSubmit={handleSubmit}
      >
        <h5 className="mb-3 text-center text-violet-500">Admin Login</h5>
        <TextInput
          type="email"
          id="login-input"
          name="email"
          label="Email:"
          value={logInDetails.email}
          variant="variant-2"
          onChange={handleChange}
        />
        <PasswordInput
          id="password-input"
          name="password"
          label="Password:"
          value={logInDetails.password}
          variant="variant-2"
          onChange={handleChange}
        />
        <button
          className="mx-auto mt-3 block rounded-md bg-violet-500 px-5 py-1 text-white hover:bg-violet-600"
          type="submit"
        >
          Login
        </button>
      </form>
    </section>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (logInDetails) => dispatch(login(logInDetails)),
  };
};

export default connect(null, mapDispatchToProps)(LoginPage);
