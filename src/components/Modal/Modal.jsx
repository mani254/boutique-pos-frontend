import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const Modal = ({ props, component }) => {
  const modalRoot = document.getElementById("modal-root");
  const el = document.createElement("div");

  useEffect(() => {
    modalRoot.appendChild(el);
    return () => {
      modalRoot.removeChild(el);
    };
  }, [el, modalRoot]);

  //   console.log(props, component, "--------------");
  //   console.log("hello");

  return ReactDOM.createPortal(
    <section className="modal-section">
      <div className="modal-container">
        {component && React.createElement(component, props)}
      </div>
    </section>,
    el,
  );
};

export default Modal;
