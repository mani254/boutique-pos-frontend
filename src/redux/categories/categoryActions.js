import * as types from './categoryActionTypes';
import axios from 'axios';
import { showNotification } from '../notification/notificationActions.js';

export const addCategory = (categoryData) => {
   return async (dispatch) => {
      dispatch({ type: types.ADD_CATEGORY });
      await axios.post(`${import.meta.env.VITE_APP_BACKENDURI}/api/categories`, categoryData).then(res => {
         dispatch(addCategorySuccess(res.data.category));
         dispatch(showNotification('Category Added Successfully'))
         return Promise.resolve(res)
      }).catch(err => {
         dispatch(addCategoryFailure(err.response ? err.response.data.error : "Network Error"));
         dispatch(showNotification(err.response ? err.response.data.error : "Network Error"))
         return Promise.reject(err);
      })
   };
};

export const addCategorySuccess = (category) => ({
   type: types.ADD_CATEGORY_SUCCESS,
   payload: category
});

export const addCategoryFailure = (error) => ({
   type: types.ADD_CATEGORY_FAILURE,
   payload: error
});

export const updateCategory = (categoryData) => {
   return async (dispatch) => {
      dispatch({ type: types.UPDATE_CATEGORY });
      try {
         const response = await axios.put(`${import.meta.env.VITE_APP_BACKENDURI}/api/categories/${categoryData.id}`, categoryData);
         dispatch(updateCategorySuccess(response.data.category));
         dispatch(showNotification('Updated Successfully'))
         return Promise.resolve(response.data.category)
      } catch (err) {
         dispatch(updateCategoryFailure(err.response ? err.response.data.error : "Network Error"));
         dispatch(showNotification(err.response ? err.response.data.error : "Network Error"));
         return Promise.reject(err);
      }
   };
};

export const updateCategorySuccess = (category) => ({
   type: types.UPDATE_CATEGORY_SUCCESS,
   payload: category
});

export const updateCategoryFailure = (error) => ({
   type: types.UPDATE_CATEGORY_FAILURE,
   payload: error
});

export const getCategories = () => {
   return async (dispatch) => {
      dispatch({ type: types.GET_CATEGORIES });
      await axios.get(`${import.meta.env.VITE_APP_BACKENDURI}/api/categories`).then(res => {
         dispatch(getCategoriesSuccess(res.data.categories));
         return Promise.resolve(res.data.categories)
      }).catch(err => {
         dispatch(getCategoriesFailure(err.response ? err.response.data.error : 'Network Error'));
         return Promise.reject(err.response ? err.response.data.error : 'Network Error')
      })
   };
};

export const getCategoriesSuccess = (categories) => ({
   type: types.GET_CATEGORIES_SUCCESS,
   payload: categories
});

export const getCategoriesFailure = (error) => ({
   type: types.GET_CATEGORIES_FAILURE,
   payload: error
});

export const deleteCategory = (categoryId) => {
   return async (dispatch) => {
      dispatch({ type: types.DELETE_CATEGORY });
      try {
         await axios.delete(`${import.meta.env.VITE_APP_BACKENDURI}/api/categories/${categoryId}`);
         dispatch(deleteCategorySuccess(categoryId));
         dispatch(showNotification('Category Deleted Successfully'));
         return Promise.resolve()
      } catch (err) {
         dispatch(deleteCategoryFailure(err.response ? err.response.data.error : "Network Error"));
         dispatch(showNotification(err.response ? err.response.data.error : err.message));
         return Promise.reject(err)
      }
   };
};

export const deleteCategorySuccess = (categoryId) => ({
   type: types.DELETE_CATEGORY_SUCCESS,
   payload: categoryId
});

export const deleteCategoryFailure = (error) => ({
   type: types.DELETE_CATEGORY_FAILURE,
   payload: error
});
