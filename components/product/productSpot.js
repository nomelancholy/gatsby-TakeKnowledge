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
  Checkbox,
} from "antd";

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useForm } from "antd/lib/form/Form";
import CheckableTag from "@components/elements/CheckableTag";
import TimeTable from "@components/elements/TimeTable";

const ProductSpot = (props) => {
  const {
    spotInfo,
    productId,
    handleSpotDeleted,
    optionSpotList,
    token,
    productInfo,
    productType,
    productCategory,
    productTimeUnit,
  } = props;

  // 운영 요일 checkbox 옵션
  const workingDaysOptions = [
    { label: "월", value: "1" },
    { label: "화", value: "2" },
    { label: "수", value: "3" },
    { label: "목", value: "4" },
    { label: "금", value: "5" },
    { label: "토", value: "6" },
    { label: "일", value: "7" },
  ];

  // 등록 수정 flag state
  const [isNew, setIsNew] = useState(true);

  // spot 내부의 space 전체 정보 저장 state
  const [spotSpaces, setSpotSpaces] = useState([]);

  // spot 내부의 space 정보중 상태 카테고리에 따라 필터링한 정보 저장 state
  const [filteredSpotSpaces, setFilteredSpotSpaces] = useState([]);

  // 사용 가능 시간 / 요일 falg state
  const [isTimeTable, setIsTimeTable] = useState(true);

  // 선택한 공간 정보 저장 state (서버 전송용)
  const [selectedSpotSpaces, setSelectedSpotSpaces] = useState([]);

  // timeTable에 props로 내려줄 이벤트 state
  const [events, setEvents] = useState([]);

  // 모달 관련 state
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const [form] = useForm();

  // timeTable 잡을 캘린더
  const calendarRef = useRef(null);

  useEffect(() => {
    console.log(`spotInfo`, spotInfo);
    console.log(`productInfo`, productInfo);

    if (spotInfo.length !== 0 && typeof spotInfo.spot.spot_id === "number") {
      // 서버에서 받아오는 데이터가 있는 경우

      setIsNew(false);

      // spotInfo의 spot을 선택한 스팟으로 세팅
      form.setFieldsValue({
        spot: spotInfo.spot.spot_id,
      });

      handleOptionSpotChange(spotInfo.spot.spot_id);

      // 사용 가능 시간 or 요일
      handleTimeTableConditionChange(productInfo.type, productInfo.time_unit);

      // 사용 가능 공간
      handleSpaceConditionChange(undefined, productInfo.time_unit);

      // // Option Spot list 중 inactive || trash 인 것들 세팅
      // const unavailableSpotList = optionSpotList.filter(
      //   (spot) => spot.status !== "active"
      // );

      // // spotInfo로 내려온 spot이  unavailableSpotList 에 있는지 확인
      // const checkList = unavailableSpotList.filter(
      //   (spot) => spot.spot_id === spotInfo.spot.spot_id
      // );

      // if (checkList.length > 0) {
      // } else {
      //   // active spot 일 경우 해당 spot의 모든 공간 조회
      //   handleOptionSpotChange(spotInfo.spot.spot_id);
      // }

      // 날짜 timetable에 바인딩
      if (spotInfo.time_table) {
        if (
          productInfo.type !== "membership" &&
          productInfo.time_unit === "day"
        ) {
          // 사용 가능 요일일 경우

          let useableDays = [];

          spotInfo.time_table.map((time) => {
            const dayNumber = Math.floor(time[0] / 100);
            useableDays.push(String(dayNumber));
          });

          form.setFieldsValue({
            schedule: useableDays,
          });
        } else {
          // 사용 가능 시간일 경우
          // 이벤트 저장할 array
          const eventArray = [];
          // 캘린더에 세팅된 날짜 조회
          const calendarDateArray = getCalendarDate();

          spotInfo.time_table.map((time) => {
            let startIndex = time[0].toString().charAt(0) - 1;
            let endIndex = time[1].toString().charAt(0) - 1;

            // 종료일이 일요일 24시까지인 단 한가지 경우엔
            if (time[1] === 100) {
              endIndex = 7;
            }

            const startYear = calendarDateArray[startIndex].getFullYear();
            const startMonth = calendarDateArray[startIndex].getMonth();
            const startDate = calendarDateArray[startIndex].getDate();

            const startTime = new Date(
              startYear,
              startMonth,
              startDate,
              time[0].toString().substring(1),
              0,
              0
            );

            const endYear = calendarDateArray[endIndex].getFullYear();
            const endMonth = calendarDateArray[endIndex].getMonth();
            const endDate = calendarDateArray[endIndex].getDate();

            const endTime = new Date(
              endYear,
              endMonth,
              endDate,
              time[1].toString().substring(1),
              0,
              0
            );

            const eventObj = {
              start: startTime,
              end: endTime,
              display: "block",
              eventId: `${time[0]}-${time[1]}`,
            };

            eventArray.push(eventObj);
          });

          setEvents([...events, ...eventArray]);
        }
      }
    } else {
      // 새로 등록하는 경우
      setIsNew(true);
    }
  }, []);

  useEffect(() => {
    handleTimeTableConditionChange(productType, productTimeUnit);
  }, [productType, productTimeUnit]);

  useEffect(() => {
    if (productType !== "membership") {
      // 상품 구분이 부가서비스나 이용권일 경우
      // 사용 가능 공간 새로 필터링해서 세팅
      handleSpaceConditionChange(undefined, productCategory);
    }
  }, [productCategory]);

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

    // calendarDateArray에 일주일치 + 다음 주 월요일 값까지 추가
    // 다음주 월요일 추가하는 이유 : 일요일 24시가 끝나는 날인 경우 처리를 위해
    const calendarDateArray = [];

    calendarDateArray.push(firstDate);

    for (let i = 1; i < 8; i++) {
      const nextDate = new Date(fullYear, month, date + i);
      calendarDateArray.push(nextDate);
    }

    return calendarDateArray;
  };

  // 수정 or 등록 버튼 클릭
  const handleSpotChangeSumbit = (values) => {
    console.log(`values`, values);

    let spaces = [];

    if (productType === "membership") {
      // 멤버십일 경우
      // 해당 스팟의 라운지 id를 space로 전송
      const lounge = spotSpaces.filter((spot) => {
        return spot.space.type === "lounge";
      });

      if (lounge && lounge.length > 0) {
        spaces.push(lounge[0].space_id);
      }
    } else {
      // 멤버십이 아닐 경우
      // 선택한 공간
      spaces = selectedSpotSpaces;
    }

    // 날짜 전송

    // 전송용 데이터 저장 객체
    let schedule = [];
    if (isTimeTable) {
      // 사용 가능 시간일 경우
      events.map((event) => {
        // event가 존재하는 요일
        const startDate = event.eventId.split("-")[0];
        const endDate = event.eventId.split("-")[1];

        // 이차원 배열로 생성
        const schedulePair = [startDate, endDate];

        schedule.push(schedulePair);
      });
    } else {
      // 사용 가능 요일일 경우
      values.schedule.map((value) => {
        const schedulePair = [[`${value}00`], [`${value}24`]];
        schedule.push(schedulePair);
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
        spaces: spaces,
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

  // 사용 가능 스팟 카드 삭제
  const handleSpotRemove = () => {
    // 서버로 삭제 요청 보내고
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
          // 보여지는 카드는 상위 컴포넌트에서 삭제
          handleSpotDeleted(spotInfo.sm_id);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 옵션 스팟이 바뀔 때 사용 가능 공간 변경
  const handleOptionSpotChange = (value) => {
    console.log(`value`, value);
    const spotConfig = {
      method: "get",
      url: `${process.env.BACKEND_API}/admin/spot/get/${value}`,
      headers: {
        Authorization: decodeURIComponent(token),
      },
    };

    axios(spotConfig)
      .then(function (response) {
        //  spot 정보
        const spotData = response.data;
        // 스팟에 속한 모든 공간 정보 저장
        setSpotSpaces(spotData.spaces);

        handleSpaceConditionChange(spotData.spaces);

        console.log(`spotData`, spotData);

        // if (
        //   spotInfo.length !== 0 &&
        //   spotInfo.spaces &&
        //   spotInfo.spaces.length !== 0
        // ) {
        //   console.log(`spotInfo`, spotInfo);
        //   console.log(`type`, productType);
        //   console.log(`category`, productCategory);
        //   // 이미 상품에 사용 가능 공간 데이터가 있는 경우
        //   const optionSpotSpaces = [...spotData.spaces];

        //   // 체크된 space들 includes로 찾기 편한 방식으로 가공
        //   const checkedSpaceIdArray = spotInfo.spaces.map(
        //     (space) => space.space_id
        //   );

        //   let spotSpaces = [];
        //   // 스팟에 있는 전체 사용 가능 공간 중 상품에서 체크한 공간에 checked: true 세팅
        //   const newOptionSpotSpaces = optionSpotSpaces.map((space) => {
        //     if (checkedSpaceIdArray.includes(space.space_id)) {
        //       // 전송용 사용가능공간 데이터에 id 추가
        //       spotSpaces.push(space.space_id);

        //       // 옵션용 사용공간에 checked 추가해서 return
        //       return { ...space, checked: true };
        //     } else {
        //       return space;
        //     }
        //   });

        //   // 전송용 사용 가능 공간 데이터 세팅
        //   setSelectedSpotSpaces(spotSpaces);
        //   // 옵션용 사용 가능 공간 데이터 세팅
        //   // setSpotSpaces(newOptionSpotSpaces);
        // } else {
        //   // 상품 구분이 멤버십이거나 상품 구분이 부가서비스여도 카테고리가 라운지인 경우
        //   if (
        //     productType === "membership" ||
        //     (productType === "service " && productCategory === "lounge")
        //   ) {
        //   }

        //   // 상품에 사용 가능 공간 데이터 없는 경우
        //   // setSpotSpaces(spotData.spaces);
        // }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 사용 가능 시간 or 사용 가능 요일을 결정짓는 조건 (권한 제공 기간 단위, 상품 구분) 변경시
  const handleTimeTableConditionChange = (
    productTypeParam = productType,
    productTimeUnitParam = productTimeUnit
  ) => {
    console.log(`productTypeParam`, productTypeParam);
    console.log(`productTimeUnitParam`, productTimeUnitParam);

    if (productTypeParam === "membership") {
      // 상품 구분이 멤버십일 경우
      // 다른 값들과는 상관없이 테이블로 보여준다
      setIsTimeTable(true);
    } else if (productTypeParam === "service") {
      // 상품 구분이 부가서비스일 경우
      if (productTimeUnitParam === "day") {
        console.log("day");
        // 권한 제공 기간 단위가 일간이면
        // 체크 박스 노출
        setIsTimeTable(false);
      } else {
        // 권한 제공 기간 단위가 시간이면
        // 타임 테이블 노출
        setIsTimeTable(true);
      }
    }
  };

  // 사용 가능 공간을 결정짓는 조건 (선택한 스팟, 상품 카테고리) 변경시
  const handleSpaceConditionChange = (
    spotSpacesParam = spotSpaces,
    productCategoryParam = productCategory
  ) => {
    // 스팟 공간에서 상품 카테고리와 타입이 일치하는 것만 필터링해서 세팅
    const filteredSpaces = spotSpacesParam.filter((space) => {
      return space.space.type === productCategoryParam;
    });

    setFilteredSpotSpaces(filteredSpaces);
  };

  useEffect(() => {
    console.log(`spotSpaces`, spotSpaces);
  }, [spotSpaces]);

  // 사용 가능 공간 클릭시 전송용 옵션 state에 저장
  const handleAvailableSpaceChange = (id, checked) => {
    if (checked) {
      // 추가
      let newSelectedSpotSpaces;

      if (selectedSpotSpaces.length === 0) {
        newSelectedSpotSpaces = [];
      } else {
        newSelectedSpotSpaces = [...selectedSpotSpaces];
      }

      newSelectedSpotSpaces.push(id);

      setSelectedSpotSpaces(newSelectedSpotSpaces);
    } else {
      // 삭제
      let newSelectedSpotSpaces;

      if (selectedSpotSpaces.length === 0) {
        newSelectedSpotSpaces = [];
      } else {
        newSelectedSpotSpaces = [...selectedSpotSpaces];
        newSelectedSpotSpaces = newSelectedSpotSpaces.filter(
          (space) => space !== id
        );
      }

      setSelectedSpotSpaces(newSelectedSpotSpaces);
    }
  };

  useEffect(() => {
    console.log(`isTimeTable`, isTimeTable);
  }, [isTimeTable]);

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
            <Select style={{ width: 500 }} onChange={handleOptionSpotChange}>
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
          {productType !== "membership" && (
            <Form.Item name="spaces" label="사용 가능 공간">
              {filteredSpotSpaces.map((availableSpace) => (
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

          <Form.Item
            name="schedule"
            label={isTimeTable ? "사용 가능 시간" : "사용 가능 요일"}
          >
            {isTimeTable ? (
              <div>
                <TimeTable
                  calendarRef={calendarRef}
                  events={events}
                  setEvents={setEvents}
                />
              </div>
            ) : (
              <Checkbox.Group options={workingDaysOptions} />
            )}
          </Form.Item>

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
        </Form>
      </Card>
    </Col>
  );
};

export default connect((state) => state)(ProductSpot);
