import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import React from "react";
import { connect } from "react-redux";
import SpotDetail from "../../components/spot/SpotDetail";

const SpotNew = (props) => {
  return <SpotDetail spotId={null} />;
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(SpotNew);
