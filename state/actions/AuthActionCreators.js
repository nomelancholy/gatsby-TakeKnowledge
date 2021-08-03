import axios from "axios";
import {
  AUTHENTICATE,
  AUTHENTICATE_FAILED,
  DEAUTHENTICATE,
} from "./AuthActionConstants";
import { removeCookie } from "@utils/cookie";

const authenticate = ({ user_login, user_pass, remember = false }, type) => {
  return (dispatch) => {
    axios
      .post(
        `${process.env.BACKEND_API}/auth/login/email`,
        { user_login, user_pass },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      )
      .then((response) => {
        if (response.status !== 200) return;
        if (response.data.user_role === "ffadmin") {
          const user = response.data;
          dispatch({
            type: AUTHENTICATE,
            payload: user.Authorization,
            user: user,
            remember: remember,
          });
        } else {
          dispatch({
            type: AUTHENTICATE_FAILED,
            payload: {
              msg: "관리자 페이지 접근 권한이 없습니다",
            },
          });
        }
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };
};

const reauthenticate = (token) => {
  return {
    type: "REAUTHENTICATE",
    payload: new Promise((res) => {
      if (token) {
        axios
          .get(`${process.env.BACKEND_API}/user/validateUser`, {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              Authorization: "bearer " + token,
            },
          })
          .then((response) => {
            if (response.data.success) {
              res(response.data);
            } else {
              res(false);
            }
          })
          .catch((error) => {
            res(false);
          });
      } else {
        res(false);
      }
    }),
  };
};

// removing the token
const deauthenticate = () => {
  return (dispatch) => {
    removeCookie("token");
    removeCookie("user");
    dispatch({ type: DEAUTHENTICATE });
  };
};

export default { authenticate, reauthenticate, deauthenticate };
