/** @format */

import cookie from "js-cookie";
export const setCookie = (key, value, rememeber = false) => {
  if (process.browser) {
    let option = {
      path: "/",
      domain: process.env.DOMAIN,
      sameSite: "strict",
    };
    if (rememeber) {
      option = { ...option, expires: 365 };
    }
    cookie.set(key, value, option);
  }
};

export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1,
      domain: process.env.DOMAIN,
    });
  }
};

export const getCookie = (key, req) => {
  return process.browser
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split("=")[1];
};
