import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { showNotification } from "../../redux/notification/notificationActions";
import { connect } from "react-redux";
import Loader from "../Loader/Loader";
import { Helmet } from "react-helmet-async";

function DetailedOrder({ showNotification }) {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
  });
  const [billInfo, setBillInfo] = useState({
    discount: 0,
    advance: 0,
    total: 0,
    note: "",
    deliveryDate: "",
  });
  const [invoice, setInvoice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKENDURI}/api/order/${id}`,
        );
        setCustomerDetails({
          name: res.data.customer.name,
          phone: res.data.customer.number,
        });
        setItems(res.data.items);
        setBillInfo({
          discount: res.data.discount,
          advance: res.data.advance,
          total: res.data.price,
          note: res.data.note || "",
          deliveryDate: res.data.deliveryDate || "",
        });
        setInvoice(res.data.invoice);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(err.response?.error || "Network Error");
        showNotification(err.response?.error || "Network Error");
      }
    };
    fetchOrder();
  }, [id, showNotification]);

  useEffect(() => {
    function calculateDiscount() {
      const sum = items.reduce((accumulator, item) => {
        return accumulator + item.sTotal;
      }, 0);

      let discount = sum - billInfo.total;
      setBillInfo((prev) => ({ ...prev, discount: discount }));
    }
    calculateDiscount();
  }, [billInfo.total]);

  return (
    <>
      <Helmet>
        <title>Detailed Order - Sruthi Boutique</title>
        <meta
          name="description"
          content="View and manage the detailed information of an order at Sruthi Boutique."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="mt-3 flex items-center justify-between border-b-2 pb-2">
        <h5>Detailed Order View</h5>
      </div>

      {loading ? (
        <div className="h-96">
          <Loader />
        </div>
      ) : (
        <>
          {items.length > 0 ? (
            <>
              <div className="flex justify-between border-b-2 border-gray-200 py-3 pr-5">
                <div>
                  <p>
                    <span className="font-bold">Customer</span>:{" "}
                    {customerDetails.name}
                  </p>
                  <p>
                    <span className="font-bold">Mobile</span>:{" "}
                    {customerDetails.phone}
                  </p>
                </div>

                <p>
                  <span className="font-bold">Invoice</span>: {invoice}
                </p>
              </div>

              <table className="main-table detailed">
                <thead>
                  <th>SL</th>
                  <th>Item Name</th>
                  <th>Rate</th>
                  <th>Qty</th>
                  <th>Price</th>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.category}</td>
                      <td>{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>{item.sTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="items-centr flex justify-between border bg-white px-12 py-2">
                <p>
                  <span className="font-bold">Total: </span>
                  {billInfo.total + billInfo.discount}
                </p>
                <p>
                  <span className="font-bold">Discount: </span>
                  {billInfo.discount}
                </p>
                <p>
                  <span className="font-bold">Net Amount: </span>
                  {billInfo.total}
                </p>
                <p>
                  <span className="font-bold">Paid: </span>
                  {billInfo.advance}
                </p>
                <p>
                  <span className="font-bold">Pending: </span>{" "}
                  {billInfo.total - billInfo.advance}
                </p>
              </div>
              {billInfo.note && (
                <div className="m-auto mt-5 max-w-sm rounded-md border border-gray-400 bg-white p-2 shadow-md">
                  <p>{billInfo.note}</p>
                </div>
              )}
            </>
          ) : (
            <h6 className="mt-4 text-center">No Items Math Found</h6>
          )}
        </>
      )}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    showNotification: (message) => dispatch(showNotification(message)),
  };
};

export default connect(null, mapDispatchToProps)(DetailedOrder);
