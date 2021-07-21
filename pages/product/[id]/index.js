import React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import ProductDetail from "@components/product/productDetail";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";

const ProductWithId = (props) => {
  const router = useRouter();

  const { id } = router.query;
  const { user, isLoggedIn, token } = props.auth;

  return (
    <>
      <ProductDetail productId={id} token={token} />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(ProductWithId);
