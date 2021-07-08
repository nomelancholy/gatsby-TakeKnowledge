import { Button, Row, Card } from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import SpaceCard from "./SpaceCard";

const SpaceDetail = (props) => {
  const { spotId, type, spotName } = props;
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
        case "cowork":
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
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjUsInVzZXJfbG9naW4iOiJjc0BkbWFpbi5pbyIsInVzZXJfbmFtZSI6Ilx1Yzc3OFx1YzEzMSIsInVzZXJfcm9sZSI6ImZmYWRtaW4iLCJwaG9uZSI6IjAxMC0zNjc0LTc1NjMiLCJtYXJrZXRpbmdfYWdyZWUiOjEsImdyb3VwX2lkIjpudWxsLCJleHAiOjE2NTY5NDkzMTh9.TMNWMrhtKzYb0uCFLuqTbqKE19ZXVzT0nRBqsPN5N4I",
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

export default connect((state) => state)(SpaceDetail);
