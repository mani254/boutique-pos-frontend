// storeReducer.js
import * as types from './storeActionTypes';

const initialState = {
   stores: [],
   getLoading: false,
   addLoading: false,
   updateLoading: false,
   deleteLoading: false,
   error: null
};

const storeReducer = (state = initialState, action) => {
   switch (action.type) {
      case types.ADD_STORE:
         return {
            ...state,
            addLoading: true
         };
      case types.ADD_STORE_SUCCESS:
         return {
            ...state,
            stores: [...state.stores, action.payload],
            addLoading: false,
            error: null
         };
      case types.ADD_STORE_FAILURE:
         return {
            ...state,
            addLoading: false,
            error: action.payload
         };
      case types.GET_STORES:
         return {
            ...state,
            getLoading: true
         };
      case types.GET_STORES_SUCCESS:
         return {
            ...state,
            stores: action.payload,
            getLoading: false,
            error: null
         };
      case types.GET_STORES_FAILURE:
         return {
            ...state,
            getLoading: false,
            error: action.payload
         };
      case types.UPDATE_STORE:
         return {
            ...state,
            updateLoading: true
         };
      case types.UPDATE_STORE_SUCCESS:
         const updatedStores = state.stores.map(store => {
            console.log(action.payload._id)
            if (store._id === action.payload._id) {
               return action.payload;
            }
            return store;
         });
         return {
            ...state,
            stores: updatedStores,
            updateLoading: false,
            error: null
         };
      case types.UPDATE_STORE_FAILURE:
         return {
            ...state,
            updateLoading: false,
            error: action.payload
         };
      case types.DELETE_STORE_SUCCESS:
         const changedStores = state.stores.filter(store => store._id !== action.payload);
         return {
            ...state,
            stores: changedStores,
            deleteLoading: false,
            error: null
         };
      case types.DELETE_STORE_FAILURE:
         return {
            ...state,
            deleteLoading: false,
            error: action.payload
         };
      case types.UPDATE_STORE_STATUS:
         return {
            ...state,
            updateLoading: true
         };
      case types.UPDATE_STORE_STATUS_SUCCESS:
         const updatedStatusStores = state.stores.map(store => {
            if (store._id === action.payload._id) {
               return {
                  ...store,
                  status: action.payload.status
               };
            }
            return store;
         });
         return {
            ...state,
            stores: updatedStatusStores,
            updateLoading: false,
            error: null
         };
      case types.UPDATE_STORE_STATUS_FAILURE:
         return {
            ...state,
            updateLoading: false,
            error: action.payload
         };
      default:
         return state;
   }
};

export default storeReducer;
