import { Button, Form, Input, Modal, Card, Col, Select } from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useForm } from "antd/lib/form/Form";
import CheckableTag from "@components/elements/CheckableTag";

const ProductSpot = (props) => {
  const { spotInfo, productId, handleSpotDeleted, optionSpotList, token } =
    props;

  // spot 별로 달라지는 사용 가능 공간 저장 state
  const [availableSpaces, setAvailableSpaces] = useState([]);
  // 선택한 공간 정보 저장 state (전송 옵션)
  const [selectedSpaces, setSelectedSpaces] = useState([]);

  // 등록 수정 flag state
  const [isNew, setIsNew] = useState(false);

  // 모달 관련 state
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [form] = useForm();

  // 사용 가능 시간 세팅 state
  const [monTime, setMonTime] = useState("0-24");
  const [tueTime, setTueTime] = useState("0-24");
  const [wedTime, setWedTime] = useState("0-24");
  const [thuTime, setThuTime] = useState("0-24");
  const [friTime, setFriTime] = useState("0-24");
  const [satTime, setSatTime] = useState("0-0");
  const [sunTime, setSunTime] = useState("0-0");

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // 내려오는 데이터가 있고 +로 추가한 경우가 아닌지 확인
    if (spotInfo.length !== 0 && spotInfo.spot) {
      // Option Spot list 중 inactive || trash 인 것들 세팅
      const unavailableSpotList = optionSpotList.filter(
        (spot) => spot.status !== "active"
      );

      // spotInfo로 내려온 spot이  unavailableSpotList 에 있는지 확인
      const checkList = unavailableSpotList.filter(
        (spot) => spot.spot_id === spotInfo.spot.spot_id
      );

      // isActive 상태값 조절
      if (checkList.length > 0) {
        setIsActive(false);
      } else {
        // active spot 일 경우 해당 spot의 모든 공간 조회
        handleOptionSpotChange(spotInfo.spot.spot_id);
      }

      form.setFieldsValue({
        spot: spotInfo.spot.spot_id,
      });

      setMonTime(`${spotInfo.timetable.mon_st}-${spotInfo.timetable.mon_end}`);
      setTueTime(`${spotInfo.timetable.tue_st}-${spotInfo.timetable.tue_end}`);
      setWedTime(`${spotInfo.timetable.wed_st}-${spotInfo.timetable.wed_end}`);
      setThuTime(`${spotInfo.timetable.thu_st}-${spotInfo.timetable.thu_end}`);
      setFriTime(`${spotInfo.timetable.fri_st}-${spotInfo.timetable.fri_end}`);
      setSatTime(`${spotInfo.timetable.sat_st}-${spotInfo.timetable.sat_end}`);
      setSunTime(`${spotInfo.timetable.sun_st}-${spotInfo.timetable.sun_end}`);
    } else {
      // 새로 등록하는 경우
      setIsNew(true);
    }
  }, []);

  // 수정 or 등록 버튼 클릭
  const handleSpotChangeSumbit = (values) => {
    const schedule = {
      mon: monTime,
      tue: tueTime,
      wed: wedTime,
      thu: thuTime,
      fri: friTime,
      sat: satTime,
      sun: sunTime,
    };

    const config = {
      method: "post",
      url: `${process.env.BACKEND_API}/admin/product/space/edit`,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: {
        product_id: productId,
        spot_id: values.spot,
        spaces: selectedSpaces,
        schedule: schedule,
      },
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setUpdateModalVisible(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 삭제
  const handleSpotRemove = () => {
    const config = {
      method: "post",
      url: `${process.env.BACKEND_API}/admin/product/space/delete`,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: { spot_id: spotInfo.spot.spot_id, product_id: productId },
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          // 상위 컴포넌트에 spot id 전달해서 리스트에서 제외
          // if (spotInfo.spot) {
          // } else {
          //   handleSpotDeleted(false);
          // }
          handleSpotDeleted(spotInfo.spot.spot_id);
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    setDeleteModalVisible(false);
  };

  const handleTime = (e) => {
    switch (e.target.name) {
      case "mon":
        setMonTime(e.target.value);
        break;
      case "tue":
        setTueTime(e.target.value);
        break;
      case "wed":
        setWedTime(e.target.value);
        break;
      case "thu":
        setThuTime(e.target.value);
        break;
      case "fri":
        setFriTime(e.target.value);
        break;
      case "sat":
        setSatTime(e.target.value);
        break;
      case "sun":
        setSunTime(e.target.value);
        break;
      default:
        break;
    }
  };

  // 옵션 스팟이 바뀔 때 사용 가능 공간 변경
  const handleOptionSpotChange = (value) => {
    const spotConfig = {
      method: "post",
      url: `${process.env.BACKEND_API}/spot/get`,
      headers: {
        Authorization: decodeURIComponent(token),
      },
      data: {
        spot_id: value,
      },
    };

    axios(spotConfig)
      .then(function (response) {
        const spotData = response.data;

        if (
          spotInfo.length !== 0 &&
          spotInfo.space &&
          spotInfo.space.length !== 0
        ) {
          // 이미 상품에 사용 가능 공간 데이터가 있는 경우
          const optionSpotSpaces = [...spotData.spaces];

          // 체크된 space들 includes로 찾기 편한 방식으로 가공
          const checkedSpaceIdArray = spotInfo.space.map(
            (space) => space.space_id
          );

          let availableSpaces = [];
          // 스팟에 있는 전체 사용 가능 공간 중 상품에서 체크한 공간에 checked: true 세팅
          const newOptionSpotSpaces = optionSpotSpaces.map((space) => {
            if (checkedSpaceIdArray.includes(space.space_id)) {
              // 전송용 사용가능공간 데이터에 id 추가
              availableSpaces.push(space.space_id);

              // 옵션용 사용공간에 checked 추가해서 return
              return { ...space, checked: true };
            } else {
              return space;
            }
          });

          // 전송용 사용 가능 공간 데이터 세팅
          setSelectedSpaces(availableSpaces);
          // 옵션용 사용 가능 공간 데이터 세팅
          setAvailableSpaces(newOptionSpotSpaces);
        } else {
          // 상품에 사용 가능 공간 데이터 없는 경우
          setAvailableSpaces(spotData.spaces);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 사용 가능 공간 클릭시 전송용 옵션 state에 저장
  const handleAvailableSpaceChange = (id, checked) => {
    if (checked) {
      // 추가
      let newSelectedSpaces;

      if (selectedSpaces.length === 0) {
        newSelectedSpaces = [];
      } else {
        newSelectedSpaces = [...selectedSpaces];
      }

      newSelectedSpaces.push(id);

      setSelectedSpaces(newSelectedSpaces);
    } else {
      // 삭제
      let newSelectedSpaces;

      if (selectedSpaces.length === 0) {
        newSelectedSpaces = [];
      } else {
        newSelectedSpaces = [...selectedSpaces];
        newSelectedSpaces = newSelectedSpaces.filter((space) => space !== id);
      }

      setSelectedSpaces(newSelectedSpaces);
    }
  };

  return (
    <Col sm={24} md={8} className="mb-4">
      <Card>
        <>
          <Button onClick={() => setDeleteModalVisible(true)}>삭제</Button>
          <Modal
            visible={deleteModalVisible}
            okText="확인"
            cancelText="취소"
            onOk={handleSpotRemove}
            onCancel={() => {
              setDeleteModalVisible(false);
            }}
          >
            <p>정말 삭제하시겠습니까?</p>
          </Modal>
        </>
        <Form form={form} onFinish={handleSpotChangeSumbit}>
          <Form.Item name="spot" label="스팟 선택">
            <Select
              initialValues="-"
              style={{ width: 500 }}
              onChange={handleOptionSpotChange}
            >
              {optionSpotList.map((optionSpot) => (
                <Select.Option
                  key={optionSpot.spot_id}
                  value={optionSpot.spot_id}
                  disabled={optionSpot.status === "active" ? false : true}
                >
                  {optionSpot.status === "active"
                    ? optionSpot.name
                    : `${optionSpot.name} ${
                        optionSpot.status === "inactive" ? "(비활성)" : "(삭제)"
                      }`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {isActive && (
            <Form.Item name="spaces" label="사용 가능 공간">
              {availableSpaces.map((availableSpace) => (
                <CheckableTag
                  id={availableSpace.space.space_id}
                  label={availableSpace.space.name}
                  key={availableSpace.space_id}
                  onChange={handleAvailableSpaceChange}
                  checked={availableSpace.checked}
                />
              ))}
            </Form.Item>
          )}

          <Form.Item name="schedule" label="사용 가능 시간">
            월{" "}
            <Input name="mon" value={monTime} onChange={(e) => handleTime(e)} />
            화{" "}
            <Input name="tue" value={tueTime} onChange={(e) => handleTime(e)} />
            수{" "}
            <Input name="wed" value={wedTime} onChange={(e) => handleTime(e)} />
            목{" "}
            <Input name="thu" value={thuTime} onChange={(e) => handleTime(e)} />
            금{" "}
            <Input name="fri" value={friTime} onChange={(e) => handleTime(e)} />
            토{" "}
            <Input name="sat" value={satTime} onChange={(e) => handleTime(e)} />
            일{" "}
            <Input name="sun" value={sunTime} onChange={(e) => handleTime(e)} />
          </Form.Item>
          {isActive && (
            <>
              <Button type="primary" htmlType="submit">
                {isNew ? "등록" : "수정"}
              </Button>
              <Modal
                visible={updateModalVisible}
                okText="확인"
                onOk={() => setUpdateModalVisible(false)}
              >
                <p>{isNew ? "등록" : "수정"} 완료 되었습니다.</p>
              </Modal>
            </>
          )}
        </Form>
      </Card>
    </Col>
  );
};

export default connect((state) => state)(ProductSpot);
