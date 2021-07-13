import ProductDetail from "@components/product/productDetail";
import React from "react";
import { connect } from "react-redux";

const ProductNew = () => {
  return <ProductDetail productId={null} />;
};

export default connect((state) => state)(ProductNew);
