import axios from "axios";
import { AUTHENTICATE } from "./AuthActionConstant";

const authenticate = ({ user_login, user_pass, remember = false }, type) => {
  console.log(`authenticate`);
  return (dispatch) => {
    axios
      .post(
        `http://3.34.133.211:8000/api/v1/auth/login/email`,
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
        console.log(`creators response`, response);
        if (response.status == 200) {
          const user = response.data;
          dispatch({
            type: AUTHENTICATE,
            payload: user.Authorization,
            user: user,
            remember: remember,
          });
        }
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };
};

export default authenticate;
