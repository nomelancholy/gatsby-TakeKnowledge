import React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import ProductDetail from "@components/product/productDetail";

const ProductWithId = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <ProductDetail productId={id} />
    </>
  );
};

export default connect((state) => state)(ProductWithId);
