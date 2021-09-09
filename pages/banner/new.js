import React, { useEffect } from "react";
import { connect } from "react-redux";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import BannerDetail from "@components/banner/BannerDetail";

const BannerWrite = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  return <BannerDetail bannerId={null} token={token} />;
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(BannerWrite);
