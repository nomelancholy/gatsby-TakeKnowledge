import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import SpaceDetail from "../../../../components/spot/SpaceDetail";
import axios from "axios";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";

const Meeting = (props) => {
  const { user, isLoggedIn, token } = props.auth;
  const router = useRouter();
  const { id } = router.query;
  const [type, setType] = useState("");
  const [spotName, setSpotName] = useState(undefined);

  // props로 보낼 spotName 세팅
  useEffect(() => {
    const resourcese = router.pathname.split("/");
    const type = resourcese[resourcese.length - 1];
    setType(type);

    const spotConfig = {
      method: "post",
      url: `${process.env.BACKEND_API}/spot/get`,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: {
        spot_id: id,
      },
    };

    axios(spotConfig)
      .then(function (response) {
        setSpotName(response.data.name);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <>
      {id && type && spotName && (
        <SpaceDetail spotId={id} type={type} spotName={spotName} />
      )}
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(Meeting);
