import React from "react";
import { connect } from "react-redux";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import PaymentDetail from "@components/payment/PaymentDetail";

const PaymentNew = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  return <PaymentDetail rateplanId={null} token={token} />;
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(PaymentNew);
