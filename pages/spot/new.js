import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import React from "react";
import { connect } from "react-redux";
import SpotDetail from "../../components/spot/SpotDetail";

// 등록 버튼 클릭시 스팟 바로 생성되게 변경 - 사용하지 않음
const SpotNew = (props) => {
  return <SpotDetail spotId={null} />;
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(SpotNew);
