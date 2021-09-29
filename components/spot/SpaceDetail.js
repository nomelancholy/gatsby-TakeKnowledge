import { Button, Row, Card } from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import SpaceCard from "./SpaceCard";
import { wrapper } from "@state/stores";
import initialize from "@utils/initialize";
import { PlusOutlined } from "@ant-design/icons";

const SpaceDetail = (props) => {
  const { spotId, type, spotName } = props;
  const { user, isLoggedIn, token } = props.auth;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [spaceList, setSpaceList] = useState([]);

  useEffect(() => {
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

    // Space의 상세 페이지긴 하지만 props가 전달되는 하위 컴포넌트가 아니기에
    // 주소에서 받아온 spotId와 type을 활용해 space list 다시 호출
    // router에서 값 받아오는 코드는 (page/spot/[id]/space_type/index.js)에 존재

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
  }, []);

  // 공간 추가
  const handleAddSpace = () => {
    // 신규 공간 생성시 현재 있는 가장 뒤쪽 space_id + 1 부터 부여
    let newId = 0;

    spaceList.map((space) => {
      if (space.space_id > newId) {
        newId = space.space_id;
      }
    });

    newId = newId + 1;

    const newList = spaceList.concat({ space_id: newId });
    setSpaceList(newList);
  };

  const handleSpaceDeleted = (spaceId) => {
    const newSpaceList = spaceList.filter(
      (space) => space.space_id !== spaceId
    );
    setSpaceList(newSpaceList);
  };

  return (
    <>
      <Card
        title={`${title} 관리`}
        extra={<a onClick={() => router.back()}>뒤로 가기</a>}
        bodyStyle={{ padding: "1rem" }}
        className="mb-4"
        key="manage"
      >
        <Card
          title={`스팟 명 : ${spotName}`}
          bodyStyle={{ padding: "1rem" }}
          className="mb-4"
          key="spot"
        >
          <Card
            title={`${title} 리스트`}
            bodyStyle={{ padding: "1rem" }}
            className="mb-4"
            extra={<Button onClick={handleAddSpace} icon={<PlusOutlined />} />}
            key="list"
          >
            <>
              {spaceList.map((spaceObj) => (
                <SpaceCard
                  key={spaceObj.space_id}
                  spaceInfo={spaceObj}
                  spotId={spotId}
                  type={type}
                  title={title}
                  handleSpaceDeleted={handleSpaceDeleted}
                />
              ))}
            </>
          </Card>
        </Card>
      </Card>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((ctx) => {
  return { props: initialize(ctx) };
});

export default connect((state) => state)(SpaceDetail);
