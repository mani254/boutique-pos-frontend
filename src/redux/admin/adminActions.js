import * as types from './adminActionTypes.js';
import axios from "axios";
import { showNotification } from '../notification/notificationActions.js';

export const addAdmin = (adminDetails) => {
   return async (dispatch) => {
      dispatch({ type: types.ADD_ADMIN });
      try {
         const response = await axios.post(`${import.meta.env.VITE_APP_BACKENDURI}/api/admins`, adminDetails);
         if (response) {
            dispatch(addAdminSuccess(response.data.admin));
            dispatch(showNotification('Admin Added Successfully'));
         }
      } catch (err) {
         dispatch(addAdminFailure(err.response ? err.response.data.error : "Network Error"));
         dispatch(showNotification(err.response ? err.response.data.error : "Network Error"));
         return Promise.reject(error);
      }
   };
};

export const addAdminSuccess = (admin) => ({
   type: types.ADD_ADMIN_SUCCESS,
   payload: admin
});

export const addAdminFailure = (error) => ({
   type: types.ADD_ADMIN_FAILURE,
   payload: error
});

export const getAdmins = () => {
   return async (dispatch) => {
      dispatch({ type: types.GET_ADMINS });
      try {
         const response = await axios.get(`${import.meta.env.VITE_APP_BACKENDURI}/api/admins`);
         dispatch(getAdminsSuccess(response.data.admins));
         return Promise.resolve(response.data.admins);
      } catch (error) {
         dispatch(getAdminsFailure(error.response ? error.response.data.error : 'Network Error'));
         return Promise.reject(error);
      }
   };
};

export const getAdminsSuccess = (admins) => ({
   type: types.GET_ADMINS_SUCCESS,
   payload: admins
});

export const getAdminsFailure = (error) => ({
   type: types.GET_ADMINS_FAILURE,
   payload: error
});

export const updateAdmin = (adminDetails) => {
   return async (dispatch) => {
      dispatch({ type: types.UPDATE_ADMIN });
      try {
         const response = await axios.put(`${import.meta.env.VITE_APP_BACKENDURI}/api/admins/${adminDetails._id}`, adminDetails);
         if (response) {
            dispatch(updateAdminSuccess(response.data.admin));
            dispatch(showNotification('Admin Updated Successfully'));
         }
      } catch (err) {
         dispatch(updateAdminFailure(err.response ? err.response.data.error : "Network Error"));
         dispatch(showNotification(err.response ? err.response.data.error : "Network Error"));
         return Promise.reject(err.response ? err.response.data.error : "Network Error");
      }
   };
};

export const updateAdminSuccess = (admin) => ({
   type: types.UPDATE_ADMIN_SUCCESS,
   payload: admin
});

export const updateAdminFailure = (error) => ({
   type: types.UPDATE_ADMIN_FAILURE,
   payload: error
});

export const deleteAdmin = (adminId) => {
   return async (dispatch) => {
      dispatch({ type: types.DELETE_ADMIN });

      try {
         const response = await axios.delete(`${import.meta.env.VITE_APP_BACKENDURI}/api/admins/${adminId}`);
         if (response) {
            dispatch(deleteAdminSuccess(adminId));
            dispatch(showNotification('Admin deleted Successfully'));
         }
      } catch (err) {
         dispatch(deleteAdminFailure(err.response ? err.response.data.error : "Network Error"));
         dispatch(showNotification(err.response ? err.response.data.error : "Network Error"));
         return Promise.reject(err.response ? err.response.data.error : "Network Error");
      }
   };
};

export const deleteAdminSuccess = (adminId) => ({
   type: types.DELETE_ADMIN_SUCCESS,
   payload: adminId
});

export const deleteAdminFailure = (error) => ({
   type: types.DELETE_ADMIN_FAILURE,
   payload: error
});

