import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import { generateRandom6DigitNumber } from "../../utils";
import { connect } from "react-redux";
import { getCategories } from "../../redux/categories/categoryActions";
import { showNotification } from "../../redux/notification/notificationActions";
import BillingReceipt from "./BillingReceipt";
import axios from "axios";
import html2canvas from "html2canvas";
import { Helmet } from "react-helmet-async";

import {
  SelectInput,
  NumberInput,
  DateInput,
  TextInput,
  TelInput,
  TextArea,
} from "../FormComponents/FormComponents";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoEnterSharp } from "react-icons/io5";

function Billing({ categoriesData, getCategories, showNotification }) {
  const [items, setItems] = useState([]);
  const [customerDeatils, setCustomerDeatils] = useState({
    name: "",
    phone: "",
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [singleItem, setSingleItems] = useState({
    category: "",
    quantity: null,
    price: null,
    sTotal: 0,
  });
  const [billInfo, setBillInfo] = useState({
    discount: 0,
    advance: 0,
    total: 0,
    note: null,
    deliveryDate: "",
  });
  const [invoice, setInvoice] = useState(generateRandom6DigitNumber());
  const [error, setErrors] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setOptionCategories();
  }, [categoriesData]);

  useEffect(() => {
    setSingleItems({
      ...singleItem,
      sTotal: singleItem.quantity * singleItem.price,
    });
  }, [singleItem.quantity, singleItem.price]);

  useEffect(() => {
    calcGrandTotal();
  }, [billInfo.discount, items]);

  function handleChange(e) {
    const { value, name } = e.target;
    setCustomerDeatils({ ...customerDeatils, [name]: value });
  }

  function handleItem(e) {
    const { value, name } = e.target;
    if (name === "category") {
      document.getElementById("quantity").focus();
    }
    setSingleItems({ ...singleItem, [name]: value });
  }

  function handleDeleteItem(index) {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  }

  function handleUpdateItem(index) {
    const updatedItems = [...items];
    const removedItem = updatedItems.splice(index, 1);
    setItems(updatedItems);
    setSingleItems(removedItem[0]);
  }

  function handleItemEntry() {
    if (!singleItem.category || !singleItem.price || !singleItem.quantity) {
      return showNotification("Fill entries");
    }
    setItems([...items, singleItem]);
    setSingleItems({ ...singleItem, price: "", sTotal: "", quantity: "" });
  }

  const fetchCategories = async () => {
    try {
      await getCategories();
    } catch (err) {
      console.error("Error while fetching categories:", err);
    }
  };

  function setOptionCategories() {
    if (categoriesData.categories.length >= 1) {
      const options = categoriesData.categories.map((item) => ({
        value: item.name,
        label: item.name,
      }));
      setCategoryOptions(options);
      setSingleItems({ ...singleItem, category: options[0].value });
    }
  }

  function calcGrandTotal() {
    let total = 0;
    items.forEach((item) => {
      console.log(item.total, "itemTotal", typeof item.sTotal);
      total = total + item.sTotal;
    });
    let grandTotal = total - billInfo.discount;

    setBillInfo((prev) => ({ ...prev, total: grandTotal }));
  }

  async function handleSubmit() {
    if (!customerDeatils.name || !customerDeatils.phone)
      return showNotification("Fill customer Details");
    if (items.length <= 0) return showNotification("Add atleaset one Item");
    if (error) return showNotification("Invalid Phone Number");
    if (billInfo.deliveryDate == "")
      return showNotification("Select Delivery Date");

    let currentDate = new Date();
    let deliveryDate = new Date(billInfo.deliveryDate);
    if (deliveryDate < currentDate) {
      return showNotification("Invalid Delivery Date");
    }

    let dataToSend = {
      ...customerDeatils,
      ...billInfo,
      items: items,
      invoice: invoice,
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKENDURI}/api/order`,
        dataToSend,
      );
      if (res.data) {
        setItems([]);
        setBillInfo({
          discount: 0,
          advance: 0,
          total: 0,
          note: "",
          deliveryDate: "",
        });
        setCustomerDeatils({
          name: "",
          phone: "",
        });
        setInvoice(generateRandom6DigitNumber());
        printBill();
      }
    } catch (err) {
      console.error("Error while billing", err);
      showNotification(
        err.response ? err.response.data.error : "Network Error",
      );
    }
  }

  function validatePhone(e) {
    const { value, name } = e.target;
    setCustomerDeatils({ ...customerDeatils, [name]: value });
    if (value.length > 10 || value.length < 10 || !Number(value)) {
      setErrors("Phone number must be 10 digits");
      return;
    }
    setErrors("");
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Billing - Sruthi Boutique</title>
        <meta
          name="description"
          content="handle all the billing part of the website"
        />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Header />
      <div className="billing-page mt-3">
        <div className="flex">
          <div className="w-8/12">
            {/* <h6>Items</h6>
            <hr className="mb-2" /> */}
            <div className="items-wrapper rounded-md border border-gray-200 shadow-md">
              <table className="main-table billing mt-0!">
                <thead>
                  <tr>
                    <th>s.no</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 &&
                    items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="s-no">{index + 1}</td>
                        <td className="type">{item.category}</td>
                        <td className="size">{item.quantity}</td>
                        <td className="actual-price">{item.price}</td>
                        <td className="reduced-price">{item.sTotal}</td>
                        <td className="inline-flex">
                          <span
                            className="mr-3 cursor-pointer text-xl text-blue-400"
                            onClick={() => {
                              handleUpdateItem(index);
                            }}
                          >
                            <FaEdit />
                          </span>
                          <span
                            className="cursor-pointer text-xl text-red-400"
                            onClick={() => {
                              handleDeleteItem(index);
                            }}
                          >
                            <MdDelete />
                          </span>
                        </td>
                      </tr>
                    ))}
                  <tr className="items-entry">
                    <td className="s-no">{items.length + 1}</td>
                    <td className="type">
                      {categoryOptions.length >= 1 && (
                        <SelectInput
                          options={categoryOptions}
                          label="Category"
                          id="category"
                          defaultValue={singleItem.category}
                          variant="variant-1"
                          name="category"
                          onChange={handleItem}
                          required
                        />
                      )}
                    </td>

                    <td>
                      <NumberInput
                        label="Quantity"
                        name="quantity"
                        id="quantity"
                        onChange={handleItem}
                        value={singleItem.quantity}
                        variant="variant-1"
                        required
                        placeholder="Quantity"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            document.getElementById("price").focus();
                          }
                        }}
                      ></NumberInput>
                    </td>
                    <td>
                      <NumberInput
                        label="Price"
                        name="price"
                        id="price"
                        onChange={handleItem}
                        value={singleItem.price}
                        variant="variant-1"
                        required
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleItemEntry();
                        }}
                        placeholder="Price"
                      ></NumberInput>
                    </td>
                    <td className="reduced-price">
                      <NumberInput
                        label="sTotal:"
                        name="sTotal"
                        id="sTotal"
                        value={singleItem.sTotal}
                        variant="variant-1"
                        required
                      ></NumberInput>
                    </td>
                    <td className="edit-del pt-2" onClick={handleItemEntry}>
                      <button className="mt-1 rounded-md bg-violet-500 px-3 text-white">
                        <span className="icon text-3xl">
                          <IoEnterSharp />
                        </span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mx-2 w-4/12 border-2 border-gray-200 px-2 shadow-md">
            <div className="customer-info label-none">
              <h6>Customer Deatils</h6>
              <hr className="mb-2" />
              <TextInput
                label="Name:"
                name="name"
                id="customer-name"
                placeholder="Customer Name"
                onChange={handleChange}
                value={customerDeatils.name}
                variant="variant-1"
                required
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    document.getElementById("phone").focus();
                  }
                }}
              />
              <TelInput
                label="Phone No:"
                name="phone"
                id="phone"
                placeholder="Phone No"
                onChange={validatePhone}
                value={customerDeatils.phone}
                variant="variant-1"
                required
              />
              {error && <p className="error">{error}</p>}
            </div>
            <div className="bill-info mt-4">
              <h6>Bill Info</h6>
              <hr />

              <div className="discount-input">
                <div className="mt-2">
                  <DateInput
                    name="deliveryDate"
                    value={billInfo.deliveryDate}
                    label="Delivary Date: "
                    variant="variant-1"
                    onChange={(e) =>
                      setBillInfo((prev) => ({
                        ...prev,
                        deliveryDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <NumberInput
                  label="Special Discount:"
                  name="discount"
                  id="discount"
                  value={billInfo.discount}
                  onChange={(e) => {
                    setBillInfo((prev) => ({
                      ...prev,
                      discount: e.target.value,
                    }));
                  }}
                  variant="variant-1"
                  required
                ></NumberInput>

                <NumberInput
                  label="Advance paid:"
                  name="advance"
                  id="advance"
                  value={billInfo.advance}
                  onChange={(e) => {
                    setBillInfo((prev) => ({
                      ...prev,
                      advance: e.target.value,
                    }));
                  }}
                  variant="variant-1"
                  required
                ></NumberInput>

                <div className="my-3 flex items-center justify-between">
                  <p>Total:</p>
                  <p>{billInfo.total}</p>
                </div>
              </div>
            </div>

            <div className="extra-info mt-4">
              <h6>Note:</h6>
              <hr className="mt-0" />
              <TextArea
                name="note"
                id="note"
                value={billInfo.note}
                onChange={(e) => {
                  setBillInfo((prev) => ({ ...prev, note: e.target.value }));
                }}
                variant="variant-2"
                required
              ></TextArea>
            </div>

            <div className="d-flex justify-content-end">
              <button
                className="mt-4 rounded-md bg-violet-500 px-3 py-1 text-white"
                onClick={handleSubmit}
              >
                Save and Print
              </button>
            </div>
          </div>
        </div>
        <div className="receipt-container h-0 overflow-hidden">
          <BillingReceipt
            items={items}
            customerDetails={customerDeatils}
            billInfo={billInfo}
            invoice={invoice}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

async function printBill() {
  const billReceipt = document.getElementById("bill-receipt");

  if (!billReceipt) {
    console.log("billReceipt is not existed");
    return;
  }

  try {
    const canvas = await html2canvas(billReceipt);
    const imageData = canvas.toDataURL("image/png");

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write("<html><head><title>Print Receipt</title>");
    doc.write(`<style>
                 body { margin: 0; font-family: Arial, sans-serif; }
                 
               </style></head><body>`);
    doc.write(`<img src="${imageData}" />`);
    doc.write("</body></html>");
    doc.close();

    iframe.onload = function () {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      document.body.removeChild(iframe);
    };
  } catch (error) {
    console.error("Error converting to image:", error);
  }
}

const mapStateToProps = (state) => ({
  categoriesData: state.category,
});

const mapDispatchToProps = (dispatch) => ({
  getCategories: () => dispatch(getCategories()),
  showNotification: (message) => dispatch(showNotification(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Billing);
