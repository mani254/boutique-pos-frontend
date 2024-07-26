// storeActions.js
import * as types from './storeActionTypes.js';
import axios from 'axios';
import { showNotification } from '../notification/notificationActions.js';

export const addStore = (storeDetails) => {
   return async (dispatch) => {
      dispatch({ type: types.ADD_STORE });

      const formData = new FormData();
      formData.append('name', storeDetails.name);
      formData.append('properator', storeDetails.properator);
      formData.append('phone', storeDetails.phone);
      formData.append('landLine', storeDetails.landLine);
      formData.append('address', storeDetails.address);
      formData.append('status', storeDetails.status);
      formData.append('image', storeDetails.image);

      try {
         const response = await axios.post(`${import.meta.env.VITE_APP_BACKENDURI}/api/stores`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data'
            }
         });
         if (response) {
            dispatch(addStoreSuccess(response.data.store));
            dispatch(showNotification('Store Added Successfully'));
         }
      } catch (err) {
         dispatch(addStoreFailure(err.response ? err.response.data.error : "Network Error"));
         dispatch(showNotification(err.response ? err.response.data.error : "Network Error"));
         return Promise.reject(err);
      }
   };
};

export const addStoreSuccess = (store) => ({
   type: types.ADD_STORE_SUCCESS,
   payload: store
});

export const addStoreFailure = (error) => ({
   type: types.ADD_STORE_FAILURE,
   payload: error
});

export const getStores = () => {
   return async (dispatch) => {
      dispatch({ type: types.GET_STORES });
      try {
         const response = await axios.get(`${import.meta.env.VITE_APP_BACKENDURI}/api/stores`);
         dispatch(getStoresSuccess(response.data));
         return Promise.resolve();
      } catch (err) {
         dispatch(getStoresFailure(err.response ? err.response.data.error : 'Network Error'));
         return Promise.reject(err);
      }
   };
};

export const getStoresSuccess = (stores) => ({
   type: types.GET_STORES_SUCCESS,
   payload: stores
});

export const getStoresFailure = (error) => ({
   type: types.GET_STORES_FAILURE,
   payload: error
});

export const updateStore = (storeDetails) => {
   return async (dispatch) => {
      dispatch({ type: types.UPDATE_STORE });

      const formData = new FormData();
      formData.append('name', storeDetails.name);
      formData.append('properator', storeDetails.properator);
      formData.append('phone', storeDetails.phone);
      formData.append('landLine', storeDetails.landLine);
      formData.append('address', storeDetails.address);
      formData.append('status', storeDetails.status);
      formData.append('image', storeDetails.image);

      try {
         const response = await axios.put(`${import.meta.env.VITE_APP_BACKENDURI}/api/stores/${storeDetails._id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data'
            }
         });
         dispatch(updateStoreSuccess(response.data.store));
         dispatch(showNotification('Store Updated Successfully'));
         return Promise.resolve();
      } catch (err) {
         dispatch(updateStoreFailure(err.response ? err.response.data.error : "Network Error"));
         dispatch(showNotification(err.response ? err.response.data.error : "Network Error"));
         return Promise.reject(err);
      }
   };
};

export const updateStoreSuccess = (store) => ({
   type: types.UPDATE_STORE_SUCCESS,
   payload: store
});

export const updateStoreFailure = (error) => ({
   type: types.UPDATE_STORE_FAILURE,
   payload: error
});

export const deleteStore = (storeId) => {
   return async (dispatch) => {
      dispatch({ type: types.DELETE_STORE });
      try {
         const response = await axios.delete(`${import.meta.env.VITE_APP_BACKENDURI}/api/stores/${storeId}`);
         dispatch(deleteStoreSuccess(storeId));
         dispatch(showNotification('Store Deleted Successfully'));
         return Promise.resolve(response);
      } catch (err) {
         dispatch(deleteStoreFailure(err.response ? err.response.data.error : "Network Error"));
         dispatch(showNotification(err.response ? err.response.data.error : err.message));
         return Promise.reject(err);
      }
   };
};

export const deleteStoreSuccess = (storeId) => ({
   type: types.DELETE_STORE_SUCCESS,
   payload: storeId
});

export const deleteStoreFailure = (error) => ({
   type: types.DELETE_STORE_FAILURE,
   payload: error
});

export const updateStoreStatus = ({ _id, status }) => {
   return async (dispatch) => {
      dispatch({ type: types.UPDATE_STORE_STATUS });
      try {
         const response = await axios.put(`${import.meta.env.VITE_APP_BACKENDURI}/api/stores/${_id}/status`, { status });
         dispatch(updateStoreStatusSuccess(response.data));
         dispatch(showNotification('Store Status Updated Successfully'));
         return Promise.resolve(response.data);
      } catch (err) {
         dispatch(updateStoreStatusFailure(err.response ? err.response.data.error : "Network Error"));
         dispatch(showNotification(err.response ? err.response.data.error : "Network Error"));
         return Promise.reject(err.response ? err.response.data.error : "Network Error");
      }
   };
};

export const updateStoreStatusSuccess = (store) => ({
   type: types.UPDATE_STORE_STATUS_SUCCESS,
   payload: store
});

export const updateStoreStatusFailure = (error) => ({
   type: types.UPDATE_STORE_STATUS_FAILURE,
   payload: error
});
