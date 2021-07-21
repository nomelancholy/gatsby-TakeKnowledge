import ProductDetail from "@components/product/productDetail";
import React from "react";
import { connect } from "react-redux";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";

const ProductNew = (props) => {
  const { user, isLoggedIn, token } = props.auth;

  return <ProductDetail productId={null} token={token} />;
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(ProductNew);
