import Head from "next/head";
import initialize from "@utils/initialize";
import { wrapper } from "../state/stores";
import React, { useEffect } from "react";
import Router from "next/router";
import { connect } from "react-redux";

const Index = (props) => {
  const { user, isLoggedIn } = props.auth;

  useEffect(() => {
    if (isLoggedIn && user) {
      Router.push("/contract");
    } else {
      Router.push("/signin");
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/react-vis.css" />
      </Head>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(Index);
