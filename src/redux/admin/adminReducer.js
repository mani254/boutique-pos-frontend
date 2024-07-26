// adminReducer.js
import * as types from "./adminActionTypes";

const initialState = {
   admins: [],
   getLoading: false,
   AddLoading: false,
   updateLoading: false,
   deleteLoading: false,
   error: null,
   token: localStorage.getItem("adminAuthToken"),
};

const adminReducer = (state = initialState, action) => {
   switch (action.type) {
      case types.GET_ADMINS:
         return {
            ...state,
            getLoading: true
         };
      case types.GET_ADMINS_SUCCESS:
         return {
            ...state,
            admins: action.payload,
            getLoading: false,
            error: null,
         };
      case types.GET_ADMINS_FAILURE:
         return {
            ...state,
            error: action.payload,
            getLoading: false,
         };
      case types.ADD_ADMIN:
         return {
            ...state,
            addLoading: true,
         };
      case types.ADD_ADMIN_SUCCESS:
         return {
            ...state,
            admins: [...state.admins, action.payload],
            addLoading: false,
            error: null,
         };
      case types.ADD_ADMIN_FAILURE:
         return {
            ...state,
            error: action.payload,
            addLoading: false,
         };
      case types.UPDATE_ADMIN:
         return {
            ...state,
            updateLoading: true
         }
      case types.UPDATE_ADMIN_SUCCESS:
         return {
            ...state,
            admins: state.admins.map(admin =>
               admin._id === action.payload._id ? action.payload : admin
            ),
            updateLoading: false,
            error: null,
         };
      case types.UPDATE_ADMIN_FAILURE:
         return {
            ...state,
            error: action.payload,
            updateLoading: false,
         };
      case types.DELETE_ADMIN:
         return {
            ...state,
            deleteLoading: true
         }
      case types.DELETE_ADMIN_SUCCESS:
         return {
            ...state,
            admins: state.admins.filter(admin => admin._id !== action.payload),
            deleteLoading: false,
            error: null,
         };
      case types.DELETE_ADMIN_FAILURE:
         return {
            ...state,
            error: action.payload,
            loading: false,
         };
      default:
         return state;
   }
};

export default adminReducer;
