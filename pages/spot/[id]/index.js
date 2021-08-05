import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import SpotDetail from "../../../components/spot/SpotDetail";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";

const SpotWithId = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoggedIn, token } = props.auth;

  useEffect(() => {
    if (!isLoggedIn) {
      Router.push("/");
    }
  }, [isLoggedIn]);

  return (
    <>
      <SpotDetail spotId={id} />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(SpotWithId);
