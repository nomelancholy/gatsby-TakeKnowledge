import React from "react";
import { connect } from "react-redux";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import RateplanDetail from "@components/rateplan/RateplanDetail";

const RateplanNew = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  return <RateplanDetail rateplanId={null} token={token} />;
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(RateplanNew);
