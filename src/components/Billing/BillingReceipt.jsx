import React, { useState, useEffect } from "react";
import "./BillingReceipt.css";
import { connect } from "react-redux";
import { getFormattedDateTime, convertAmountToWords } from "../../utils";

function BillingReceipt({ items, customerDetails, billInfo, invoice, auth }) {
  let formattedDateTime = getFormattedDateTime();

  const [amountInWords, setAmountInWords] = useState("Zero");
  const [balance, setBalance] = useState(billInfo.total);

  useEffect(() => {
    const amountInWords = convertAmountToWords(billInfo.total);
    setAmountInWords(amountInWords);
  }, [billInfo.total]);

  useEffect(() => {
    let balance = calculateBalance(billInfo.total, billInfo.advance);
    setBalance(balance);
  }, [billInfo.total, billInfo.advance]);

  return (
    <div className="receipt pb-5" id="bill-receipt">
      <div className="title flex items-center pt-4">
        <div className="image-wrapper">
          <img src="/images/vinakaya-logo.png" />
        </div>
        <div className="px-5">
          <h5 className="text-center">{auth.user?.store?.name}</h5>
          <p className="pb-1 pt-1 text-center">( MNV Groups )</p>
          <p className="pb-1 text-center">{auth.user?.store?.address}</p>
          <div className="flex items-center justify-center pt-1">
            <p className="pt-0 text-center">Phone: {auth.user?.store?.phone}</p>
            <p className="ms-4 mt-0 text-center">
              Landline: {auth.user?.store?.landLine}
            </p>
          </div>
        </div>
        <div className="image-wrapper">
          <img src="/images/venkaya-logo.png" />
        </div>
      </div>

      {/* <h3 className="text-center mt-4">Stitching Invoice</h3> */}

      <hr />
      <div className="-mt-3 flex items-center justify-between pb-2">
        <div className="text-left">
          <p className="pb-1">
            <strong>Customer:</strong> {customerDetails.name}
          </p>
          <p>
            <strong>Mobile:</strong> {customerDetails.phone}
          </p>
        </div>
        <div className="text-right">
          <p className="mb-1">
            <strong>Invoice:</strong> <span>{invoice}</span>
          </p>
          <p>
            <strong>Date:</strong>
            <span> {formattedDateTime}</span>
          </p>
        </div>
      </div>

      <table className="mt-2">
        <thead>
          <tr>
            <th>s.no</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 &&
            items.map((item, index) => (
              <tr key={item.id}>
                <td className="s-no">{index + 1}</td>
                <td className="category">{item.category}</td>
                <td className="quantity">{item.quantity}</td>
                <td className="price">{item.price}</td>
                <td className="total">{item.sTotal}</td>
              </tr>
            ))}
          <tr>
            <td className="s-no"></td>
            <td className="category"></td>
            <td className="quantity">
              <strong>{}</strong>
            </td>
            <td className="price">
              <strong>{}</strong>
            </td>
            <td className="total">
              <strong>{}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      <div className="-mt-3 flex justify-between">
        <strong className="amount-in-words">
          Amount in Words: {amountInWords} Rupees Only /-
        </strong>

        <div>
          {billInfo.discount >= 1 && (
            <p className="pb-1">
              <strong>discount: </strong>
              <span> {billInfo.discount}</span>
            </p>
          )}

          <p className="pb-1">
            <strong>Net Amount</strong>
            <span> {billInfo.total}</span>
          </p>
        </div>
      </div>
      <hr />
      <div className="-mt-3 flex items-center justify-between">
        <p className="mb-1">
          <strong>Delivery Date:</strong>
          <span> {billInfo.deliveryDate}</span>
        </p>
        <p className="mb-1">
          <strong>Advance Paid:</strong>
          <span> {billInfo.advance}</span>
        </p>
        <p className="mb-1">
          <strong>Balace to be Paid:</strong>
          <span> {balance}</span>
        </p>
      </div>
      <br />

      <p className="-mt-3 mb-1 text-center">
        Thankyou for taking Our Service Visit us Again
      </p>
    </div>
  );
}

function calculateBalance(total, advance) {
  return total - advance;
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, null)(BillingReceipt);
