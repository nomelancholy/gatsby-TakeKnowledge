/** @format */

import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import authReducer from "./reducers/AuthReducer";
import { createWrapper } from "next-redux-wrapper";

const reducers = combineReducers({ auth: authReducer });
const makeStore = (context) =>
  createStore(reducers, composeWithDevTools(applyMiddleware(thunkMiddleware)));

export const wrapper = createWrapper(makeStore, {
  debug: true,
});
