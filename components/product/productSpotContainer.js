import { Card } from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { PlusCircleOutlined } from "@ant-design/icons";
import ProductSpot from "./productSpot";

const ProductSpotContainer = (props) => {
  const {
    token,
    productInfo,
    productId,
    productType,
    productCategory,
    productTimeUnit,
  } = props;

  // 사용 가능 스팟 리스트
  const [availableSpotList, setAvailableSpotList] = useState(undefined);
  // 드롭 다운 옵션으로 사용할 스팟 리스트
  // 카드가 추가될 때 마다 옵션 스팟 호출하는 걸 방지하기 위해서 container에서 한번 받고 계속 사용
  const [optionSpotList, setOptionSpotList] = useState(undefined);

  useEffect(() => {
    console.log(`productId`, productId);
    // 드롭 다운 옵션으로 사용할 스팟 리스트 조회
    getOptionSpotList();

    if (productInfo && productInfo.maps) {
      // console.log(`productInfo`, productInfo);
      // 내려오는 productInfo 가 있는 경우
      setAvailableSpotList(productInfo.maps);
    } else {
      // 방금 상품 등록을 마친 경우
      setAvailableSpotList([]);
    }
  }, []);

  // 드롭 다운 옵션으로 내려줄 스팟 조회
  const getOptionSpotList = () => {
    // console.log("call getOptionsSpotList");
    axios
      .post(
        `${process.env.BACKEND_API}/admin/spot/list`,
        { page: 1, size: 100 },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            Authorization: decodeURIComponent(token),
          },
        }
      )
      .then((response) => {
        const data = response.data.items;
        // 활성화된 스팟들만 사용 가능 스팟으로 세팅 -> 다 불러서 disabled 시키는 쪽으로 변경
        // const activeSpotList = data.filter((spot) => spot.status === "active");
        setOptionSpotList(data);
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  // 사용 가능한 스팟 추가
  const handleAddSpot = () => {
    // 새로운 스팟 추가시 현재 있는 가장 뒤쪽 spot_id + 1 부터 부여
    let newSpotId = 0;

    if (availableSpotList.length > 0) {
      const newSpotList = availableSpotList.filter((spot) => {
        return typeof spot.spot.spot_id === "string";
      });

      if (newSpotList.length > 0) {
        // 스팟 리스트에 new 리스트가 있는 경우
        newSpotList.map((spot, index) => {
          newSpotId = index + 1;
        });
      } else {
        // 서버에서 받아온 스팟 리스트만 있는 경우
        availableSpotList.map((spot) => {
          if (spot.spot_id > newSpotId) {
            newSpotId = spot.spot_id;
          }
        });
      }
    }

    newSpotId = `new${newSpotId + 1}`;

    const newList = availableSpotList.concat({ spot: { spot_id: newSpotId } });
    setAvailableSpotList(newList);
  };

  // 사용 가능한 스팟 삭제
  const handleSpotDeleted = (spotId) => {
    let newSpotList;
    // 삭제 버튼 클릭한 카드 필터링
    if (spotId) {
      newSpotList = availableSpotList.filter(
        (spot) => spot.spot.spot_id !== spotId
      );
    }

    setAvailableSpotList(newSpotList);
  };

  return (
    <Card
      title="사용 가능 스팟"
      extra={
        <>
          <a onClick={handleAddSpot}>
            <PlusCircleOutlined />
          </a>
        </>
      }
      bodyStyle={{ padding: "1rem" }}
      className="mb-4"
    >
      {availableSpotList &&
        optionSpotList &&
        availableSpotList.map((spot, index) => (
          <ProductSpot
            key={spot.spot ? spot.spot.spot_id : `new${index}`}
            spotInfo={spot}
            handleSpotDeleted={handleSpotDeleted}
            optionSpotList={optionSpotList}
            productInfo={productInfo}
            productType={productType}
            productCategory={productCategory}
            productTimeUnit={productTimeUnit}
            token={token}
            productId={productId}
          />
        ))}
    </Card>
  );
};

export default connect((state) => state)(ProductSpotContainer);
