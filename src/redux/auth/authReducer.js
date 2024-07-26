import * as types from "./authActionTypes";

const initialState = {
   isLoggedIn: false,
   user: null,
   loading: false,
   error: null,
   token: localStorage.getItem("adminAuthToken"),
};

const authReducer = (state = initialState, action) => {
   switch (action.type) {
      case types.SIGN_IN_START:
         return {
            ...state,
            loading: true,
         };
      case types.SIGN_IN_SUCCESS:
         return {
            ...state,
            isLoggedIn: action.payload !== null,
            user: action.payload.user,
            loading: false,
            error: null,
            token: action.payload ? action.payload.token : null,
         };
      case types.SIGN_IN_FAILURE:
         return {
            ...state,
            error: action.payload,
            loading: false,
         };
      case types.LOGOUT:
         window.localStorage.removeItem('token')
         return {
            ...state,
            isLoggedIn: false,
            user: null
         }
      default:
         return state;
   }
};

export default authReducer