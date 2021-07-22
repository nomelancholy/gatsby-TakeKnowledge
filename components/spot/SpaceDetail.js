import { Button, Row, Card } from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import SpaceCard from "./SpaceCard";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";

const SpaceDetail = (props) => {
  const { spotId, type, spotName } = props;
  const { user, isLoggedIn, token } = props.auth;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [spaceList, setSpaceList] = useState([]);

  useEffect(() => {
    if (type && spotId) {
      switch (type) {
        case "lounge":
          setTitle("라운지");
          break;
        case "meeting":
          setTitle("미팅룸");
          break;
        case "coworking":
          setTitle("코워킹룸");
          break;

        case "locker":
          setTitle("락커");
          break;
        default:
          break;
      }

      const config = {
        method: "post",
        url: `${process.env.BACKEND_API}/spot/space/list`,
        headers: {
          Authorization: decodeURIComponent(token),
        },
        data: {
          spot_id: spotId,
          type: type,
        },
      };

      axios(config)
        .then(function (response) {
          setSpaceList(response.data.items);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [spotId, type]);

  const handleAddSpace = () => {
    const newList = spaceList.concat({});
    setSpaceList(newList);
  };

  const handleSpaceDeleted = (spaceId) => {
    const newSpaceLIst = spaceList.filter(
      (space) => space.space_id !== spaceId
    );
    setSpaceList(newSpaceLIst);
  };

  return (
    <>
      <Card
        title={`${title} 관리`}
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
      >
        <Row gutter={16}>
          <h3>{`스팟 명 : ${spotName}`}</h3>
        </Row>
        <Button onClick={handleAddSpace}>+</Button>
        <Card
          title={`${title} 리스트`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
        >
          {spaceList.map((spaceObj) => (
            <>
              <SpaceCard
                key={spaceObj.space_id}
                spotId={spotId}
                spaceInfo={spaceObj}
                type={type}
                title={title}
                handleSpaceDeleted={handleSpaceDeleted}
              />
            </>
          ))}
        </Card>
      </Card>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(SpaceDetail);
