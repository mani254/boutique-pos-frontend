import { combineReducers } from "redux";

import adminReducer from "./admin/adminReducer";
import modalReducer from "./modal/modalReducer";
import notificationReducer from "./notification/notificationReducer";
import categoryReducer from "./categories/categoryReducer";
import storeReducer from "./stores/storeReducer";
import authReducer from './auth/authReducer'

const rootReducer = combineReducers(
   {
      admin: adminReducer,
      modal: modalReducer,
      notification: notificationReducer,
      category: categoryReducer,
      store: storeReducer,
      auth: authReducer
   }
);


export default rootReducer;