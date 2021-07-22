import React from "react";
import { connect } from "react-redux";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import PaymentDetail from "@components/payment/PaymentDetail";

const PaymentWithId = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  const { id } = router.query;
  const { user, isLoggedIn, token } = props.auth;

  return <PaymentDetail rateplanId={id} token={token} />;
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(PaymentWithId);
