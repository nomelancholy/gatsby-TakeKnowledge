import React, { useEffect } from "react";
import { connect } from "react-redux";
import Router from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import NoticeDetail from "@components/notice/NoticeDetail";

const NoticeWrite = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  return <NoticeDetail noticeId={null} token={token} />;
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(NoticeWrite);
