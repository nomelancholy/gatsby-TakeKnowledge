import React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import SpotDetail from "../../../components/spot/SpotDetail";

const SpotWithId = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <SpotDetail spotId={id} />
    </>
  );
};

export default connect((state) => state)(SpotWithId);
