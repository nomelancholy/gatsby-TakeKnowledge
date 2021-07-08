import React from "react";
import { connect } from "react-redux";
import SpotDetail from "../../components/spot/SpotDetail";

const SpotNew = () => {
  return <SpotDetail spotId={null} />;
};

export default connect((state) => state)(SpotNew);
