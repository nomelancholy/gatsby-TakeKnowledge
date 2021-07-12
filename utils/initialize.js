/** @format */

import AuthActions from "@state/actions/AuthActionCreators";
import { AUTHENTICATE } from "@state/actions/AuthActionConstants";
import { getCookie, removeCookie } from "@utils/cookie";

// checks if the page is being loaded on the server, and if so, get auth token from the cookie:
export default function initialize(ctx) {
  const { res, err } = ctx;
  if (
    ctx.req &&
    ctx.req.headers
    // && typeof ctx.req.headers.cookie === "string"
  ) {
    const token = getCookie("token", ctx.req);
    const user = getCookie("user", ctx.req);
    if (token && user) {
      ctx.store.dispatch({
        type: AUTHENTICATE,
        payload: token,
        user: user,
      });
    } else {
      ctx.store.dispatch(AuthActions.deauthenticate());
    }
    return { statusCode: res ? res.statusCode : err ? err.statusCode : 404 };
    /*
    const action = Actions.reauthenticate(token);
    ctx.store.dispatch(action);
    return action.payload.then((payload) => {
      //console.log("initialize payload", payload);
      if (payload) {
        ctx.store.dispatch({
          type: AUTHENTICATE,
          payload: payload.token,
          user: payload.user,
        });
      } else {
        ctx.store.dispatch(Actions.deauthenticate());
      }

      return { statusCode: res ? res.statusCode : err ? err.statusCode : 404 };
    });
  */
  } else {
    return {};
  }
}
