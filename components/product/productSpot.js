import {
  Button,
  Form,
  Input,
  Modal,
  Card,
  Col,
  Select,
  Table,
  DatePicker,
  TimePicker,
} from "antd";

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useForm } from "antd/lib/form/Form";
import CheckableTag from "@components/elements/CheckableTag";
import TimeTable from "@components/elements/TimeTable";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timegridPlugin from "@fullcalendar/resource-timegrid";
import moment, { locale } from "moment";
import { format, addMinutes } from "date-fns";
import { FullCalendarLicense } from "@utils/config";

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

  // 서버 전송용 사용 가능 시간 state
  const [monTime, setMonTime] = useState("");
  const [tueTime, setTueTime] = useState("");
  const [wedTime, setWedTime] = useState("");
  const [thuTime, setThuTime] = useState("");
  const [friTime, setFriTime] = useState("");
  const [satTime, setSatTime] = useState("");
  const [sunTime, setSunTime] = useState("");

  // TimePicker 값 세팅용 사용 가능 시간 state
  const [monSettingTime, setMonSettingTime] = useState([]);
  const [tueSettingTime, setTueSettingTime] = useState([]);
  const [wedSettingTime, setWedSettingTime] = useState([]);
  const [thuSettingTime, setThuSettingTime] = useState([]);
  const [friSettingTime, setFriSettingTime] = useState([]);
  const [satSettingTime, setSatSettingTime] = useState([]);
  const [sunSettingTime, setSunSettingTime] = useState([]);

  // 사용 가능 스팟 등록 / 수정 구분
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

      const monTime = [
        moment(spotInfo.timetable.mon_st, "HH"),
        moment(spotInfo.timetable.mon_end, "HH"),
      ];

      setMonSettingTime(monTime);

      const tueTime = [
        moment(spotInfo.timetable.tue_st, "HH"),
        moment(spotInfo.timetable.tue_end, "HH"),
      ];

      setTueSettingTime(tueTime);

      const wedTime = [
        moment(spotInfo.timetable.wed_st, "HH"),
        moment(spotInfo.timetable.wed_end, "HH"),
      ];

      setWedSettingTime(wedTime);

      const thuTime = [
        moment(spotInfo.timetable.thu_st, "HH"),
        moment(spotInfo.timetable.thu_end, "HH"),
      ];

      setThuSettingTime(thuTime);

      const friTime = [
        moment(spotInfo.timetable.fri_st, "HH"),
        moment(spotInfo.timetable.fri_end, "HH"),
      ];

      setFriSettingTime(friTime);

      const satTime = [
        moment(spotInfo.timetable.sat_st, "HH"),
        moment(spotInfo.timetable.sat_end, "HH"),
      ];

      setSatSettingTime(satTime);

      const sunTime = [
        moment(spotInfo.timetable.sun_st, "HH"),
        moment(spotInfo.timetable.sun_end, "HH"),
      ];

      setSunSettingTime(sunTime);
    } else {
      // 새로 등록하는 경우
      setIsNew(true);
    }
  }, []);

  useEffect(() => {
    console.log(`monSettingTime`, monSettingTime);
  }, [monSettingTime]);

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

  const handleTime = (day, time) => {
    switch (day) {
      case "mon":
        setMonTime(time);
        break;
      case "tue":
        setTueTime(time);
        break;
      case "wed":
        setWedTime(time);
        break;
      case "thu":
        setThuTime(time);
        break;
      case "fri":
        setFriTime(time);
        break;
      case "sat":
        setSatTime(time);
        break;
      case "sun":
        setSunTime(time);
        break;
      default:
        break;
    }
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
            <div>
              {/* TO-DO : dragabble timetable */}
              {/* <TimeTable /> */}
              {/* <Table
              columns={columns}
              dataSource={tableData}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    console.log(`event`, event);
                  }, // click row
                  onDoubleClick: (event) => {}, // double click row
                  onContextMenu: (event) => {}, // right button click row
                  onMouseEnter: (event) => {}, // mouse enter row
                  onMouseLeave: (event) => {}, // mouse leave row
                };
              }}
            ></Table> */}
              {/* 월{" "}
              <TimePicker.RangePicker
                showTime={{ format: "HH" }}
                format="HH"
                placeholder={["Start Time", "End Time"]}
                value={monSettingTime}
                onChange={(date, dateString) => {
                  const day = "mon";
                  let time = "";

                  if (dateString[1] == "00") {
                    time = `${dateString[0]}-24`;
                  } else {
                    time = dateString.join("-");
                  }

                  handleTime(day, time);
                  setMonSettingTime(date);
                }}
              />
              화{" "}
              <TimePicker.RangePicker
                showTime={{ format: "HH" }}
                format="HH"
                placeholder={["Start Time", "End Time"]}
                value={tueSettingTime}
                onChange={(date, dateString) => {
                  const day = "tue";
                  let time = "";

                  if (dateString[1] == "00") {
                    time = `${dateString[0]}-24`;
                  } else {
                    time = dateString.join("-");
                  }

                  handleTime(day, time);
                  setTueSettingTime(date);
                }}
              />
              수{" "}
              <TimePicker.RangePicker
                showTime={{ format: "HH" }}
                format="HH"
                placeholder={["Start Time", "End Time"]}
                value={wedSettingTime}
                onChange={(date, dateString) => {
                  const day = "wed";
                  let time = "";

                  if (dateString[1] == "00") {
                    time = `${dateString[0]}-24`;
                  } else {
                    time = dateString.join("-");
                  }

                  handleTime(day, time);
                  setWedSettingTime(date);
                }}
              />
              목{" "}
              <TimePicker.RangePicker
                showTime={{ format: "HH" }}
                format="HH"
                placeholder={["Start Time", "End Time"]}
                value={thuSettingTime}
                onChange={(date, dateString) => {
                  const day = "thu";
                  let time = "";

                  if (dateString[1] == "00") {
                    time = `${dateString[0]}-24`;
                  } else {
                    time = dateString.join("-");
                  }

                  handleTime(day, time);
                  setThuSettingTime(date);
                }}
              />
              금{" "}
              <TimePicker.RangePicker
                showTime={{ format: "HH" }}
                format="HH"
                value={friSettingTime}
                placeholder={["Start Time", "End Time"]}
                onChange={(date, dateString) => {
                  const day = "fri";
                  let time = "";

                  if (dateString[1] == "00") {
                    time = `${dateString[0]}-24`;
                  } else {
                    time = dateString.join("-");
                  }

                  handleTime(day, time);
                  setFriSettingTime(date);
                }}
              />
              토{" "}
              <TimePicker.RangePicker
                showTime={{ format: "HH" }}
                format="HH"
                value={satSettingTime}
                placeholder={["Start Time", "End Time"]}
                onChange={(date, dateString) => {
                  const day = "sat";
                  let time = "";

                  if (dateString[1] == "00") {
                    time = `${dateString[0]}-24`;
                  } else {
                    time = dateString.join("-");
                  }

                  handleTime(day, time);
                  setSatSettingTime(date);
                }}
              />
              일{" "}
              <TimePicker.RangePicker
                showTime={{ format: "HH" }}
                format="HH"
                value={sunSettingTime}
                placeholder={["Start Time", "End Time"]}
                onChange={(date, dateString) => {
                  const day = "sun";
                  let time = "";

                  if (dateString[1] == "00") {
                    time = `${dateString[0]}-24`;
                  } else {
                    time = dateString.join("-");
                  }

                  handleTime(day, time);
                  setSunSettingTime(date);
                }}
              /> */}
              <FullCalendar
                schedulerLicenseKey={FullCalendarLicense}
                plugins={[interactionPlugin, timegridPlugin]}
                initialView="resourceTimeGridDay"
                resource={[
                  { id: "a", title: "Room A" },
                  { id: "b", title: "Room B" },
                  { id: "c", title: "Room C" },
                  { id: "d", title: "Room D" },
                ]}
                eventDisplay="background"
                height="auto"
                allDaySlot={false}
                slotMinTime="00:00:00"
                slotMaxTime="24:00:00"
                handleWindowResize={true}
                selectable={true}
                selectOverlap={false}
                unselectAuto={false}
                slotMinWidth={60}
                slotLaneContent={(arg) => {
                  const timeHour = format(arg.date, "H시");
                  const timeMinutes = format(arg.date, "mm");
                  return timeMinutes == "00" ? <span>{timeHour}</span> : <></>;
                }}
                headerToolbar={{
                  left: "",
                  center: "",
                  right: "",
                }}
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
