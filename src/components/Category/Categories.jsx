import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ConfirmationAlert from "../ConfirmationAlert/ConfirmationAlert.jsx";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TextInput, SelectInput } from "../FormComponents/FormComponents.jsx";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../redux/categories/categoryActions.js";
import { showModal } from "../../redux/modal/modalActions.js";
import Header from "../Header/Header.jsx";
import Loader from "../Loader/Loader.jsx";

import { Helmet } from "react-helmet-async";

function Categories({
  categoriesData,
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  showModal,
}) {
  const [addCategoryVisible, setAddCategoryVisible] = useState(false);
  const [updateCategoryVisible, setUpdateCategoryVisible] = useState(false);
  const [categoryData, setCategoryData] = useState({ name: "", status: true });

  const alertData = {
    info: "Are you sure you want to Delete",
    confirmFunction: (categoryId) => {
      deleteCategory(categoryId);
    },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await getCategories();
      } catch (err) {
        console.log(
          "Error while fetching categories:",
          err.response ? err.response.data.error : "Network Error",
        );
      }
    };
    fetchCategories();
  }, [getCategories]);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name == "name") {
      setCategoryData((prev) => ({
        ...prev,
        [name]: value.charAt(0).toUpperCase() + value.slice(1),
      }));
    } else {
      setCategoryData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleAddCategory() {
    try {
      await addCategory(categoryData);
      setAddCategoryVisible(false);
      setCategoryData({ name: "", value: true });
    } catch (err) {
      console.log(
        "Error while adding the City:",
        err.response ? err.response.data.error : "Network Error",
      );
    }
  }

  async function handleUpdateCategory() {
    try {
      await updateCategory(categoryData);
      setUpdateCategoryVisible(false);
      setCategoryData({ name: "", value: true });
    } catch (err) {
      console.log(
        "Error while updating the City:",
        err.response ? err.response.data.error : "Network Error",
      );
    }
  }

  function updateCategoryFun(category) {
    setCategoryData({ id: category._id, ...category });
    setUpdateCategoryVisible(true);
    setAddCategoryVisible(false);
  }

  //   function handleStatusUpdate() {
  //     return null;
  //   }

  return (
    <>
      <Helmet>
        <title>Categories - Sruthi Boutique</title>
        <meta
          name="description"
          content="Explore and manage product categories at Sruthi Boutique."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="categories w-full">
        <Header />
        <div className="flex items-center justify-between pb-1">
          <h6>Categories</h6>
          <button
            className="rounded-md bg-violet-500 px-3 py-2 text-sm text-white"
            onClick={() => {
              setAddCategoryVisible(!addCategoryVisible);
              setUpdateCategoryVisible(false);
              setCategoryData({ name: "", status: true });
            }}
          >
            Add Category
          </button>
        </div>
        <hr />

        {categoriesData.categories.length < 1 &&
          !categoriesData.getLoading &&
          !addCategoryVisible && (
            <h2 className="mt-5 text-center">No Categories are added</h2>
          )}

        {(addCategoryVisible || updateCategoryVisible) && (
          <div className="mt-3 flex items-center justify-between lg:w-2/3">
            <div>
              <TextInput
                type="text"
                name="name"
                label="Category-Name:"
                value={categoryData.name}
                variant="variant-1"
                onChange={handleChange}
                placeholder="Name"
                required
              />
            </div>

            <div>
              <SelectInput
                options={[
                  { value: true, label: "Active" },
                  { value: false, label: "InActive" },
                ]}
                label="Status:"
                id="category-status"
                defaultValue={categoryData.status}
                variant="variant-1"
                name="status"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              {addCategoryVisible && !updateCategoryVisible && (
                <button
                  className="rounded-md bg-violet-500 px-3 py-1 text-white"
                  onClick={handleAddCategory}
                  disabled={categoriesData.addLoading}
                >
                  Add
                </button>
              )}
              {updateCategoryVisible && (
                <button
                  className="rounded-md bg-violet-500 px-3 py-1 text-white"
                  onClick={handleUpdateCategory}
                  disabled={categoriesData.updateLoading}
                >
                  Update
                </button>
              )}
            </div>
          </div>
        )}

        {categoriesData.getLoading ? (
          <div className="h-96">
            <Loader></Loader>
          </div>
        ) : (
          <>
            {categoriesData.categories.length >= 1 && (
              <div className="m-auto mt-5 flex flex-wrap justify-start gap-5">
                {categoriesData.categories.map((category, index) => {
                  return (
                    <div
                      className="flex min-w-56 items-center justify-between rounded-lg border border-gray-200 p-5 shadow-md"
                      key={index}
                    >
                      <p className="">{category.name}</p>
                      <div className="flex">
                        <span
                          className="mr-3 cursor-pointer text-xl text-blue-400"
                          onClick={() => updateCategoryFun(category)}
                        >
                          <FaEdit />
                        </span>
                        <span
                          className="cursor-pointer text-xl text-red-400"
                          onClick={() =>
                            showModal(
                              { ...alertData, id: category._id },
                              ConfirmationAlert,
                            )
                          }
                        >
                          <MdDelete />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  categoriesData: state.category,
});

const mapDispatchToProps = (dispatch) => ({
  addCategory: (categoryData) => dispatch(addCategory(categoryData)),
  getCategories: () => dispatch(getCategories()),
  updateCategory: (categoryData) => dispatch(updateCategory(categoryData)),
  deleteCategory: (categoryId) => dispatch(deleteCategory(categoryId)),
  showModal: (props, component) => dispatch(showModal(props, component)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
