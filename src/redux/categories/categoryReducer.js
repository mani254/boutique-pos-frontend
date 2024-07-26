import * as types from './categoryActionTypes';

const initialState = {
   categories: [],
   getLoading: false,
   addLoading: false,
   updateLoading: false,
   deleteLoading: false,
   updateStatusLoading: false,
   error: null
};

const categoryReducer = (state = initialState, action) => {
   switch (action.type) {
      case types.ADD_CATEGORY:
         return {
            ...state,
            addLoading: true
         };
      case types.ADD_CATEGORY_SUCCESS:
         return {
            ...state,
            addLoading: false,
            categories: [...state.categories, action.payload],
            error: null
         };
      case types.ADD_CATEGORY_FAILURE:
         return {
            ...state,
            addLoading: false,
            error: action.payload
         };
      case types.GET_CATEGORIES:
         return {
            ...state,
            getLoading: true
         };
      case types.GET_CATEGORIES_SUCCESS:
         return {
            ...state,
            getLoading: false,
            categories: action.payload,
            error: null
         };
      case types.GET_CATEGORIES_FAILURE:
         return {
            ...state,
            getLoading: false,
            error: action.payload
         };
      case types.UPDATE_CATEGORY:
         return {
            ...state,
            updateLoading: true
         };
      case types.UPDATE_CATEGORY_SUCCESS:
         return {
            ...state,
            updateLoading: false,
            categories: state.categories.map(category =>
               category._id === action.payload._id ? action.payload : category
            ),
            error: null
         };
      case types.UPDATE_CATEGORY_FAILURE:
         return {
            ...state,
            updateLoading: false,
            error: action.payload
         };
      case types.DELETE_CATEGORY:
         return {
            ...state,
            deleteLoading: true
         };
      case types.DELETE_CATEGORY_SUCCESS:
         return {
            ...state,
            deleteLoading: false,
            categories: state.categories.filter(category => category._id !== action.payload),
            error: null
         };
      case types.DELETE_CATEGORY_FAILURE:
         return {
            ...state,
            deleteLoading: false,
            error: action.payload
         };
      default:
         return state;
   }
};

export default categoryReducer;
