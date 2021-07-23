import { HYDRATE } from "next-redux-wrapper";
import {
  AUTHENTICATE,
  DEAUTHENTICATE,
  AUTHENTICATE_FAILED,
} from "../actions/AuthActionConstants";
import { getCookie, setCookie } from "@utils/cookie";

let initialState;
if (typeof localStorage !== "undefined") {
  initialState = { ...getCookie("token"), tick: "init" };
} else {
  initialState = {
    isLoggedIn: false,
    token: null,
    tick: "init",
  };
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.auth };
    case "TICK":
      return { ...state, tick: action.payload };
    case AUTHENTICATE:
      const authObj = {
        isLoggedIn: true,
        token: action.payload,
        user: action.user,
      };

      const remember = action.remember ? action.remember : false;

      setCookie("token", authObj.token, remember);
      setCookie("user", JSON.stringify(authObj.user), remember);

      return { ...state, ...authObj };
    case DEAUTHENTICATE:
      return {
        ...state,
        ...{ isLoggedIn: false, isRegistered: false, token: null, user: null },
      };

    case AUTHENTICATE_FAILED:
      // code : 필요시 분기처리 용 code
      // msg : 간단한 에러 메시지
      // comment : 상세 에러 메시지
      const { code, msg, comment } = action.payload.response.data.detail;

      return {
        ...state,
        ...{ authFailed: true, isLoggedIn: false, token: null, msg: msg },
      };
    default:
      return { ...{}, ...state };
  }
};

export default authReducer;
