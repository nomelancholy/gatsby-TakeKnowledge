import { HYDRATE } from "next-redux-wrapper";
import { AUTHENTICATE } from "../actions/AuthActionConstant";

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload };
    case "TICK":
      return { ...state, tick: action.payload };
    case AUTHENTICATE:
      const authObj = {
        isLoggedIn: true,
        token: action.payload,
        user: action.user,
      };
      console.log(`action.payload`, action.payload);
      const remember = action.remember ? action.remember : false;

      return { ...state, ...authObj };
    default:
      return { ...{}, ...state };
  }
};

export default authReducer;
