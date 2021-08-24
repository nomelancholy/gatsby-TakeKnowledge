import {
  Button,
  Form,
  Input,
  Modal,
  Card,
  Col,
  Select,
  Table,
  Popconfirm,
} from "antd";

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useForm } from "antd/lib/form/Form";
import CheckableTag from "@components/elements/CheckableTag";
import TimeTable from "@components/elements/TimeTable";

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

  const [form] = useForm();

  // timeTable에 props로 내려줄 이벤트 state
  const [events, setEvents] = useState([]);
  // timeTable 잡을 캘린더
  const calendarRef = useRef(null);

  // 사용 가능 스팟 등록 / 수정 구분
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    console.log(`spotInfo`, spotInfo);
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

      // 날짜 timetable에 바인딩

      // 이벤트 저장할 array
      const eventArray = [];
      // 캘린더에 세팅된 날짜 조회
      const calendarDateArray = getCalendarDate();
      // time_table 검색을 위한 요일 순서대로
      const dayArray = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      // timetable 객체 검색을 위해 배열로 분해
      const timeTableArray = Object.entries(spotInfo.time_table);

      dayArray.map((day, i) => {
        // timeTableArray에서 day에 해당하는 st, end 값 추출
        const timePair = timeTableArray.filter((arr) => {
          // arr[0] = Object.key
          return arr[0].startsWith(day);
        });

        // st, end 모두 0인 경우가 아니면
        if (!(timePair[0][1] === 0 && timePair[1][1] === 0)) {
          // 서버에서 보내는 객체의 순서를 바꾸지 않는 한 st가
          // timePair[0] 이 st / timePair[1]이 end

          // 캘린더에서 그 요일에 해당하는 날짜 추출
          const year = calendarDateArray[i].getFullYear();
          const month = calendarDateArray[i].getMonth();
          const date = calendarDateArray[i].getDate();

          const startTime = new Date(year, month, date, timePair[0][1], 0, 0);
          const endTime = new Date(year, month, date, timePair[1][1], 0, 0);

          let startHourStr = timePair[0][1].toString();
          let endHourStr = timePair[1][1].toString();

          // 한 자리일 경우 앞에 0추가
          if (startHourStr.length === 1) {
            startHourStr = `0${startHourStr}`;
          }

          if (endHourStr.length === 1) {
            endHourStr = `0${endHourStr}`;
          }

          // event객체 생성 및 추가
          const eventObj = {
            start: startTime,
            end: endTime,
            display: "block",
            eventId: `${dayArray[i]}/${startHourStr}-${endHourStr}`,
          };

          eventArray.push(eventObj);
        }
      });

      setEvents([...events, ...eventArray]);
    } else {
      // 새로 등록하는 경우
      setIsNew(true);
    }
  }, []);

  // timeTable에 세팅되어 있는 날짜 불러오는 함수
  const getCalendarDate = () => {
    // 캘린더 시작일
    let calendarStartDate =
      calendarRef.current._calendarApi.currentDataManager.data.dateProfile
        .activeRange.start;

    // calendarStartDate에 그대로 세팅하니 메모리에서 데이터 값이 꼬여서 복사하는 방식으로 진행
    const fullYear = calendarStartDate.getFullYear();
    const month = calendarStartDate.getMonth();
    const date = calendarStartDate.getDate();

    let firstDate = new Date(fullYear, month, date);

    // calendarDateArray에 일주일치 값 추가
    const calendarDateArray = [];

    calendarDateArray.push(firstDate);

    for (let i = 1; i < 7; i++) {
      const nextDate = new Date(fullYear, month, date + i);
      calendarDateArray.push(nextDate);
    }

    return calendarDateArray;
  };

  // 수정 or 등록 버튼 클릭
  const handleSpotChangeSumbit = (values) => {
    // 날짜 전송
    // 넘어온 값이 없는 요일 찾기 위한 기준 배열
    let offDayArray = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    // 전송용 데이터 저장 객체
    let schedule = {};

    events.map((event) => {
      // event가 존재하는 요일
      const eventDay = event.eventId.split("/")[0];
      const eventTime = event.eventId.split("/")[1];

      // 값이 들어간 요일은 배열에서 제외
      offDayArray = offDayArray.filter((day) => {
        return day != eventDay;
      });

      // 요일 : 시간을 key-value로 넣어 객체 생성
      const time = { [eventDay]: eventTime };
      // schedule 객체에 추가
      schedule = { ...schedule, ...time };
    });

    // 값이 없는 날 0-0으로 추가
    if (offDayArray.length !== 0) {
      offDayArray.map((day) => {
        const time = { [day]: "0-0" };
        schedule = { ...schedule, ...time };
      });
    }

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
    console.log(`spotInfo`, spotInfo);
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
          handleSpotDeleted(spotInfo.sm_id);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 옵션 스팟이 바뀔 때 사용 가능 공간 변경
  const handleOptionSpotChange = (value) => {
    const spotConfig = {
      method: "get",
      url: `${process.env.BACKEND_API}/admin/spot/get/${value}`,
      headers: {
        Authorization: decodeURIComponent(token),
      },
    };

    axios(spotConfig)
      .then(function (response) {
        const spotData = response.data;

        if (
          spotInfo.length !== 0 &&
          spotInfo.spaces &&
          spotInfo.spaces.length !== 0
        ) {
          // 이미 상품에 사용 가능 공간 데이터가 있는 경우
          const optionSpotSpaces = [...spotData.spaces];

          // 체크된 space들 includes로 찾기 편한 방식으로 가공
          const checkedSpaceIdArray = spotInfo.spaces.map(
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
          <Popconfirm
            title={"삭제하시겠습니까?"}
            onConfirm={handleSpotRemove}
            okText={"삭제"}
            cancelText={"취소"}
          >
            <Button>삭제</Button>
          </Popconfirm>
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
            <div>
              <TimeTable
                calendarRef={calendarRef}
                events={events}
                setEvents={setEvents}
              />
            </div>
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
                cancelButtonProps={{ style: { display: "none" } }}
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
