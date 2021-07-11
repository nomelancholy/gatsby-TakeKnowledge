import React from "react";
import { connect } from "react-redux";
import Overview from "@components/Overview";

const Home = () => {
  return <Overview />;
};

export default connect((state) => state)(Home);
