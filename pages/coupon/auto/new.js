import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import CouponAutoDetail from "@components/coupon/CouponAutoDetail";

const CouponAutoWrite = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  return <CouponAutoDetail couponAutoId={null} token={token} />;
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(CouponAutoWrite);
