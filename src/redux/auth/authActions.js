import * as types from './authActionTypes';
import axios from 'axios';
import { showNotification } from '../notification/notificationActions';

export const signInSuccess = (admin) => ({
   type: types.SIGN_IN_SUCCESS,
   payload: admin,
});

export const signInFailure = (error) => ({
   type: types.SIGN_IN_FAILURE,
   payload: error,
});

export const signInStart = () => ({
   type: types.SIGN_IN_START,
});

export const login = (logInDetails) => {
   return async (dispatch) => {
      dispatch(signInStart());
      try {
         const res = await axios.post(`${import.meta.env.VITE_APP_BACKENDURI}/api/auth/login`, logInDetails);
         dispatch(signInSuccess(res.data));
         localStorage.setItem('token', res.data.token);
         dispatch(showNotification('Login succesfull'))
         return Promise.resolve(res.data);
      } catch (err) {
         dispatch(signInFailure(err.response ? err.response.data.error : 'Network Error'));
         dispatch(showNotification(err.response ? err.response.data.error : 'Network Error'))
         return Promise.reject(err);
      }
   };
};

export const initialLogin = (token) => {
   return async (dispatch) => {
      dispatch(signInStart());
      try {
         const res = await axios.post(`${import.meta.env.VITE_APP_BACKENDURI}/api/auth/initiallogin`, { token });
         dispatch(signInSuccess(res.data));
         return Promise.resolve(res.data);
      } catch (err) {
         dispatch(showNotification(err.response ? err.response.data.error : 'Network Error'))
         dispatch(signInFailure(err.response ? err.response.data.error : 'Network Error'));
         return Promise.reject(err);
      }
   };
};

export const logout = () => ({
   type: types.LOGOUT
})

